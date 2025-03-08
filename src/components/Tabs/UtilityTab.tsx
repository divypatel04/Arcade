import React, { useEffect } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, fonts, sizes } from '../../theme';
import DropDown from '../DropDown';
import StatsSummary from '../StatsSummary';

interface AbilityData {
  id: string;
  name: string;
  imageUrl: string;
  type: string;
  cost: number;
}

interface UtilityTabProps {
  utilities: {
    grenadeCasts: { id: string; count: number; kills: number; damage: number };
    ability1Casts: { id: string; count: number; kills: number; damage: number };
    ability2Casts: { id: string; count: number; kills: number; damage: number };
    ultimateCasts: { id: string; count: number; kills: number; damage: number };
  };
  totalRounds: number;
  abilitiesData: AbilityData[];
}

const UtilityTab = ({ utilities, totalRounds, abilitiesData }: UtilityTabProps) => {
  const abilities = abilitiesData.map((ability) => {
    let data;
    switch (ability.id) {
      case utilities.grenadeCasts.id:
        data = utilities.grenadeCasts;
        break;
      case utilities.ability1Casts.id:
        data = utilities.ability1Casts;
        break;
      case utilities.ability2Casts.id:
        data = utilities.ability2Casts;
        break;
      case utilities.ultimateCasts.id:
        data = utilities.ultimateCasts;
        break;
      default:
        data = { count: 0, kills: 0, damage: 0 };
    }
    return { name: ability.name, data };
  });

  const abilitiesType = abilities.map((item) => item.name);
  const [selectedAbility, setSelectedAbility] = React.useState(abilitiesType[0]);
  const [currentAbility, setCurrentAbility] = React.useState(abilities[0].data);
  const [currentAbilityData, setCurrentAbilityData] = React.useState<AbilityData | undefined>(abilitiesData[0]);

  useEffect(() => {
    const selected = abilities.find((item) => item.name === selectedAbility);
    setCurrentAbility(selected?.data ?? { count: 0, kills: 0, damage: 0 });

    const selectedAbilityData = abilitiesData.find((ability) => ability.name === selectedAbility);
    setCurrentAbilityData(selectedAbilityData);
  }, [selectedAbility, abilitiesData]);

  const Stats = [
    { name: 'Usage/R', value: String(((currentAbility?.count ?? 0) / totalRounds).toFixed(1)) },
    { name: 'Damage/R', value: String(((currentAbility?.damage ?? 0) / totalRounds).toFixed(1)) },
    { name: 'Kills', value: String((currentAbility?.kills ?? 0)) },
  ];

  return (
    <View style={styles.tabContainer}>
      <View style={styles.dropdowncontainer}>
        <DropDown
          list={abilitiesType}
          name="Ability"
          value={selectedAbility}
          onSelect={(item) => setSelectedAbility(item)}
        />
      </View>
      <View style={styles.abilityBox}>
        <Image
          style={styles.abilityImage}
          source={{ uri: currentAbilityData?.imageUrl ?? '' }}
        />
        <View style={styles.abilityMeta}>
          <Text style={styles.abilitySubText}>Ability</Text>
          <Text style={styles.abilityTitle}>{currentAbilityData?.name}</Text>
        </View>
      </View>
      <StatsSummary stats={Stats} />
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    paddingTop: sizes.lg,
    flex: 1,
  },
  dropdowncontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: sizes.lg,
  },
  abilityImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  abilityBox: {
    backgroundColor: colors.primary,
    paddingHorizontal: sizes['4xl'],
    paddingVertical: sizes['2xl'],
    flexDirection: 'row',
  },
  abilityMeta: {
    paddingLeft: sizes['4xl'],
    justifyContent: 'center',
  },
  abilitySubText: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.md,
    textTransform: 'uppercase',
    color: colors.darkGray,
  },
  abilityTitle: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes['6xl'],
    lineHeight: fonts.sizes['6xl'],
    letterSpacing: -0.1,
    color: colors.black,
    textTransform: 'lowercase',
  },
});

export default UtilityTab;
