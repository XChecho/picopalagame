import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";

export default function RegisterScreen() {
  const { t } = useTranslation();

  return (
    <View className="flex-1 bg-background justify-center items-center">
      <Text className="text-2xl font-CairoBold text-white">
        {t("auth.register")}
      </Text>
    </View>
  );
}
