import React from 'react';

import { View } from 'react-native';

import { Redirect } from 'expo-router';

const MainIndex = () => {
  
  return (
    <View className='flex-1'>
      <Redirect href="/(main)/initialScreen" />
    </View>
  );
};

export default MainIndex