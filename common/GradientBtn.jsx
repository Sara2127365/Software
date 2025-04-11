import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';

const GradientBtn = ({ onPress = () => null, width, text = '' }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View
                className={`relative h-6 ${width || 'w-44'} bg-main-rose/55`}
            ></View>
            <View
                className={`absolute left-0 bottom-2 ${
                    width || 'w-44'
                } flex items-center `}
            >
                <Text className="text-2xl text-main-gray font-bold">
                    {text}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export default GradientBtn;
