/**
 * Heatmap View Component
 * Displays interactive map heatmap showing kill/death locations
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fonts, sizes } from '../../../theme';
import Map from '../../Map';

interface Location {
  x: number;
  y: number;
}

interface MapDetails {
  id: string;
  name: string;
  location: string;
  image: string;
  mapcoordinates?: {
    xMultiplier: number;
    yMultiplier: number;
    xScalarToAdd: number;
    yScalarToAdd: number;
  };
}

interface HeatmapViewProps {
  killLocations: Location[];
  deathLocations: Location[];
  map: MapDetails;
}

export const HeatmapView: React.FC<HeatmapViewProps> = ({
  killLocations,
  deathLocations,
  map
}) => {
  const [heatmapMode, setHeatmapMode] = useState<'kills' | 'deaths'>('kills');

  return (
    <View style={styles.heatmapContainer}>
      <View style={styles.heatmapHeader}>
        <Text style={styles.sectionTitle}>PLAYER HEATMAP</Text>
        <View style={styles.heatmapModeSelector}>
          <TouchableOpacity
            style={[
              styles.modeButton,
              heatmapMode === 'kills' && styles.selectedModeButton
            ]}
            onPress={() => setHeatmapMode('kills')}
          >
            <Text
              style={[
                styles.modeButtonText,
                heatmapMode === 'kills' && styles.selectedModeButtonText
              ]}
            >
              Kills
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modeButton,
              heatmapMode === 'deaths' && styles.selectedModeButton
            ]}
            onPress={() => setHeatmapMode('deaths')}
          >
            <Text
              style={[
                styles.modeButtonText,
                heatmapMode === 'deaths' && styles.selectedModeButtonText
              ]}
            >
              Deaths
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.heatmapLegend}>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendDot,
              { backgroundColor: 'rgba(0, 34, 255, 0.5)' }
            ]}
          />
          <Text style={styles.legendText}>Kills</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendDot, { backgroundColor: 'rgba(255, 0, 0, 0.5)' }]}
          />
          <Text style={styles.legendText}>Deaths</Text>
        </View>
      </View>

      <Map
        locations={heatmapMode === 'kills' ? killLocations : deathLocations}
        mapImage={map.image}
        mapCoordinate={
          map.mapcoordinates || {
            xMultiplier: 1,
            yMultiplier: 1,
            xScalarToAdd: 0,
            yScalarToAdd: 0
          }
        }
        mode={heatmapMode === 'kills' ? 'Kills' : 'Deaths'}
      />

      <Text style={styles.heatmapDescription}>
        The heatmap shows the locations where you{' '}
        {heatmapMode === 'kills' ? 'eliminated opponents' : 'were eliminated'}{' '}
        during this match.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  heatmapContainer: {
    marginBottom: sizes.lg
  },
  heatmapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: sizes.lg,
    backgroundColor: colors.primary,
    padding: sizes.lg
  },
  sectionTitle: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.md,
    color: colors.darkGray
  },
  heatmapModeSelector: {
    flexDirection: 'row',
    backgroundColor: colors.darkGray + '20',
    borderRadius: 4,
    overflow: 'hidden'
  },
  modeButton: {
    paddingVertical: sizes.lg,
    paddingHorizontal: sizes.xl
  },
  selectedModeButton: {
    backgroundColor: colors.black
  },
  modeButtonText: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.sm,
    color: colors.darkGray
  },
  selectedModeButtonText: {
    color: colors.white
  },
  heatmapLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: sizes.md,
    gap: sizes.xl
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  legendDot: {
    width: sizes.md,
    height: sizes.md,
    borderRadius: sizes.md / 2,
    marginRight: sizes.xs
  },
  legendText: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.sm,
    color: colors.darkGray
  },
  heatmapDescription: {
    fontFamily: fonts.family.proximaRegular,
    fontSize: fonts.sizes.sm,
    color: colors.darkGray,
    textAlign: 'center',
    marginTop: sizes.md,
    backgroundColor: colors.primary,
    padding: sizes.md
  }
});
