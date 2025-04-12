import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import LargeBtn from '../../common/LargeBtn';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
// or correct relative path


const AuthRouter = () => {
    const router = useRouter();

    function serviceRegisterRoute() {
        router.push('/register/ServiceRegister');
    }

    function userSignupRoute() {
        router.push('/user/signUp');
    }

    function userLoginRoute() {
        router.push('/user/login');
    }


    function fakeLogin() {
        AsyncStorage.setItem('onboardingCompleted','true')
        console.log(AsyncStorage.getItem('onboardingCompleted'));
        router.replace('/')
    }

    return (
        <SafeAreaView className="flex flex-col px-3 font-montserrat-r  bg-main-white h-full justify-end">
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
                <View className="w-full flex flex-col gap-3">
                    <LargeBtn
                        onPress={userLoginRoute}
                        textClasses="text-[#2B2B25] text-lg"
                        classes="bg-main-rose"
                        text="Log In"
                        
                    />
                    <LargeBtn
                    onPress={userSignupRoute}
                        textClasses="text-[#2B2B25] text-lg"
                        classes="bg-white border border-gray-300"
                        text="Create Account"
                     />   
                       
                    <LargeBtn
                        onPress={serviceRegisterRoute}
                        textClasses="text-main-gray"
                        classes=""
                        text="Apply For Your Restaurant"
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

export default AuthRouter;
