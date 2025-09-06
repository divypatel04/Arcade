import { JSX } from 'react';
import {createIconSet} from 'react-native-vector-icons';
const glyphMap = require('../assets/icons/gylphmap.json');

const RemixIcon = createIconSet(glyphMap, 'remixicon', 'remixicon.ttf');

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: any;
}

export const Icon = (props: IconProps): JSX.Element => (
  <>
    <RemixIcon
      name={props.name}
      size={props.size as number}
      color={props.color}
      style={props.style}
    />
  </>
);