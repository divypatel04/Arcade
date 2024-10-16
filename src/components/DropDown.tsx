import React, {useState} from 'react';
import {TouchableOpacity, StyleSheet, Text, View, ScrollView} from 'react-native';
import {colors, fonts} from '../theme';
import Icon from 'react-native-vector-icons/EvilIcons';

interface DropDownProps {
  list: string[];
  name: string;
  value: string | undefined;
  onSelect: (item: string) => void;
}

export default function DropDown({list, name, value, onSelect}: DropDownProps) {
  const [showOptions, setShowOptions] = useState(false);

  const onSelectItem = (item: string) => {
    setShowOptions(false);
    onSelect(item);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => setShowOptions(!showOptions)}>
        <View style={styles.option}>
          <Text>
            <Text
              style={[
                styles.label,
                {color: colors.black, fontFamily: fonts.family.novecentoUltraBold},
              ]}>
              {name}:{'  '}
            </Text>
            <Text style={styles.text}>{!!value ? value : name}</Text>
          </Text>
          <Icon style={styles.icon} name="chevron-down" size={20} />
        </View>
      </TouchableOpacity>

      {showOptions && (
        <View style={styles.dropdownList}>
          <ScrollView
            style={{flex: 1}}
            contentContainerStyle={{flexGrow: 1}}
            scrollEnabled={true}
            nestedScrollEnabled={true}>
            {list.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.listItem}
                activeOpacity={1}
                onPress={() => onSelectItem(item)}>
                <Text style={styles.listText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 255, 0, 0)',
    paddingVertical: 0,
    paddingRight: 0,
    zIndex: 10,
  },
  option: {
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 14,
    color: colors.white,
    width: '100%',
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  label: {
    color: colors.darkGray,
    fontSize: 11,
    lineHeight: 15,
    margin: 0,
    textAlignVertical: 'center',
    fontFamily: fonts.family.proximaBold,
    textTransform: 'uppercase',
    paddingRight: 3,
  },
  text: {
    color: colors.darkGray,
    fontSize: 11,
    lineHeight: 15,
    margin: 0,
    textAlignVertical: 'center',
    fontFamily: fonts.family.proximaBold,
    textTransform: 'uppercase',
    paddingRight: 3,
  },
  icon: {
    color: colors.darkGray,
    marginTop: -2,
  },
  listText: {
    color: colors.black,
    fontSize: 11,
    fontFamily: fonts.family.proximaBold,
  },
  dropdownList: {
    position: 'absolute',
    borderWidth: 0.6,
    overflow: 'hidden',
    borderColor: colors.darkGray,
    top: '100%',
    right: '1%',
    flex: 1,
    maxHeight: 170,
  },
  listItem: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 25,
    paddingLeft: 18,
    flexDirection: 'row',
    margin: 0,
    borderBottomWidth: 0.6,
    borderColor: colors.darkGray,
  },
});
