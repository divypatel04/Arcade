import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import { colors, fonts } from '../theme';
import { Icon } from './lcon';
import { MatchStatType } from '../types/MatchStatType';

interface MatchBoxProps {
  isPremium: boolean;
  match: MatchStatType;
  onPress: () => void;
}

const MatchBox = ({isPremium,match, onPress}: MatchBoxProps) => {

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={onPress}
      style={styles.matchBox}>
      <Image
        style={styles.matchAgentImage}
        source={{uri: match.general.agent.iconUrl}}
      />
      <View style={styles.matchMetaContainer}>
          <View style={styles.matchMeta}>
            <Text>
              <Text
                style={[
                  styles.matchMetaTitle,
                  {color: true ? colors.win : colors.lose},
                ]}>
                {true ? 'Victory' : 'Defeat'}
              </Text>{' '}
              <Text style={styles.matchMetaScore}>
                13-7
              </Text>
            </Text>
            <Text style={styles.matchMetaSubText}>
              35/18/11 -{' '}
              Ascent - Ranked
            </Text>
          </View>


        <View style={styles.rightMeta}>
          <View style={{ flexDirection: 'row' }}>
          {isPremium && (
                      <View style={{ justifyContent: 'center' }}>
                        <Icon
                          name={'star-fill'}
                          size={15}
                          color={colors.darkGray}
                          style={{marginTop: -2,marginRight: 5}}
                        />
                      </View>
                    )}
          <Icon name="arrow-right-s-line" size={20} color={colors.darkGray} />
        </View>
      </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  matchBox: {
    backgroundColor: colors.primary,
    marginBottom: 12,
    padding: 10,
    flexDirection: 'row',
    zIndex: 1,
  },
  matchAgentImage: {
    width: '17%',
    aspectRatio: 1 / 1,
    borderRadius: 3,
    resizeMode: 'contain',
  },
  matchMetaContainer: {
    flexDirection: 'row',
    width: '83%',
  },
  matchMeta: {
    paddingLeft: 11,
    justifyContent: 'center',
  },
  matchMetaTitle: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: 0,
    color: colors.win,
    paddingRight: 10,
    textTransform: 'lowercase',
  },
  matchMetaScore: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: 20,
    lineHeight: 20,
    letterSpacing: 0.2,
    color: colors.black,
    textTransform: 'lowercase',
  },
  matchMetaSubText: {
    fontFamily: fonts.family.proximaBold,
    letterSpacing: 0.3,
    fontSize: 12,
    color: colors.darkGray,
  },
  rightMeta: {
    marginLeft: 'auto',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
});

export default MatchBox;
