import React from 'react';

import Ionicons from '@expo/vector-icons/Ionicons';
import { Icon, NativeTabs, VectorIcon } from 'expo-router/unstable-native-tabs';
import { Text } from 'react-native';

export default function TabsLayout() {
  return (
    <NativeTabs
      
    >
      <NativeTabs.Trigger name="home/index" options={{ title: 'Home' }}>
        <Icon src={<VectorIcon family={Ionicons} name="home" />}  />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="game/index" options={{ title: 'Game' }}>
        <Icon src={<VectorIcon family={Ionicons} name="game-controller" />} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="record/index" options={{ title: 'Record' }}>
        <Icon src={<VectorIcon family={Ionicons} name="trophy" />} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="config/index" options={{ title: 'Config' }}>
        <Icon src={<VectorIcon family={Ionicons} name="settings" />} />
      </NativeTabs.Trigger>
      <Text>This is home screen!</Text>
    </NativeTabs>
  );
}