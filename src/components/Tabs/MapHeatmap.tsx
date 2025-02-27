import React, { useEffect, useState } from 'react';
import {View, StyleSheet} from 'react-native';
import { SeasonPerformance } from '../../types/MapStatsType';
import Map from '../Map';
import DropDown from '../DropDown';
import { sizes } from '../../theme';

const MapHeatmap: React.FC<{
  seasonStats: SeasonPerformance | undefined;
  mapImage: string;
  mapCoordinate: {
    xMultiplier: number;
    xScalarToAdd: number;
    yMultiplier: number;
    yScalarToAdd: number;
  };
}> = ({seasonStats, mapImage, mapCoordinate}) => {

  const siteNames = ['Attack', 'Defence', 'Both'];
  const [selectedSite, setSelectedSite] = useState(siteNames[0]);

  const modeNames = ['Kills', 'Deaths', 'Both'];
  const [selectedMode, setSelectedMode] = useState(modeNames[0]);

  const getHeatmapLocations = () => {
    const attackStats = seasonStats?.attackStats.HeatmapLocation;
    const defenseStats = seasonStats?.defenseStats.HeatmapLocation;

    const getLocations = (stats: any, mode: string) => {
      if (mode === 'Kills') return stats?.killsLocation || [];
      if (mode === 'Deaths') return stats?.deathLocation || [];
      return [...(stats?.killsLocation || []), ...(stats?.deathLocation || [])];
    };

    if (selectedSite === 'Attack') return getLocations(attackStats, selectedMode);
    if (selectedSite === 'Defence') return getLocations(defenseStats, selectedMode);
    return [
      ...getLocations(attackStats, selectedMode),
      ...getLocations(defenseStats, selectedMode),
    ];
  };

  const [siteStat, setSiteStat] = useState(getHeatmapLocations());

  useEffect(() => {
    setSiteStat(getHeatmapLocations());
  }, [selectedSite, selectedMode, seasonStats]);

  return (
    <View style={styles.tabContainer}>
      <View style={styles.dropdowncontainer}>
                <DropDown
                  list={modeNames}
                  name="Side"
                  value={selectedMode}
                  onSelect={item => setSelectedMode(item)}
                />
                <DropDown
                  list={siteNames}
                  name="Side"
                  value={selectedSite}
                  onSelect={item => setSelectedSite(item)}
                />
              </View>
      <Map
        locations={siteStat}
        mapImage={mapImage}
        mapCoordinate={mapCoordinate?? {xMultiplier: 0, xScalarToAdd: 0, yMultiplier: 0, yScalarToAdd: 0}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    paddingTop: 15,
    marginBottom: 265,
  },
  dropdowncontainer: {
    flexDirection: 'row',
    gap: sizes.lg,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: sizes.lg,
  },
});

export default MapHeatmap;
