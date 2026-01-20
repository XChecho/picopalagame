import React from "react";

import { Image, Text, View } from "react-native";

import { useTranslation } from "react-i18next";

//Store
import { useModalStore } from "@/src/store/useModalStore";

//UI Components
import ButtonGeneral from "@/src/components/ui/ButtonGeneral";

//Assets
import logoImage from "@/src/assets/images/icons/icon.png";

const HomeScreen = () => {
  const { t } = useTranslation();

  const { openModalNewGame } = useModalStore();

  const handleNewGame = () => {
    openModalNewGame();
  };

  return (
    <View className="flex-1 justify-center items-center bg-background">
      <Image
        source={logoImage}
        className="w-64 h-64 mb-6 rounded-lg"
        resizeMode="contain"
      />
      <Text className="text-textMuted text-3xl font-CairoBold">
        {t("home.subtitleHome")}
      </Text>
      <View className="w-full h-[85px] flex justify-center items-center mb-3">
        <ButtonGeneral
          label={t("home.buttonNewGame")}
          onPress={handleNewGame}
          type="primary"
          icon="play-circle"
        />
      </View>
      <View className="w-full h-[85px] flex justify-center items-center mb-2">
        <ButtonGeneral
          label={t("home.buttonRecord")}
          onPress={() => { }}
          type="secondary"
          icon="trophy"
        />
      </View>
      <View className="w-full h-[85px] flex justify-center items-center">
        <ButtonGeneral
          label={t("home.buttonConfig")}
          onPress={() => { }}
          type="tertiary"
          icon="settings"
        />
      </View>
    </View>
  );
};

export default HomeScreen;
