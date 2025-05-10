import {
    View,
    Text,
    Image,
    TextInput,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import { MaterialIcons } from '@expo/vector-icons';

import useGetData from '../../../utils/custom hooks/useGetData';
import { getAllCategories } from '../../../utils/backend helpers/foodCalls';
import {
    addProduct,
    getFoodsByUid,
    getServiceData
} from '../../../utils/backend helpers/serviceCalls';
import MultiSelect from '../../../components/mini components/MultiSelect';

const Dashboard = () => {
    const [isMultiSelectOpen, setIsMultiSelectOpen] = useState(false);
    const [uid, setUid] = useState(null);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);
    const [selectedCats, setSelectedCats] = useState({ categories: [] });
    const [getAgain, setGetAgain] = useState(0);

    console.log('selectedCats', selectedCats);

    useEffect(() => {
        const fetchUid = async () => {
            const storedUid = await AsyncStorage.getItem('uid');
            setUid(storedUid);
        };
        fetchUid();
    }, []);

    const { data: categories, loading } = useGetData({ fn: getAllCategories });
    const { data } = useGetData({
        fn: () => (uid ? getServiceData(uid) : null),
        dependencies: [uid]
    });
    const { data: products } = useGetData({
        fn: () => (uid ? getFoodsByUid(uid) : null),
        dependencies: [getAgain]
    });
    console.log('products', products);

    const pickFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'image/*'
            });
            if (result.type === 'success' || !result.canceled) {
                console.log('Picked file:', result.assets[0]);
                setImage(result.assets[0]);
            } else if (result.canceled) {
                console.log('User canceled the picker');
            } else {
                console.log('result', result);
            }
        } catch (err) {
            console.error('ERROR : ', err);
        }
    };

    const handleSubmit = async () => {
        console.log(name, price, image);

        if (!name || !price || !image?.uri) {
            alert('Please fill all fields and select an image');
            return;
        }

        try {
            const res = await addProduct({
                name,
                price: parseFloat(price),
                uri: image.uri,
                uid: uid,
                categories: selectedCats.categories
            });

            console.log('Product added:', res);
            if (uid) {
                setGetAgain(old => old + 1);
            }

            // Reset form
            setName('');
            setPrice('');
            setImage(null);
            setSelectedCats([]);
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    return (
        <ScrollView className="bg-gray-100 mb-20 p-4">
            <View className="mb-6">
                <Text className="text-2xl font-bold text-main-rose-dark">
                    Dashboard
                </Text>
                <Text className="text-main-rose">Manage your products</Text>
            </View>

            <View className="bg-white p-4 rounded-lg shadow-md mb-6">
                <Text className="text-lg font-semibold text-main-rose mb-4">
                    Add New Product
                </Text>

                <TextInput
                    placeholder="Product name"
                    value={name}
                    onChangeText={setName}
                    className="border border-gray-300 text-lg rounded-xl px-3 p-4 mb-3"
                    placeholderTextColor="#9CA3AF"
                />

                <TextInput
                    placeholder="Price"
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="numeric"
                    className="border border-gray-300 text-lg rounded-xl px-3 p-4 mb-3"
                    placeholderTextColor="#9CA3AF"
                />

                <MultiSelect
                    isSingle
                    nameNoId
                    objKey="categories"
                    setData={setSelectedCats}
                    options={categories}
                    setIsMultiSelectOpen={setIsMultiSelectOpen}
                    isMultiSelectOpen={isMultiSelectOpen}
                    title="categories"
                />

                <TouchableOpacity
                    onPress={pickFile}
                    className="flex-row mt-3 items-center bg-red-100 p-3 rounded mb-3"
                >
                    <MaterialIcons name="image" size={20} color="#991B1B" />
                    <Text className="text-main-rose-dark ml-2">
                        {image?.uri ? 'Image Selected' : 'Select Product Image'}
                    </Text>
                </TouchableOpacity>

                {image?.uri && (
                    <Image
                        source={{ uri: image.uri }}
                        className="w-24 h-24 rounded mb-3 self-center"
                    />
                )}

                <TouchableOpacity
                    onPress={handleSubmit}
                    className="bg-main-rose p-3 rounded items-center"
                >
                    <Text className="text-white font-bold">Add Product</Text>
                </TouchableOpacity>
            </View>

            {/* Products Grid */}
            <View className="mb-6">
                <Text className="text-lg font-semibold text-main-rose mb-3">
                    Your Products
                </Text>

                {products?.length === 0 ? (
                    <View className="bg-white p-4 rounded-lg items-center">
                        <Text className="text-gray-500">
                            No products yet. Add your first product!
                        </Text>
                    </View>
                ) : (
                    <View className="flex-row flex-wrap justify-between">
                        {products?.map((product, index) => (
                            <View
                                key={index}
                                className="w-[48%] bg-white p-3 rounded-lg shadow mb-4"
                            >
                                <Image
                                    source={{ uri: product.url }}
                                    className="w-full h-32 rounded"
                                    resizeMode="cover"
                                />
                                <Text className="font-bold text-main-rose-dark mt-2">
                                    {product.name}
                                </Text>
                                <Text className="text-main-rose">
                                    EGP {product.price.toFixed(2)}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

export default Dashboard;
