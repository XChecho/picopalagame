import React from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';

interface Props {
  label: string
  onPress?: () => void
  loading?: boolean
  type: 'primary' | 'secondary'
}

const ButtonGeneral = ({ label, onPress, loading, type }: Props) => {
  return (
    <Pressable className={`bg-${type === 'primary' ? 'mainBlue' : 'softBlue'} p-4 rounded-lg`} onPress={onPress}>
      {
        loading 
        ? <ActivityIndicator /> 
        : <Text>{label}</Text>
      }
    </Pressable>
  )
}

export default ButtonGeneral