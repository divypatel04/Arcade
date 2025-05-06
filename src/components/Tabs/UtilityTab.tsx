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
import { getSupabaseImageUrl } from '../../utils';
import { useTranslation } from 'react-i18next';

interface AbilityData {
  id: string;
  name: string;
  image: string;
  type: string;
  cost: number;
}

interface UtilityTabProps {
  utilities: { id: string; count: number; kills: number; damage: number; type: string }[] | undefined;
  totalRounds: number;
  abilitiesData: AbilityData[];
}

const mergeUtilitiesAndAbilities = (abilitiesData: AbilityData[], utilities: { id: string; count: number; kills: number; damage: number; type: string }[]) => {
  return abilitiesData.map((ability) => {
    const utility = utilities.find((util) => util.id === ability.id);
    const data = utility ? { count: utility.count, kills: utility.kills, damage: utility.damage } : { count: 0, kills: 0, damage: 0 };
    return { ...ability, data };
  });
};

const UtilityTab = ({ utilities, totalRounds, abilitiesData }: UtilityTabProps) => {

  const { t } = useTranslation();
  const abilities = mergeUtilitiesAndAbilities(abilitiesData, utilities ?? []);

  const abilitiesType = abilities.map((ability) => ability.name);
  const [selectedAbilityType, setSelectedAbilityType] = React.useState(abilitiesType[0]);
  const [currentAbility, setCurrentAbility] = React.useState(abilities[0]);

  useEffect(() => {
    setCurrentAbility(abilities.find((ability) => ability.name === selectedAbilityType) || abilities[0]);
  }, [selectedAbilityType]);

  console.log('currentAbility', currentAbility);
  const Stats = [
    { name: t('common.utilityR'), value: String(((currentAbility?.data.count ?? 0) / totalRounds).toFixed(2)) },
    { name: t('common.damageR'), value: String(((currentAbility?.data.damage ?? 0) / totalRounds).toFixed(2)) },
    { name: t('common.kills'), value: String((currentAbility?.data.kills ?? 0)) },
  ];

  return (
    <View style={styles.tabContainer}>
      <View style={styles.dropdowncontainer}>
        <DropDown
          list={abilitiesType}
          name={t('common.ability')}
          value={selectedAbilityType}
          onSelect={(item) => setSelectedAbilityType(item)}
        />
      </View>
      <View style={styles.abilityBox}>
        <Image
          style={styles.abilityImage}
          source={{ uri: getSupabaseImageUrl(currentAbility?.image) }}
        />
        <View style={styles.abilityMeta}>
          <Text style={styles.abilitySubText}>{t('common.ability')}</Text>
          <Text style={styles.abilityTitle}>{currentAbility.name}</Text>
        </View>
      </View>
      <StatsSummary stats={Stats} />
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    paddingTop: sizes['3xl'],
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
    marginTop: sizes.md,
    marginBottom: sizes['2xl'],
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
