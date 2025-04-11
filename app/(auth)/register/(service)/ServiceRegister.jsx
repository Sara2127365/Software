import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    Text,
    Image,
    TouchableOpacity
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import LargeBtn from '../../../../common/LargeBtn';
import { useRouter } from 'expo-router';

const ServiceRegister = () => {
    const router = useRouter()
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        logo: null,
        cover: null,
        restaurantName: '',
        email: '',
        phoneNumber: '',
        categories: [],
        info: '',
        password: ''
    });

    console.log('FILE FILE', file);

    const pickFile = async id => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'image/*'
            });
            console.log('result', result);
            if (result.type === 'success' || !result.canceled) {
                console.log('Picked file:', result.assets[0]);
                setFile(result.assets[0]);
                setFormData(old => ({ ...old, [id]: result.assets[0] }));
            } else if (result.canceled) {
                console.log('User canceled the picker');
            } else {
                console.log('result', result);
            }
        } catch (err) {
            console.error('ERROR : ', err);
        }
    };

    return (
        <SafeAreaView className="flex-1 py-5 px-3  bg-main-white">
            <ScrollView className="h-full ">
                <View className="flex flex-row items-center justify-between">
                    <AntDesign onPress={()=>router.back()} name="arrowleft" size={24} color="#CC4C4C" />
                    <Text className=" text-main-gray text-xl font-montserrat-r ">
                        Create service account
                    </Text>
                    <Text className=" "></Text>
                </View>
                <View className="imgs-container relative px-5 mt-5">
                    <View className="cover bg-main-rose w-full h-32 rounded-xl">
                        {formData?.cover && (
                            <Image
                                source={{ uri: formData.cover.uri }}
                                className="w-full absolute rounded-xl object-center h-full"
                                resizeMode="cover"
                            />
                        )}
                        <TouchableOpacity
                            onPress={() => pickFile('cover')}
                            className="size-14 absolute -right-5 -bottom-5 rounded-full flex items-center justify-center bg-main-rose border-4 border-white"
                        >
                            <Feather name="camera" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                    <View className="absolute w-full top-4 left-5 flex  flex-row justify-center">
                        <View className="main-image flex items-center justify-center relative size-40 rounded-full bg-main-rose-light">
                            {formData?.logo && (
                                <Image
                                    source={{ uri: formData.logo.uri }}
                                    className="w-full absolute top-0 left-0 rounded-full object-center h-full"
                                    resizeMode="cover"
                                />
                            )}
                            <TouchableOpacity
                                onPress={() => pickFile('logo')}
                                className="size-14 absolute -right-1 -bottom-1 rounded-full flex items-center justify-center bg-main-rose-light border-4 border-white"
                            >
                                <Feather
                                    name="camera"
                                    size={24}
                                    color="white"
                                />
                            </TouchableOpacity>
                            <FontAwesome name="user" size={48} color="white" />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ServiceRegister;
