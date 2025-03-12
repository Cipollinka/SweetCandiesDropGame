import {Text, TextProps} from 'react-native';
import React from 'react';

interface Props extends TextProps {
  children: string;
}

export default function CustomText({children, ...rest}: Props) {
  return (
    <Text style={{fontFamily: 'Baloo-Regular'}} {...rest}>
      {children}
    </Text>
  );
}
