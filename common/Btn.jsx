import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';

const Btn = ({ onPress = () => null, text = '' }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View
                className={` flex items-center  bg-main-rose-light px-6 py-1`}
            >
                <Text className="text-2xl text-main-gray-dark font-bold">
                    {text}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export default Btn;
