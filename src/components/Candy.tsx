import React, {useEffect, useRef} from 'react';
import {View, Animated} from 'react-native';

const Candy = props => {
  const size = props.size[0];
  const x = props.body.position.x - size / 2;
  const y = props.body.position.y - size / 2;
  const angle = props.body.angle;

  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Pulse animation when candy is created
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: props.color,
        transform: [{rotate: angle + 'rad'}, {scale: pulseAnim}],
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
      }}>
      {/* Inner circle for candy design */}
      <View
        style={{
          width: size * 0.7,
          height: size * 0.7,
          borderRadius: (size * 0.7) / 2,
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
        }}
      />
    </Animated.View>
  );
};

export default Candy;
