import {SafeAreaView} from 'react-native';
import React from 'react';
import {Image} from 'react-native';
import {backgrounds} from '@/utils/background';
import {AppMachineContext} from 'App';

interface BackgroundProps {
  children: React.ReactNode;
}

export default function Background({children}: BackgroundProps) {
  const selectedBackgroundId = AppMachineContext.useSelector(
    state => state.context.selectedBackgroundId,
  );
  const selectedBackground = backgrounds[selectedBackgroundId];

  return (
    <SafeAreaView className="flex-1">
      <Image
        source={selectedBackground}
        className="absolute w-full h-full"
        resizeMode="stretch"
        style={{flex :1, height: '110%'}}
      />
      {children}
    </SafeAreaView>
  );
}
