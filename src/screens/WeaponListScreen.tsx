import React, { useState } from 'react'
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { colors, fonts, sizes } from '../theme';
import DropDown from '../components/DropDown';
import FontAwesome from 'react-native-vector-icons/FontAwesome6';
import AgentCard from '../components/AgentCard';
import GunCard from '../components/GunCard';

const WeaponListScreen = () => {

  const ses = ['seso11', 'seso11', 'seso11', 'seso11', 'seso11'];

  const agentList = [
    {
      isPremium: true,
      item: {
        agent: {
          name: "Agent X1",
          experience: "5 years",
          specialization: "Cybersecurity",
        },
        seasonName: "Winter",
        value: "1000",
      },
      onPress: () => {},
    },
    {
      isPremium: false,
      item: {
        agent: {
          name: "Agent Y2",
          experience: "3 years",
          specialization: "Data Analysis",
        },
        seasonName: "Spring",
        value: "850",
      },
      onPress: () => {},
    },
    {
      isPremium: true,
      item: {
        agent: {
          name: "Agent Z3",
          experience: "10 years",
          specialization: "Artificial Intelligence",
        },
        seasonName: "Summer",
        value: "1500",
      },
      onPress: () => {},
    },
    {
      isPremium: false,
      item: {
        agent: {
          name: "Agent W4",
          experience: "2 years",
          specialization: "Cloud Computing",
        },
        seasonName: "Fall",
        value: "700",
      },
      onPress: () => {},
    },
    {
      isPremium: true,
      item: {
        agent: {
          name: "Agent V5",
          experience: "7 years",
          specialization: "Blockchain",
        },
        seasonName: "Winter",
        value: "1200",
      },
      onPress: () => {},
    },
  ];

  const [selectedAct, setSelectedAct] = useState(ses[0]);

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <FontAwesome
              name="angles-left"
              color={colors.darkGray}
              size={20}
              style={styles.backicon}
            />
        </TouchableOpacity>
        <Text style={styles.headertitle}>Weapons</Text>
        <View style={styles.dropdowncontainer}>
          <DropDown
              list={ses}
              name="Act"
              value={selectedAct}
              onSelect={item => setSelectedAct(item)}
            />
        </View>
      </View>

      <FlatList
        data={agentList}
        renderItem={({item}) => (
          <GunCard
            isPremium={item.isPremium}
            item={item.item}
            onPress={() => {
              // if (loaded) {
              //   showAd();
              // }
              // navigation.navigate('AgentDetailsScreen', {
              //   agent: item.agent,
              //   seasonName: item.seasonName,
              // });
            }}
          />
        )}
        // keyExtractor={item => item}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    padding: sizes.xl,
  },
  header:{
    paddingVertical: sizes.xl,
  },
  headertitle: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes['13xl'],
    color: colors.black,
    letterSpacing: -0.7,
  },
  dropdowncontainer: {
    flexDirection: 'row',
    marginTop: 16,
    alignItems: 'center',
    paddingBottom: 5,
  },
  backicon: {
    paddingTop: 5,
    paddingBottom: 5,
  },
});

export default WeaponListScreen