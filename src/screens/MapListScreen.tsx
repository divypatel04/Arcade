import React, { useState } from 'react'
import { colors, fonts, sizes } from '../theme';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DropDown from '../components/DropDown';
import FontAwesome from 'react-native-vector-icons/FontAwesome6';
import MapCard from '../components/MapCard';

const MapListScreen = () => {

  const ses = ['seso11', 'seso11', 'seso11', 'seso11', 'seso11'];
  const [selectedAct, setSelectedAct] = useState(ses[0]);
  const agentList = [
    {
      isPremium: true,
      item: {
        map: {
          name: "Agent X1",
          experience: "5 years",
          specialization: "Cybersecurity",
        },
        seasonName: "Winter",
        value: "1000",
      },
      onPress: () => { },
    },
    {
      isPremium: false,
      item: {
        map: {
          name: "Agent Y2",
          experience: "3 years",
          specialization: "Data Analysis",
        },
        seasonName: "Spring",
        value: "850",
      },
      onPress: () => { },
    },
    {
      isPremium: true,
      item: {
        map: {
          name: "Agent Z3",
          experience: "10 years",
          specialization: "Artificial Intelligence",
        },
        seasonName: "Summer",
        value: "1500",
      },
      onPress: () => { },
    },
    {
      isPremium: false,
      item: {
        map: {
          name: "Agent W4",
          experience: "2 years",
          specialization: "Cloud Computing",
        },
        seasonName: "Fall",
        value: "700",
      },
      onPress: () => { },
    },
    {
      isPremium: true,
      item: {
        map: {
          name: "Agent V5",
          experience: "7 years",
          specialization: "Blockchain",
        },
        seasonName: "Winter",
        value: "1200",
      },
      onPress: () => { },
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <FontAwesome
            name="angles-left"
            color={colors.darkGray}
            size={18}
            style={styles.backicon}
          />
        </TouchableOpacity>
        <Text style={styles.headertitle}>Maps</Text>
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
        renderItem={({ item }) => (
          <MapCard
            isPremium={item.isPremium}
            item={item.item}
            onPress={() => { }}
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
    backgroundColor: colors.white,
  },
  header: {
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
    marginTop: sizes['4xl'],
    alignItems: 'center',
    paddingBottom: sizes.md,
  },
  backicon: {
    paddingTop: sizes.md,
    paddingBottom: sizes.md,
  },
});

export default MapListScreen