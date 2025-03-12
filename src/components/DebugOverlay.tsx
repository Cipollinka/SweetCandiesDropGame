// Create this as src/components/DebugOverlay.js

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const DebugOverlay = ({visible, entities, candyCount, running}) => {
  if (!visible) return null;

  // Count number of candy entities
  const candyEntities = Object.keys(entities).filter(
    key => entities[key].renderer && entities[key].renderer.name === 'Candy',
  ).length;

  return (
    <View style={styles.debugContainer}>
      <Text style={styles.debugText}>
        Entities: {Object.keys(entities).length}
      </Text>
      <Text style={styles.debugText}>Candies: {candyEntities}</Text>
      <Text style={styles.debugText}>Total Created: {candyCount}</Text>
      <Text style={styles.debugText}>
        Game Running: {running ? 'Yes' : 'No'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  debugContainer: {
    position: 'absolute',
    top: 60,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 5,
  },
  debugText: {
    color: 'white',
    fontSize: 12,
  },
});

export default DebugOverlay;
