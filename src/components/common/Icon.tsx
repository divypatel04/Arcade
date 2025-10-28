import React from 'react';
import VectorIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StyleProp, ViewStyle } from 'react-native';
import { colors, sizes } from '@theme';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

export interface IconProps {
  name: string;
  size?: IconSize | number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 'md',
  color = colors.textPrimary,
  style,
}) => {
  const iconSize = typeof size === 'number' ? size : sizes.components.icon[size];

  return <VectorIcon name={name} size={iconSize} color={color} style={style} />;
};

export default Icon;
