import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

const FirstScreen = ({ setStep }) => {
  return (
    <View className="flex flex-col py-20  items-center gap-10 h-[80%] justify-between">
      <View className="flex flex-col items-center">
        <Text className="font-montserrat-sb text-center text-5xl text-main-rose mb-2">
          Toomiia
        </Text>
        <Text className="font-montserrat-sb text-center text-2xl text-main-gray-dark mb-4">
          Welcome To Toomiia
        </Text>
        <Text className="font-montserrat-sb text-center text-lg text-main-gray">
          food ordering is easier like never before
        </Text>
      </View>
      <TouchableOpacity onPress={() => setStep(2)}>
        <View className="relative h-6 w-44 bg-main-rose/55"></View>
        <View className="absolute left-0 bottom-2 w-44 flex items-center ">
          <Text className="text-2xl text-main-gray font-bold">TAKE A TOUR</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default FirstScreen;
