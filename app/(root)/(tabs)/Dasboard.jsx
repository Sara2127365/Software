import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import { MaterialIcons } from '@expo/vector-icons';
import useGetData from '../../../utils/custom hooks/useGetData';
import { getAllCategories } from '../../../utils/backend helpers/foodCalls';
import {
    addProduct,
    getFoodsByUid,
    deleteProduct,
    updateProduct
} from '../../../utils/backend helpers/serviceCalls';
import MultiSelect from '../../../components/mini components/MultiSelect';
import LargeBtn from '../../../common/LargeBtn';
import { handleLogout } from '../../../utils/backend helpers/authCalls';
import { router } from 'expo-router';

const Dashboard = () => {
    const [isMultiSelectOpen, setIsMultiSelectOpen] = useState(false);
    const [uid, setUid] = useState(null);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);
    const [selectedCats, setSelectedCats] = useState({ categories: [] });
    const [getAgain, setGetAgain] = useState(0);
    const [productToEdit, setProductToEdit] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const scrollViewRef = useRef();

    useEffect(() => {
        const fetchUid = async () => {
            try {
                const storedUid = await AsyncStorage.getItem('uid');
                if (storedUid) {
                    setUid(storedUid);
                }
            } catch (error) {
                console.error('Error fetching UID:', error);
            }
        };
        fetchUid();
    }, []);

    const { data: categories } = useGetData({
        fn: getAllCategories,
        immediate: true
    });

    const { data: products } = useGetData({
        fn: () => getFoodsByUid(uid),
        dependencies: [uid, getAgain],
        immediate: !!uid
    });

    const pickFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'image/*'
            });
            if (result.type === 'success' || !result.canceled) {
                setImage(result.assets[0]);
            }
        } catch (error) {
            console.error('Error picking file:', error);
            Alert.alert('Error', 'Failed to pick image');
        }
    };

    const handleSubmit = async () => {
        if (!name || !price || !image?.uri) {
            Alert.alert('Error', 'Please fill all fields and select an image');
            return;
        }

        setIsLoading(true);
        try {
            if (productToEdit) {
                await updateProduct(productToEdit.id, {
                    name,
                    price: parseFloat(price),
                    uri: image.uri,
                    categories: selectedCats.categories
                });
                Alert.alert('Success', 'Product updated successfully');
            } else {
                await addProduct({
                    name,
                    price: parseFloat(price),
                    uri: image.uri,
                    uid,
                    categories: selectedCats.categories
                });
                Alert.alert('Success', 'Product added successfully');
            }

            setGetAgain(prev => prev + 1);
            resetForm();
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'Operation failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setName('');
        setPrice('');
        setImage(null);
        setSelectedCats({ categories: [] });
        setProductToEdit(null);
    };

    const handleEdit = product => {
        setName(product.name);
        setPrice(product.price.toString());
        setImage({ uri: product.url });
        setSelectedCats({ categories: product.categories || [] });
        setProductToEdit(product);

        // Scroll to top when editing
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    };

    const confirmDelete = productId => {
        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this product?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Delete',
                    onPress: () => handleDelete(productId),
                    style: 'destructive'
                }
            ]
        );
    };

    const handleDelete = async productId => {
        try {
            await deleteProduct(productId);
            setGetAgain(prev => prev + 1);
            Alert.alert('Success', 'Product deleted successfully');
        } catch (error) {
            console.error('Error deleting product:', error);
            Alert.alert('Error', 'Failed to delete product');
        }
    };

    function logOut() {
        handleLogout()
        router.replace('/onBoarding')
    }

    return (
        <ScrollView
            ref={scrollViewRef}
            className="bg-gray-100 mb-20 p-4"
            contentContainerStyle={{ paddingBottom: 20 }}
        >
            <View className="mb-6">
                <Text className="text-2xl font-bold text-main-rose-dark">
                    Dashboard
                </Text>
                <Text className="text-main-rose">Manage your products</Text>
            </View>

            <View className="bg-white p-4 rounded-lg shadow-md mb-6">
                <Text className="text-lg font-semibold text-main-rose mb-4">
                    {productToEdit ? 'Update Product' : 'Add Product'}
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
                    selectedOptions={selectedCats.categories}
                />
                <TouchableOpacity
                    onPress={pickFile}
                    className="flex-row mt-3 items-center bg-red-100 p-3 rounded mb-3"
                    disabled={isLoading}
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
                    disabled={isLoading}
                >
                    <Text className="text-white font-bold">
                        {isLoading
                            ? 'Processing...'
                            : productToEdit
                            ? 'Update Product'
                            : 'Add Product'}
                    </Text>
                </TouchableOpacity>
                {productToEdit && (
                    <TouchableOpacity
                        onPress={resetForm}
                        className="bg-gray-500 p-3 rounded items-center mt-2"
                        disabled={isLoading}
                    >
                        <Text className="text-white font-bold">
                            Cancel Edit
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            <View className="mb-6">
                <Text className="text-lg font-semibold text-main-rose mb-3">
                    Your Products ({products?.length || 0})
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
                                    ${product?.price.toFixed(2)}
                                </Text>

                                <TouchableOpacity
                                    onPress={() => handleEdit(product)}
                                    className="mt-2 bg-blue-500 p-2 rounded"
                                    disabled={isLoading}
                                >
                                    <Text className="text-white text-center">
                                        Edit
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => confirmDelete(product.id)}
                                    className="mt-2 bg-red-500 p-2 rounded"
                                    disabled={isLoading}
                                >
                                    <Text className="text-white text-center">
                                        Delete
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                )}
            </View>
            <LargeBtn classes='bg-main-rose' text='Log out' onPress={logOut} />
        </ScrollView>
    );
};

export default Dashboard;
