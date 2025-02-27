// Not Refectored

import React from 'react';
import {View, Image, StyleSheet, Dimensions} from 'react-native';
import { colors } from '../theme';

interface DeathMapProps {
  locations: {
    x: number;
    y: number;
  }[] | undefined;
  mapImage: string;
  mapCoordinate: {
    xMultiplier: number;
    xScalarToAdd: number;
    yMultiplier: number;
    yScalarToAdd: number;
  };
}

const Map: React.FC<DeathMapProps> = ({
  locations,
  mapImage,
  mapCoordinate,
}) => {
  const screenWidth = Dimensions.get('window').width;
  const imageWidth = screenWidth - 34;
  const imageHeight = imageWidth;

  return (
    <View style={styles.mapContainer}>
      <Image source={{uri: mapImage}} style={styles.mapImage} />
      {locations && locations.map((point, index) => {
        const x =
          ((point.y * mapCoordinate.xMultiplier +
            mapCoordinate.xScalarToAdd) *
            imageWidth) |
          0;
        const y =
          ((point.x * mapCoordinate.yMultiplier +
            mapCoordinate.yScalarToAdd) *
            imageHeight) |
          0;

        return (
          <View
            key={index}
            style={[
              styles.redDot,
              {
                left: x,
                top: y,
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    backgroundColor: colors.primary,
    marginBottom: 14,
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    aspectRatio: 1 / 1,
    resizeMode: 'contain',
  },
  redDot: {
    position: 'absolute',
    width: 5, // Adjust as needed
    height: 5, // Adjust as needed
    borderRadius: 50, // Make it circular
    backgroundColor: 'rgba(255, 0, 0, 0.5)', // Semi-transparent red
  },
});

export default Map;
