import React, { useState } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import LargeBtn from '../../../../common/LargeBtn';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Modal,
    SafeAreaView,
    FlatList,
    StyleSheet,
    ScrollView,
    Pressable,
    Image

} from 'react-native';
import MultiSelect2 from '../../../../components/mini components/MultiSelect2';

import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { signUp } from '../../../../utils/firebase/auth';
import { createUserAccount } from '../../../../utils/backend helpers/authCalls';
import Input from '../../../../common/Input';
import {
    checkIcon,
    emailIcon,
    informationIcon,
    passwordIcon,
    personIcon,
    phoneIcon,
    chevronDownIcon
    
} from '../../../../constants/icons';

const faculties = [
    'Faculty of Engineering',
    'Faculty of Medicine',
    'Faculty of Arts',
    'Faculty of Science',
    'Faculty of Business'
];

const states = ['Student', 'Worker'];

const SignUp=()=> {
    const router = useRouter();
    const [facultyModalVisible, setFacultyModalVisible] = useState(false);
    const [stateModalVisible, setStateModalVisible] = useState(false);

    const [selectedFaculty, setSelectedFaculty] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
const [isMultiSelectOpen, setIsMultiSelectOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        logo: null,
        cover: null,
        name: '',
        email: '',
        faculty: '',
        password: '',
        phoneNumber: '',
        type: ''
    });

    console.log(`selectedFaculty`, selectedFaculty);
    console.log(`selectedState`, selectedState);
    console.log(`formData`, formData);

    

    const handleSelectFaculty = faculty => {
        setSelectedFaculty(faculty);
        setFormData(old => ({ ...old, faculty }));
        setFacultyModalVisible(false);
    };

    const handleSelectState = state => {
        setSelectedState(state);
        setFormData(old => ({ ...old, type: state }));
        setStateModalVisible(false);
    };

    // async function handleSubmit() {
    //     const result = await signUp({ ...formData, table: 'users' });
    //     console.log(result);
    // }

    async function handleSubmit() {
        const result = await createUserAccount({ ...formData, table: 'users' });
        if (result) {
            router.replace('/LoginPage');
        }
    }

    function handleChange(value, id) {
        setFormData(old => ({ ...old, [id]: value }));
    }
     const pickFile = async id => {
            try {
                const result = await DocumentPicker.getDocumentAsync({
                    type: 'image/*'
                });
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
        <SafeAreaView className="flex-1 py-5 bg-main-white">
            <View className="flex flex-row px-3 mt-5 items-center justify-between">
                <AntDesign
                    onPress={() => router.back()}
                    name="arrowleft"
                    size={24}
                    color="#CC4C4C"
                />
                <Text className=" text-main-gray text-xl font-montserrat-r ">
                    Create User account
                </Text>
                <Text className=" "></Text>
            </View>
            <ScrollView className="px-3">
                <Pressable
                    onPress={() => {
                        setIsMultiSelectOpen(false);
                    }}
                >
                    <View>
                        <View className="imgs-container mb-20 relative px-5 mt-5">
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
                                    <Feather
                                        name="camera"
                                        size={24}
                                        color="white"
                                    />
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
                                    <FontAwesome
                                        name="user"
                                        size={48}
                                        color="white"
                                    />
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* INPUTS */}
                    <View className="flex flex-col gap-4 ">
                        <Input
                            value={formData.name}
                            onChange={value =>
                                handleChange(value, 'name')
                            }
                            placeholder="Full name"
                            icon={personIcon()}
                        />
                        <Input
                            type="email"
                            value={formData.email}
                            onChange={value => handleChange(value, 'email')}
                            placeholder="email"
                            icon={emailIcon()}
                        />
                        <Input
                            type="phone"
                            value={formData.phoneNumber}
                            onChange={value =>
                                handleChange(value, 'phoneNumber')
                            }
                            placeholder="phone number"
                            icon={phoneIcon()}
                        />
                       
                       <Input
                            type="states"
                            value={formData.type}
                            onChange={value =>
                                handleChange(value, 'type')
                            }
                            placeholder="You are"
                            icon={chevronDownIcon}
                            
                        />

                      
                       
                      
                        <MultiSelect2
                            setIsMultiSelectOpen={setIsMultiSelectOpen}
                            isMultiSelectOpen={isMultiSelectOpen}
                            title="Faculty"
                        />

                        
                         

                        <Input
                            value={formData.password}
                            onChange={value => handleChange(value, 'password')}
                            type="password"
                            placeholder="password"
                            icon={passwordIcon()}
                        />
                    </View>
                    <LargeBtn
                        onPress={handleSubmit}
                        text="Register"
                        classes="py-4 mt-10 w-full bg-main-rose rounded-xl"
                        textClasses="text-lg"
                    />
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
};

export default   SignUp;

    