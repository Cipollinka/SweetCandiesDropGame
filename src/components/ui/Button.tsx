import {TouchableOpacity} from 'react-native';
import React from 'react';
import CustomText from './CustomText';
import LinearGradient from 'react-native-linear-gradient';

interface Props {
  onPress: () => void;
  title: string;
  variant?: 'yellow' | 'red' | 'green';
  width?: number;
}

const GRADIENTS = {
  yellow: ['#FED813', '#FD8704'],
  red: ['#E72D2E', '#9D0001'],
  green: ['#9AFF64', '#00CF0E'],
};

export default function Button({
  onPress,
  title,
  variant = 'yellow',
  width,
}: Props) {
  return (
    <TouchableOpacity onPress={onPress}>
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        colors={GRADIENTS[variant]}
        style={{
          borderRadius: 9999,
          borderWidth: 3,
          borderColor: 'white',
          width: width || 300,
          height: 60,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <CustomText className="text-2xl text-white">{title}</CustomText>
      </LinearGradient>
    </TouchableOpacity>
  );
}
