import Background from '@/components/Background';
import Button from '@/components/ui/Button';
import StrokedText from '@/components/ui/StrokedText';
import {useNavigation} from '@react-navigation/native';
import React, {JSX} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {AppMachineContext} from 'App';

const HomeScreen = (): JSX.Element => {
  const navigation = useNavigation<any>();
  const bestScore = AppMachineContext.useSelector(
    state => state.context.bestScore,
  );

  return (
    <Background>
      <View style={styles.container}>
        <Image
          source={require('@/assets/images/full_label.png')}
          className="mx-auto"
        />

        <View className="items-center mb-4">
          <StrokedText fontSize={22}>Best score:</StrokedText>
          <StrokedText fontSize={40} y={25}>
            {bestScore.toString().padStart(4, '0')}
          </StrokedText>
        </View>

        <View className="gap-4">
          <Button
            title="Start game"
            onPress={() => navigation.navigate('Game')}
          />
          <Button
            title="How to play?"
            onPress={() => navigation.navigate('HowToPlay')}
            variant="red"
          />
          <Button
            title="Customization"
            onPress={() => navigation.navigate('Customization')}
            variant="green"
          />
          <Button
            title="Fruits"
            onPress={() => navigation.navigate('Fruits')}
            variant="green"
          />
        </View>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
