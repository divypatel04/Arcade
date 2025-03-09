// Not Refectored

import React from 'react';
import {View, Image, StyleSheet, Dimensions} from 'react-native';
import { colors, sizes } from '../theme';

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
  mode: string
}

const Map: React.FC<DeathMapProps> = ({
  locations,
  mapImage,
  mapCoordinate,
  mode
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
                backgroundColor: mode === 'Kills' ? 'rgba(0, 34, 255, 0.5)' : 'rgba(255, 0, 0, 0.5)',
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
    marginBottom: sizes['3xl'],
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    aspectRatio: 1 / 1,
    resizeMode: 'contain',
  },
  redDot: {
    position: 'absolute',
    width: sizes.sm,
    height: sizes.sm,
    borderRadius: 50,
    // backgroundColor: 'rgba(255, 0, 0, 0.5)',
  },
});

export default Map;
