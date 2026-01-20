import React from "react";

import { Modal, Platform, Pressable, Text, View } from "react-native";

import { useTranslation } from "react-i18next";

//Store
import { useModalStore } from "@/src/store/useModalStore";
import CardGameModal from "./CardGameModal";

const ModalNewGame = () => {
  const { t } = useTranslation();
  const { viewModalNewGame, closeModalNewGame } = useModalStore();

  const handleCloseModal = () => {
    closeModalNewGame();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={viewModalNewGame}
      onRequestClose={handleCloseModal}
    >
      <Pressable
        onPress={handleCloseModal}
        className={`flex-1 items-center px-4 bg-darkPurple/50 ${Platform.OS === "ios" ? "pt-36" : "pt-28"}`}
      >
        <View className="bg-modalSurface w-full flex justify-start items-center rounded-[40px] border-2 border-border py-12 px-8">
          <Text className="text-white font-CairoSemiBold text-3xl leading-[38px]">
            {t("home.titleModalNewGame")}
          </Text>
          <Text className="text-textMuted font-CairoSemiBold text-base mb-4">
            {t("home.subtitleModalNewGame")}
          </Text>
          <CardGameModal
            title={t("home.versusAI")}
            description={t("home.descriptionVersusAI")}
            type="versus"
          />
          <CardGameModal
            title={t("home.versusFriendOnline")}
            description={t("home.descriptionFriendOnline")}
            type="private"
          />
          <CardGameModal
            title={t("home.globalPublic")}
            description={t("home.descriptionVersusFriend")}
            type="public"
          />
          <Pressable
            onPress={handleCloseModal}
            className="w-full flex justify-center items-center active:opacity-85 active:rounded-3xl active:bg-mainBlue mt-4"
          >
            <Text className="text-white font-CairoSemiBold text-xl">
              {t("home.buttonMaybeLater")}
            </Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};

export default ModalNewGame;
