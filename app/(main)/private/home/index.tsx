import { useEffect, useRef } from "react";
import { Alert, ScrollView, View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useModalStore } from "@/presentation/store/useModalStore";
import ButtonGeneral from "@/presentation/components/ui/ButtonGeneral";
import { useActiveMatch } from "@/presentation/hooks/useMatch";

export default function HomeScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { openModalNewGame } = useModalStore();
  const activeMatchQuery = useActiveMatch();
  const resumePromptedRef = useRef(false);

  // An unfinished private match survives reloads: offer to rejoin it.
  const activeMatch = activeMatchQuery.data;
  useEffect(() => {
    if (!activeMatch || activeMatch.mode !== "PRIVATE") return;
    if (resumePromptedRef.current) return;
    resumePromptedRef.current = true;

    const resume = () =>
      router.push(
        activeMatch.status === "WAITING"
          ? {
              pathname: "/private/game/select-secret",
              params: { mode: "PRIVATE", matchId: activeMatch.id },
            }
          : {
              pathname: "/private/game/online-match",
              params: { matchId: activeMatch.id },
            },
      );
    Alert.alert(t("game.resumeMatchTitle"), t("game.resumeMatchBody"), [
      { text: t("common.cancel"), style: "cancel" },
      { text: t("game.resumeMatch"), onPress: resume },
    ]);
  }, [activeMatch, t]);

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{
        flexGrow: 1,
        paddingTop: insets.top + 24,
        paddingBottom: insets.bottom + 24,
        paddingHorizontal: 24,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1 justify-center items-center w-full">
        <Text className="text-4xl font-CairoBold text-white mb-2">
          {t("home.title")}
        </Text>
        <Text className="text-xl font-CairoRegular text-textMuted mb-12">
          {t("home.subtitleHome")}
        </Text>

        <View className="w-full gap-4 items-center">
          <ButtonGeneral
            label={t("home.buttonNewGame")}
            type="primary"
            onPress={openModalNewGame}
          />
          <ButtonGeneral
            label={t("home.buttonRecord")}
            type="secondary"
            onPress={() => router.push("/private/record")}
          />
          <ButtonGeneral
            label={t("home.buttonConfig")}
            type="tertiary"
            onPress={() => router.push("/private/config")}
          />
        </View>
      </View>
    </ScrollView>
  );
}
