import React from 'react';
import Svg, {Text, TextProps} from 'react-native-svg';

interface Props extends TextProps {
  children: any;
}

export default function StrokedText({children, ...rest}: Props) {
  return (
    <Svg height="35" width="200">
      <Text
        fill="white"
        stroke="#9D0001"
        fontSize="20"
        fontFamily="Baloo-Regular"
        x="100"
        y="20"
        textAnchor="middle"
        {...rest}>
        {children}
      </Text>
    </Svg>
  );
}
