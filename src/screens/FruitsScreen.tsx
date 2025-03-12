import {View, ScrollView, TouchableOpacity} from 'react-native';
import React from 'react';
import Background from '@/components/Background';
import {Image} from 'react-native';
import StrokedText from '@/components/ui/StrokedText';
import {Fruit} from '@/types/fruit';
import CustomText from '@/components/ui/CustomText';
import {fruits} from '@/utils/fruits';
import Button from '@/components/ui/Button';
import {useNavigation} from '@react-navigation/native';

interface FruitItemProps {
  fruit: Fruit;
  onPress: () => void;
}

const FruitItem = ({fruit, onPress}: FruitItemProps) => {
  return (
    <View className="bg-white rounded-2xl p-4 gap-1 border-[3px] items-center border-customRed w-[48%]">
      <Image source={fruit.image} className="w-20 h-20" />
      <CustomText className="text-xl text-center mx-auto mt-auto">
        {fruit.title}
      </CustomText>
      <TouchableOpacity
        onPress={onPress}
        className="bg-customRed rounded-2xl py-1 w-full items-center justify-center gap-4">
        <CustomText className="text-white text-xl">Read</CustomText>
      </TouchableOpacity>
    </View>
  );
};

export default function FruitsScreen() {
  const navigation = useNavigation();
  return (
    <Background>
      <View className="flex-1 items-center m-4 justify-center">
        <Image source={require('@/assets/images/full_label.png')} />
        <StrokedText fontSize={22}>Fruits</StrokedText>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="flex-row flex-wrap justify-center gap-2">
            {fruits.map(fruit => (
              <FruitItem
                key={fruit.id}
                onPress={() => navigation.navigate('FruitInfo', {fruit})}
                fruit={fruit}
              />
            ))}
          </View>
        </ScrollView>
        <View className="my-2">
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
