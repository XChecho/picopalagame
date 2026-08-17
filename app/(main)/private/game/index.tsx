import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";

export default function GameScreen() {
  const { t } = useTranslation();

  return (
    <View className="flex-1 bg-background justify-center items-center">
      <Text className="text-2xl font-CairoBold text-white">
        {t("home.game.title")}
      </Text>
    </View>
  );
}
