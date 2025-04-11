import { View, Text, TextInput } from 'react-native';
import React from 'react';

const Input = ({
    onChange = () => null,
    value = '',
    placeholder = '',
    type = 'text',
    icon = null
}) => {
    return (
        <View className="flex items-center  border border-gray-300 px-3 py-1 rounded-xl flex-row justify-between">
            <TextInput
                placeholderTextColor='#9ca3af'
                secureTextEntry={type === 'password'}
                className="text-lg grow  font-montserrat-r"
                placeholder={placeholder}
                keyboardType={type === 'number' ? 'numeric' : type === 'email' ? "email-address" : type === 'phone' ? 'phone-pad' : 'default'}
                onChangeText={onChange}
                value={value}
            />
            {icon}
        </View>
    );
};

export default Input;
