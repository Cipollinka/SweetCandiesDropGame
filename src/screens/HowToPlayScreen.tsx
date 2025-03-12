import {View, Image} from 'react-native';
import React from 'react';
import Background from '@/components/Background';
import CustomText from '@/components/ui/CustomText';
import Button from '@/components/ui/Button';
import {useNavigation} from '@react-navigation/native';

export default function HowToPlayScreen() {
  const navigation = useNavigation();
  return (
    <Background>
      <View className="flex-1 items-center m-4 gap-4 justify-center">
        <Image source={require('@/assets/images/full_label.png')} />
        <View className="border-[3px] border-bordo rounded-3xl p-6 mt-4 bg-white">
          <CustomText className="text-2xl mb-4">How to play?</CustomText>
          <CustomText className="text-lg">
            • Drop candies onto the board and match two of the same kind.
          </CustomText>
          <CustomText className="text-lg">
            • When candies touch, they merge into a higher-level candy.
          </CustomText>
          <CustomText className="text-lg">
            • Complete objectives by creating new candies and clearing the
            board.
          </CustomText>
        </View>

        <Button
          title="Back home"
          onPress={() => navigation.goBack()}
          variant="green"
        />
      </View>
    </Background>
  );
}
