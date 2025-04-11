import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';

const LargeBtn = ({ onPress = () => null, text = '', classes = '' ,textClasses = '' }) => {
    return (
        <TouchableOpacity className={` ${classes}  rounded-lg py-4 flex items-center justify-center w-full`}>
            <Text className={`  text-center font-montserrat-sb ${textClasses} `}>
                {text}
            </Text>
        </TouchableOpacity>
    );
};

export default LargeBtn;
