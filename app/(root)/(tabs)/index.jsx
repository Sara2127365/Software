import { Stack } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="bg-[#F2F2F2] flex-1 justify-center items-center">
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}
