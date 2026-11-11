import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { X } from 'lucide-react-native';
import { LIGHT_GREY } from '@/consts/consts';
import { icon } from '@/styles/global';

interface Props {
  onPress: () => void;
  testID?: string;
}

export default function CloseButton({ onPress, testID }: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button} testID={testID}>
      <X color={LIGHT_GREY} size={icon.closeSize} strokeWidth={icon.strokeWidth} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Matches the modal header row height.
  button: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
