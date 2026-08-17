import React, { useState } from "react";
import { ScrollView, View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ScreenHeader from "@presentation/components/ui/ScreenHeader";
import SettingRow from "@presentation/components/ui/SettingRow";

export default function ConfigScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <ScreenHeader
        title={t("config.title")}
        subtitle={t("config.subtitle")}
      />

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Cuenta */}
        <View className="mt-6">
          <Text className="text-mainPurple font-CairoBold text-sm uppercase px-4 mb-2">
            {t("config.account")}
          </Text>
          <View className="bg-surface rounded-2xl mx-4">
            <SettingRow
              icon="person-outline"
              iconColor="#FF2E95"
              title={t("config.profile")}
              description={t("profile.subtitle")}
              onPress={() => router.push("/private/profile")}
              showChevron
            />
          </View>
        </View>

        {/* Audio */}
        <View className="mt-6">
          <Text className="text-mainPurple font-CairoBold text-sm uppercase px-4 mb-2">
            {t("config.sound")}
          </Text>
          <View className="bg-surface rounded-2xl mx-4">
            <SettingRow
              icon="volume-high-outline"
              iconColor="#00D2FF"
              title={t("config.sound")}
              description={t("config.soundDescription")}
              hasToggle
              toggleValue={soundEnabled}
              onToggleChange={setSoundEnabled}
            />
            <View className="h-px bg-border mx-4" />
            <SettingRow
              icon="musical-notes-outline"
              iconColor="#9D4EDD"
              title={t("config.music")}
              description={t("config.musicDescription")}
              hasToggle
              toggleValue={musicEnabled}
              onToggleChange={setMusicEnabled}
            />
          </View>
        </View>

        {/* Dispositivo */}
        <View className="mt-6">
          <Text className="text-mainPurple font-CairoBold text-sm uppercase px-4 mb-2">
            {t("config.device")}
          </Text>
          <View className="bg-surface rounded-2xl mx-4">
            <SettingRow
              icon="phone-portrait-outline"
              iconColor="#84CC16"
              title={t("config.vibration")}
              description={t("config.vibrationDescription")}
              hasToggle
              toggleValue={vibrationEnabled}
              onToggleChange={setVibrationEnabled}
            />
            <View className="h-px bg-border mx-4" />
            <SettingRow
              icon="notifications-outline"
              iconColor="#FFD600"
              title={t("config.notifications")}
              description={t("config.notificationsDescription")}
              hasToggle
              toggleValue={notificationsEnabled}
              onToggleChange={setNotificationsEnabled}
            />
          </View>
        </View>

        {/* Idioma */}
        <View className="mt-6">
          <Text className="text-mainPurple font-CairoBold text-sm uppercase px-4 mb-2">
            {t("config.language")}
          </Text>
          <View className="bg-surface rounded-2xl mx-4">
            <SettingRow
              icon="language-outline"
              iconColor="#FF2E95"
              title={t("config.language")}
              description="Español"
              onPress={() => {}}
              showChevron
            />
          </View>
        </View>

        {/* Acerca de */}
        <View className="mt-6 mb-8">
          <Text className="text-mainPurple font-CairoBold text-sm uppercase px-4 mb-2">
            {t("config.about")}
          </Text>
          <View className="bg-surface rounded-2xl mx-4">
            <SettingRow
              simple
              title={t("config.version")}
              rightValue="1.0.0 Beta"
            />
            <View className="h-px bg-border mx-4" />
            <SettingRow
              simple
              title={t("config.developedBy")}
              rightValue="Pico & Pala Team"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
