import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";

import GameHeader from "@presentation/components/ui/GameHeader";
import CodeDisplay from "@presentation/components/ui/CodeDisplay";
import {
  useCancelPrivateRoom,
  useCreatePrivateRoom,
  useJoinPrivateRoom,
  usePrivateRoomStatus,
} from "@presentation/hooks/useRoom";
import { useRoomStore } from "@presentation/store/useRoomStore";

export default function PrivateRoomScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<"create" | "join">("create");
  const [joinCode, setJoinCode] = useState("");
  const [createdRoomCode, setCreatedRoomCode] = useState<string | null>(null);

  const createRoomMutation = useCreatePrivateRoom();
  const joinRoomMutation = useJoinPrivateRoom();
  const cancelRoomMutation = useCancelPrivateRoom();
  const roomStatusQuery = usePrivateRoomStatus(createdRoomCode);
  const setMatchId = useRoomStore((state) => state.setMatchId);

  const goToSecretSelection = (matchId: string) => {
    setMatchId(matchId);
    router.replace({
      pathname: "/private/game/select-secret",
      params: { mode: "PRIVATE", matchId },
    });
  };

  // Host: the guest joined (or the room died) while we were polling.
  const roomStatus = roomStatusQuery.data?.status;
  const roomMatchId = roomStatusQuery.data?.matchId;
  useEffect(() => {
    if (roomStatus === "IN_GAME" && roomMatchId) {
      setMatchId(roomMatchId);
      router.replace({
        pathname: "/private/game/select-secret",
        params: { mode: "PRIVATE", matchId: roomMatchId },
      });
    } else if (roomStatus === "CLOSED" || roomStatus === "EXPIRED") {
      Alert.alert(t("common.error"), t("privateRoom.roomCancelled"));
    }
  }, [roomStatus, roomMatchId, setMatchId, t]);

  // A closed/expired room falls back to the create view.
  const roomIsDead = roomStatus === "CLOSED" || roomStatus === "EXPIRED";
  const activeRoomCode = roomIsDead ? null : createdRoomCode;

  const handleCancelRoom = async () => {
    if (!createdRoomCode) return;
    try {
      await cancelRoomMutation.mutateAsync(createdRoomCode);
      setCreatedRoomCode(null);
    } catch {
      Alert.alert(t("common.error"), t("errors.generic"));
    }
  };

  const handleCreateRoom = async () => {
    try {
      const result = await createRoomMutation.mutateAsync(undefined);
      setCreatedRoomCode(result.code);
    } catch {
      Alert.alert(t("common.error"), t("errors.generic"));
    }
  };

  const handleJoinRoom = async () => {
    if (joinCode.length !== 6) {
      Alert.alert(t("common.error"), t("privateRoom.invalidCode"));
      return;
    }

    try {
      const result = await joinRoomMutation.mutateAsync(joinCode.toUpperCase());
      goToSecretSelection(result.room.matchId);
    } catch {
      Alert.alert(t("common.error"), t("errors.generic"));
    }
  };

  const handleCopyCode = async () => {
    if (createdRoomCode) {
      await Clipboard.setStringAsync(createdRoomCode);
      Alert.alert(t("privateRoom.roomCode"), t("privateRoom.codeCopied"));
    }
  };

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <GameHeader title={t("game.privateRoom")} />

      {/* Tabs */}
      <View className="flex-row mx-6 mt-6 gap-0 bg-surface rounded-xl p-1">
        <Pressable
          onPress={() => setActiveTab("create")}
          className={`flex-1 py-3 rounded-lg items-center ${
            activeTab === "create" ? "bg-mainRose" : "bg-transparent"
          }`}
        >
          <Text
            className={`font-CairoBold text-base ${
              activeTab === "create" ? "text-white" : "text-textMuted"
            }`}
          >
            {t("privateRoom.createRoom")}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab("join")}
          className={`flex-1 py-3 rounded-lg items-center ${
            activeTab === "join" ? "bg-mainRose" : "bg-transparent"
          }`}
        >
          <Text
            className={`font-CairoBold text-base ${
              activeTab === "join" ? "text-white" : "text-textMuted"
            }`}
          >
            {t("privateRoom.joinRoom")}
          </Text>
        </Pressable>
      </View>

      {/* Contenido */}
      <View className="flex-1 px-6 mt-6">
        {activeTab === "create" ? (
          <View className="flex-1">
            {!activeRoomCode ? (
              <View className="flex-1 justify-center">
                <Pressable
                  onPress={handleCreateRoom}
                  disabled={createRoomMutation.isPending}
                  className="w-full h-14 rounded-xl justify-center items-center active:opacity-85"
                >
                  <LinearGradient
                    colors={["#FF2E95", "#FF5959"]}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: 12,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text className="text-white font-CairoBold text-lg">
                      {createRoomMutation.isPending
                        ? t("common.loading")
                        : t("privateRoom.createAndWait")}
                    </Text>
                  </LinearGradient>
                </Pressable>
              </View>
            ) : (
              <View className="items-center mt-8">
                <View className="flex-row items-center gap-2 mb-3">
                  <Ionicons name="key-outline" size={16} color="#94959B" />
                  <Text className="text-textMuted font-CairoBold text-sm uppercase tracking-wider">
                    {t("privateRoom.roomCodeLabel")}
                  </Text>
                </View>

                <CodeDisplay code={activeRoomCode} onCopy={handleCopyCode} />

                <Text className="text-textMuted font-CairoRegular text-sm text-center mt-4 px-4">
                  {t("privateRoom.shareCodeHint")}
                </Text>

                <Pressable
                  disabled
                  className="w-full h-14 rounded-xl justify-center items-center mt-6 opacity-60"
                >
                  <LinearGradient
                    colors={["#FF2E95", "#FF5959"]}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: 12,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text className="text-white font-CairoBold text-lg">
                      {t("game.waitingOpponent")}
                    </Text>
                  </LinearGradient>
                </Pressable>

                <Pressable
                  onPress={handleCancelRoom}
                  disabled={cancelRoomMutation.isPending}
                  className="mt-4 py-3 px-6 active:opacity-70"
                >
                  <Text className="text-mainRed font-CairoSemiBold text-base">
                    {t("privateRoom.cancelRoom")}
                  </Text>
                </Pressable>
              </View>
            )}

            <View className="bg-surface rounded-2xl p-5 mt-4 mx-4 mb-4">
              <Text className="text-textMuted font-CairoRegular text-sm leading-5">
                {t("privateRoom.howItWorksDescription")}
              </Text>
            </View>
          </View>
        ) : (
          <View className="flex-1">
            <View className="items-center mb-6">
              <Text className="text-white font-CairoBold text-lg text-center">
                {t("privateRoom.enterCode")}
              </Text>
            </View>

            <TextInput
              value={joinCode}
              onChangeText={(text) => setJoinCode(text.toUpperCase())}
              placeholder={t("privateRoom.codePlaceholder")}
              placeholderTextColor="#94959B"
              maxLength={6}
              className="bg-background border-2 border-border rounded-xl px-4 py-4 text-white font-CairoBlack text-2xl text-center tracking-[8px]"
              style={{ textTransform: "uppercase" }}
            />

            <Pressable
              onPress={handleJoinRoom}
              disabled={joinRoomMutation.isPending || joinCode.length !== 6}
              className="w-full h-14 rounded-xl justify-center items-center mt-6 active:opacity-85"
            >
              <LinearGradient
                colors={
                  joinRoomMutation.isPending || joinCode.length !== 6
                    ? ["#4A4D57", "#4A4D57"]
                    : ["#FF2E95", "#FF5959"]
                }
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 12,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text className="text-white font-CairoBold text-lg">
                  {joinRoomMutation.isPending
                    ? t("common.loading")
                    : t("privateRoom.joinAndPlay")}
                </Text>
              </LinearGradient>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}
