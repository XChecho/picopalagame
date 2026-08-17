import React from "react";

import { Modal, Platform, Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

import { useModalStore } from "@/presentation/store/useModalStore";
import CardGameModal from "./CardGameModal";

const ModalNewGame = () => {
  const { t } = useTranslation();
  const {
    viewModalNewGame,
    closeModalNewGame,
    openModalDifficulty,
  } = useModalStore();

  const handleCloseModal = () => {
    closeModalNewGame();
  };

  const handleVersusAI = () => {
    closeModalNewGame();
    openModalDifficulty();
  };

  const handlePrivateRoom = () => {
    closeModalNewGame();
    router.push("/private/game/private-room");
  };

  const handleGlobalRoom = () => {
    closeModalNewGame();
    router.push("/private/game/global-room");
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
            onPress={handleVersusAI}
          />
          <CardGameModal
            title={t("home.versusFriendOnline")}
            description={t("home.descriptionFriendOnline")}
            type="private"
            onPress={handlePrivateRoom}
          />
          <CardGameModal
            title={t("home.globalPublic")}
            description={t("home.descriptionVersusFriend")}
            type="public"
            onPress={handleGlobalRoom}
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
