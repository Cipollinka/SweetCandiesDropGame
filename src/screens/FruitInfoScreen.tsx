import {View, Text, ScrollView} from 'react-native';
import React from 'react';
import Background from '@/components/Background';
import CustomText from '@/components/ui/CustomText';
import {Image} from 'react-native';
import Button from '@/components/ui/Button';
import {useNavigation} from '@react-navigation/native';

export default function FruitInfoScreen({route}: any) {
  const fruit = route?.params?.fruit;
  const navigation = useNavigation();

  return (
    <Background>
      <View className="flex-1 items-center m-4 gap-4 justify-center">
        <Image source={require('@/assets/images/full_label.png')} />
        <View>
          <Image source={fruit.image} className="w-[100px] h-[100px]" />
        </View>

        <View className="border-[3px] border-bordo rounded-3xl p-6 mt-2 bg-white">
          <CustomText className="text-2xl mb-4">{fruit.title}</CustomText>
          <CustomText className="text-lg">{fruit?.description}</CustomText>
        </View>

        <View className="mb-4">
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
