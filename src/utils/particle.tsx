import React, {useEffect, useRef} from 'react';
import {View, Animated, StyleSheet} from 'react-native';

// Particle component for merge effects
const Particle = ({position, color, onComplete}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Random direction
    const angle = Math.random() * Math.PI * 2;
    const distance = 30 + Math.random() * 50;

    Animated.parallel([
      Animated.timing(translateX, {
        toValue: Math.cos(angle) * distance,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: Math.sin(angle) * distance,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onComplete && onComplete();
    });
  }, []);

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: position.x,
          top: position.y,
          backgroundColor: color,
          transform: [{translateX}, {translateY}, {scale}],
          opacity,
        },
      ]}
    />
  );
};

// Create a set of particles for merge effect
export const createMergeEffect = (position, color, count = 12) => {
  const particles = [];

  for (let i = 0; i < count; i++) {
    particles.push(
      <Particle
        key={`particle-${i}-${Date.now()}`}
        position={position}
        color={color}
      />,
    );
  }

  return particles;
};

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
