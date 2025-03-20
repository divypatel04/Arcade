import React from 'react'
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Icon } from '../components/lcon'
import { colors, fonts, sizes } from '../theme'
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/LanguageSelector';
import { useDataContext } from '../context/DataContext';

const ProfileScreen = () => {
  const { t } = useTranslation();

  const {userData} = useDataContext();

  return (
    <ScrollView style={styles.container} overScrollMode="never">
      <View style={styles.header}>
        <Text style={styles.headertitle}>{t('infoScreen.profile')}</Text>
      </View>

      <View style={styles.profilecontainer}>
        <Image
          source={{
            uri: `https://media.valorant-api.com/playercards/915fbfc2-409c-2288-204e-aeb49a71557e/displayicon.png`,
          }}
          resizeMode="contain"
          style={styles.profileimage}
        />
        <View style={{ paddingLeft: 10 }}>
          <Text style={styles.profilesubtext}>Unstoppable Title</Text>
          <Text style={styles.profilename}>
            {userData?.name}#{userData?.tagline}
          </Text>
        </View>
      </View>

      <View style={styles.subcontainer}>
        <View>
          <Text style={styles.subtext}>{t('infoScreen.accountType')}: </Text>
          <Text style={styles.subprimarytext}>{t('infoScreen.none')}</Text>
        </View>
        <View style={styles.subbutton}>
          <TouchableOpacity activeOpacity={0.8}>
            <Text style={styles.subbuttontext}>Coming Soon</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View>
        <Text style={styles.sectiontitle}>{t('infoScreen.settings')}</Text>
        {[
          { name: t('infoScreen.followUs'), icon: 'twitter-line' },
          {
            name: t('infoScreen.privacyPolicy'),
            icon: 'shield-line',
          },
          { name: t('infoScreen.contactUs'), icon: 'mail-line', },
          { name: t('infoScreen.logout'), icon: 'logout-box-r-line', },
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.6}
            style={styles.menucontainer}
          >
            <View style={styles.menutextcontainer}>
              <View style={styles.menuicon}>
                <Icon name={item.icon} color={colors.black} size={22} />
              </View>
              <Text style={styles.menutext}>{item.name}</Text>
            </View>
            <View style={styles.rightarrow}>
              <Icon name="arrow-right-s-line" size={24} color={colors.darkGray} />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View>
        <Text style={styles.sectiontitle2}>{t('settings.language')}</Text>
        <LanguageSelector />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: sizes['2xl'],
    paddingBottom: 0,
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    paddingVertical: sizes['3xl'],
    paddingBottom: 0,
  },
  headertitle: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes['13xl'],
    marginBottom: sizes.xl,
    color: colors.black,
    letterSpacing: -0.7,
  },
  profilecontainer: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    marginBottom: sizes['6xl'],
    alignItems: 'center',
  },
  profileimage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  profiletextcontainer: {
    flex: 1,
    paddingLeft: sizes.xl,
  },
  profilename: {
    fontFamily: fonts.family.novecentoUltraBold,
    color: colors.black,
    fontSize: fonts.sizes['6xl'],
    lineHeight: fonts.sizes['9xl'],
    letterSpacing: -0.6,
  },
  profilesubtext: {
    fontFamily: fonts.family.proximaBold,
    color: colors.darkGray,
    fontSize: fonts.sizes.md,
    textTransform: 'uppercase',
  },
  subcontainer: {
    backgroundColor: colors.primary,
    padding: sizes['6xl'],
    marginBottom: sizes['6xl'],
    flexDirection: 'row',
  },
  subtext: {
    fontFamily: fonts.family.proximaBold,
    color: colors.darkGray,
    fontSize: fonts.sizes.md,
    textTransform: 'uppercase',
  },
  subprimarytext: {
    fontFamily: fonts.family.novecentoUltraBold,
    color: colors.black,
    fontSize: fonts.sizes['3xl'],
    lineHeight: fonts.sizes['6xl'],
    letterSpacing: -0.4,
  },
  subbutton: {
    marginLeft: 'auto',
    justifyContent: 'center',
  },
  subbuttontext: {
    fontFamily: fonts.family.proximaBold,
    color: colors.white,
    fontSize: fonts.sizes.md,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    paddingHorizontal: sizes['4xl'],
    paddingVertical: sizes.lg,
    backgroundColor: colors.black,
  },
  sectiontitle: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.md,
    textTransform: 'uppercase',
    color: colors.black,
    paddingBottom: sizes['3xl'],
    paddingTop: sizes.xl,
  },
  menucontainer: {
    backgroundColor: colors.primary,
    padding: sizes['4xl'],
    borderBottomColor: colors.darkGray,
    borderBottomWidth: 0.5,
    flexDirection: 'row',
  },
  menutextcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuicon: {
    paddingRight: sizes.xs,
  },
  menutext: {
    fontFamily: fonts.family.proximaBold,
    color: colors.black,
    fontSize: fonts.sizes.lg,
    paddingLeft: sizes.xl,
    textTransform: 'uppercase',
  },
  rightarrow: {
    marginLeft: 'auto',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  sectiontitle2: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.md,
    textTransform: 'uppercase',
    color: colors.black,
    // paddingBottom: sizes.xl,
    paddingTop: sizes['7xl'],
  },
});

export default ProfileScreen