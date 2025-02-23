import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, fonts } from '../../theme';


interface mapListType {
  id: string;
  imageUrl: string;
  name: string;
  location: string;
  wins: number;
  losses: number;
}

interface BestMapType {
  mapList: mapListType[] | undefined
}

const BestMapTab = ({mapList}:BestMapType) => {
  const calculateWinRate = (item: mapListType) => {
    const winRate = ((item.wins / (item.wins + item.losses)) * 100).toFixed(2);
    return `WinRate- ${winRate}%`;
  };

  const renderMapBox = (item: mapListType) => (
    <View key={item.name}>
      <TouchableOpacity activeOpacity={0.5} style={styles.mapBox}>
        <Image style={styles.mapImage} source={{uri: item.imageUrl}} />
        <View style={styles.metaContainer}>
          <View style={styles.meta}>
            <Text style={styles.metaTitle}>{item.name}</Text>
            <Text style={styles.metaSubText}>
              Wins: {item.wins} | Lose: {item.losses}
            </Text>
          </View>
          <View style={styles.rightMeta}>
            <Text style={styles.rightText}>{calculateWinRate(item)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  const sortedMapData = mapList ? [...mapList].sort((a, b) => {
    const winRateA = a.wins / (a.wins + a.losses);
    const winRateB = b.wins / (b.wins + b.losses);
    return winRateB - winRateA;
  }) : [];

  return (
    <View style={styles.tabContainer}>
      <FlatList
        style={styles.tabList}
        data={sortedMapData}
        renderItem={({item}) => renderMapBox(item)}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    paddingTop: 8,
    flex:1,
  },
  tabList: {
    paddingTop: 15,
    marginBottom: 50,
  },
  mapBox: {
    backgroundColor: colors.primary,
    marginBottom: 12,
    padding: 10,
    flexDirection: 'row',
    zIndex: 1,
  },
  mapImage: {
    width: '22%',
    aspectRatio: 1 / 1,
    borderRadius: 3,
    resizeMode: 'contain',
  },
  metaContainer: {
    flexDirection: 'row',
    width: '78%',
  },
  meta: {
    paddingLeft: 11,
    justifyContent: 'center',
  },
  metaTitle: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.3,
    color: colors.black,
    paddingRight: 10,
  },
  metaSubText: {
    fontFamily: fonts.family.proximaBold,
    letterSpacing: 0.3,
    fontSize: 13,
    lineHeight: 13,
    color: colors.darkGray,
  },
  rightMeta: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightText: {
    fontFamily: fonts.family.proximaBold,
    fontSize: 12,
    marginBottom: -2,
    textTransform: 'uppercase',
    color: colors.darkGray,
    paddingRight: 10,
  },
});

export default BestMapTab;
