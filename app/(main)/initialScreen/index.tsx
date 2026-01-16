import React from 'react';
import { Text, View } from 'react-native';

import { router } from 'expo-router';

//Components
import ButtonGeneral from '@/src/components/ui/ButtonGeneral';

const InitialScreen = () => {

  const handleRedirect = () => {
    router.push('/(main)/private/(tabs)/home')
    console.log('Presione')
  }
  return (
    <View className='flex-1 mt-20 flex justify-center items-center bg-red-500'>
      <Text className='text-2xl text-white'>Hola Mundo</Text>
      <ButtonGeneral label="Ir a Home" onPress={handleRedirect} type="primary" /> 
    </View>
  )
}

export default InitialScreen