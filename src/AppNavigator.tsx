import React, {JSX, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '@screens/HomeScreen';
// import CandyDropGame from './screens/GameScreen';
import LoadingScreen from './screens/LoadingScreen';
import HowToPlayScreen from './screens/HowToPlayScreen';
import CustomizationScreen from './screens/CustomizationScreen';
import FruitsScreen from './screens/FruitsScreen';
import FruitInfoScreen from './screens/FruitInfoScreen';
import Game from './screens/Game';
import {AppMachineContext} from 'App';
import {loadState, saveState} from './utils/storage';

const Stack = createNativeStackNavigator();

const AppNavigator = (): JSX.Element => {
  const actor = AppMachineContext.useActorRef();

  useEffect(() => {
    // Load persisted state when app starts
    loadState().then(state => {
      if (state) {
        actor.send({
          type: 'SELECT_BACKGROUND',
          selectedBackgroundId: state.selectedBackgroundId,
        });
        actor.send({type: 'UPDATE_BEST_SCORE', score: state.bestScore});
      }
    });

    // Subscribe to state changes and persist them
    const subscription = actor.subscribe(state => {
      const {selectedBackgroundId, bestScore} = state.context;
      saveState({selectedBackgroundId, bestScore});
    });

    return () => subscription.unsubscribe();
  }, [actor]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Loading"
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}>
        <Stack.Screen
          name="Loading"
          options={{animation: 'slide_from_right'}}
          component={LoadingScreen}
        />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Game" component={Game} />
        <Stack.Screen name="HowToPlay" component={HowToPlayScreen} />
        <Stack.Screen name="Customization" component={CustomizationScreen} />
        <Stack.Screen name="Fruits" component={FruitsScreen} />
        <Stack.Screen name="FruitInfo" component={FruitInfoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
