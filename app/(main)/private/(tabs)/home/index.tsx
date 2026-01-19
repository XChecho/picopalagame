import React from "react";

import { View } from "react-native";

//UI Components
import ButtonGeneral from "@/src/components/ui/ButtonGeneral";
import { useTranslation } from "react-i18next";

const HomeScreen = () => {
  const { t } = useTranslation();

  return (
    <View className="flex-1 justify-center items-center bg-[#F2F2F2]">
      <View className="w-full h-[56px] flex justify-center items-center mb-6">
        <ButtonGeneral
          label={t("home.buttonNewGame")}
          onPress={() => {}}
          type="primary"
        />
      </View>
      <View className="w-full h-[56px] flex justify-center items-center mb-6">
        <ButtonGeneral
          label={t("home.buttonRecord")}
          onPress={() => {}}
          type="secondary"
        />
      </View>
      <View className="w-full h-[56px] flex justify-center items-center">
        <ButtonGeneral
          label={t("home.buttonConfig")}
          onPress={() => {}}
          type="secondary"
        />
      </View>
    </View>
  );
};

export default HomeScreen;
