import {
  View,
  Image,
  ImageSourcePropType,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Background from '@/components/Background';
import {useNavigation} from '@react-navigation/native';
import Button from '@/components/ui/Button';
import StrokedText from '@/components/ui/StrokedText';
import {useActor, useActorRef, useMachine} from '@xstate/react';
import {appMachine} from '@/machines/appMachine';
import clsx from 'clsx';
import {backgrounds} from '@/utils/background';
import {AppMachineContext} from 'App';

interface BackgroundProps {
  background: ImageSourcePropType;
  isSelected?: boolean;
  isLocked: boolean;
  onPress: () => void;
}

const BackgroundItem = ({
  background,
  isSelected,
  isLocked,
  onPress,
}: BackgroundProps) => {
  return (
    <TouchableOpacity
      onPress={isLocked ? undefined : onPress}
      className={clsx(
        'w-[160px] h-[220px] rounded-2xl overflow-hidden relative',
        {
          'border-[3px] border-bordo': isSelected,
          'border-[3px] border-white': !isSelected,
          'opacity-50': isLocked,
        },
      )}>
      <Image source={background} className="w-full h-full" />
      {isLocked && (
        <View className="absolute inset-0 items-center justify-center bg-black/50">
          <Image
            source={require('@/assets/images/locked.png')}
            className="w-full h-full"
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

const thresholds = [0, 1500, 2500, 4000, 5500];

export default function CustomizationScreen() {
  const navigation = useNavigation();
  const selectedBackgroundId = AppMachineContext.useSelector(
    state => state.context.selectedBackgroundId,
  );
  const bestScore = AppMachineContext.useSelector(
    state => state.context.bestScore,
  );
  const {send} = AppMachineContext.useActorRef();

  const [currentBg, setCurrentBg] = useState(0);
  const [isBgChanged, setIsBgChanged] = useState(false);

  useEffect(() => {
    setCurrentBg(selectedBackgroundId);
  }, [selectedBackgroundId]);

  const handleApply = () => {
    send({
      type: 'SELECT_BACKGROUND',
      selectedBackgroundId: currentBg,
    });
    navigation.goBack();
  };

  return (
    <Background>
      <View className="m-4 flex-1 items-center justify-center">
        <Image
          source={require('@/assets/images/full_label.png')}
          className="mx-auto"
        />

        <StrokedText>Customization:</StrokedText>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="flex-row flex-wrap justify-center gap-2">
            {backgrounds.map((bg, index) => (
              <BackgroundItem
                key={index}
                background={bg}
                isSelected={currentBg === index}
                isLocked={bestScore < thresholds[index]}
                onPress={() => {
                  !isBgChanged && setIsBgChanged(true);
                  setCurrentBg(index);
                }}
              />
            ))}
          </View>
        </ScrollView>
        <View className="my-2 mx-auto gap-2">
          {isBgChanged && (
            <Button title="Apply" onPress={handleApply} variant="yellow" />
          )}
          <Button
            title="Back home"
            onPress={() => navigation.goBack()}
            variant="green"
          />
        </View>
      </View>
    </Background>
  );
}
