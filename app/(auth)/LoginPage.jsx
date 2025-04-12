import { View, Text, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { emailIcon, passwordIcon } from '../../constants/icons';
import Input from '../../common/Input';
import LargeBtn from '../../common/LargeBtn';
import { handleLogin } from '../../utils/backend helpers/authCalls';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginPage = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    function handleChange(value, id) {
        setFormData(old => ({ ...old, [id]: value }));
    }

    async function handleSubmit() {
        const result = await handleLogin(formData);
        if (result) {
            console.log('IM HEREEEEEEEEEEEE');
            router.replace('/');
            AsyncStorage.setItem('status', 'true');
        }
    }

    return (
        <SafeAreaView className="flex flex-col px-3 font-montserrat-r  bg-main-white h-full justify-end">
            <View className="flex flex-col py-20  items-center gap-10 h-[80%] justify-between">
                <View className="flex flex-col items-center">
                    <Text className="font-montserrat-sb text-center text-5xl text-main-rose mb-2">
                        Toomiia
                    </Text>
                </View>
                <View className="w-full flex flex-col gap-3">
                    <Input
                        type="email"
                        value={formData.email}
                        onChange={value => handleChange(value, 'email')}
                        placeholder="email"
                        icon={emailIcon()}
                    />
                    <Input
                        value={formData.password}
                        onChange={value => handleChange(value, 'password')}
                        type="password"
                        placeholder="password"
                        icon={passwordIcon()}
                    />
                    <LargeBtn
                        onPress={handleSubmit}
                        text="Login"
                        classes="py-4 mt-4 w-full bg-main-rose rounded-xl"
                        textClasses="text-lg"
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

export default LoginPage;
