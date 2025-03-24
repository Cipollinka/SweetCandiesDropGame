import {Image, Animated, View} from 'react-native';
import React, {useCallback, useEffect, useRef} from 'react';
import Button from '@/components/ui/Button';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {AppMachineContext} from 'App';

export default function LoadingScreen() {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim1 = useRef(new Animated.Value(-200)).current;
  const slideAnim2 = useRef(new Animated.Value(200)).current;

  const bestScore = AppMachineContext.useSelector(
      state => state.context.bestScore,
  );

  if (bestScore > 0) {
    console.log(bestScore);
    navigation.navigate('Home');
  }

  useEffect(() => {
    const animations = [
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim1, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim2, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ];

    Animated.parallel(animations).start(() => {
      // Navigate to Home screen when animations complete
      setTimeout(() => {
        // navigation.navigate('Home');
      }, 1500);
    });
  }, [fadeAnim, slideAnim1, slideAnim2, navigation]);

  return (
    <View className="flex-1">
      <Animated.View
        style={{
          opacity: fadeAnim,
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={require('@/assets/images/backgrounds/1.png')}
          className="absolute w-full h-full"
          resizeMode="stretch"
        />
        <Animated.View style={{transform: [{translateY: slideAnim1}]}}>
          <Image
            source={require('@/assets/images/label.png')}
            className="mx-auto"
            id="1"
          />
        </Animated.View>
        <Animated.View style={{transform: [{translateY: slideAnim2}]}}>
          <Image
            source={require('@/assets/images/label2.png')}
            className="mx-auto"
            id="2"
          />
        </Animated.View>
      </Animated.View>
        <View style={{position: 'absolute', alignItems: 'center', width: '100%', bottom: 100}}>
          <Button
          title="Play"
          onPress={() => navigation.navigate('Home')}
          variant="green"
        />
        </View>
    </View>
  );
}
