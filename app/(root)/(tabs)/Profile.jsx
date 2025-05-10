import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, storage, auth } from '../../../utils/firebase/config';
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Image,
    TouchableOpacity,
    Pressable,
    Alert,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Loading from '../../../components/onboarding/Loading';
import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import * as DocumentPicker from 'expo-document-picker';
import { useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import '../../../app/globals';

export default function Profile() {
    const [uid, setUid] = useState(null);
    const navigation = useNavigation();
    const [restaurantData, setRestaurantData] = useState({
        serviceName: '',
        email: '',
        phoneNumber: '',
        categories: [],
        info: ''
    });
    const [logo, setLogo] = useState('');
    const [cover, setCover] = useState('');
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchUid = async () => {
            try {
                const storedUid = await AsyncStorage.getItem('uid');
                if (storedUid) {
                    setUid(storedUid);
                } else if (auth?.currentUser?.uid) {
                    setUid(auth.currentUser.uid);
                }
            } catch (error) {
                console.error('Error fetching UID:', error);
                Alert.alert('Error', 'Failed to load user data');
            }
        };
        fetchUid();
    }, []);

    // Get user data
    useEffect(() => {
        if (!uid) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await getUserData(uid);
                if (data) {
                    setRestaurantData(prev => ({
                        ...prev,
                        ...data,
                        categories: Array.isArray(data.categories)
                            ? data.categories
                            : []
                    }));
                }
                await getImageUrl();
            } catch (error) {
                console.error('Error fetching data:', error);
                Alert.alert('Error', 'Failed to load profile data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [uid]);

    async function getUserData(userId) {
        try {
            const docRef = doc(db, 'service-users', userId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return docSnap.data();
            }
            return null;
        } catch (error) {
            console.error('Error fetching user:', error);
            throw error;
        }
    }

    // Update user data
    const updateUser = async () => {
        if (!uid) return;

        try {
            setLoading(true);
            const userRef = doc(db, 'service-users', uid);
            await updateDoc(userRef, restaurantData);
            Alert.alert('Success', 'Profile updated successfully');
            setEditMode(false);
        } catch (error) {
            console.error('Error updating user:', error);
            Alert.alert('Error', 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };
console.log('restaurantData',restaurantData);

    const handleChange = (field, text) => {
        setRestaurantData(prev => ({
            ...prev,
            [field]: text
        }));
    };

    const getImageUrl = async () => {
        if (!uid) return;

        const storage = getStorage();
        const coverImg = ref(storage, `services/covers/${uid}`);
        const logoImg = ref(storage, `services/logos/${uid}`);

        try {
            const [url1, url2] = await Promise.all([
                getDownloadURL(coverImg).catch(() => ''),
                getDownloadURL(logoImg).catch(() => '')
            ]);
            setCover(url1);
            setLogo(url2);
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    };

    const uploadImage = async (uri, imgName) => {
        if (!uid) return null;

        try {
            setUploading(true);
            const imageRef = ref(storage, `services/${imgName}/${uid}`);
            const response = await fetch(uri);
            const blob = await response.blob();

            await uploadBytes(imageRef, blob);
            return await getDownloadURL(imageRef);
        } catch (error) {
            console.error('Error uploading image:', error);
            Alert.alert('Error', 'Failed to upload image');
            return null;
        } finally {
            setUploading(false);
        }
    };

    const handleFileUpload = async name => {
        const result = await DocumentPicker.getDocumentAsync({
            type: 'image/*',
            copyToCacheDirectory: true
        });

        if (result.canceled) return;

        const fileUri = result.assets[0].uri;
        const downloadUrl = await uploadImage(fileUri, name);
        if (downloadUrl) {
            getImageUrl(); // Refresh images
        }
    };

    const toggleEditMode = () => {
        if (editMode) {
            updateUser();
        } else {
            setEditMode(true);
        }
    };

    const renderCategories = () => {
        if (
            !restaurantData.categories ||
            restaurantData.categories.length === 0
        ) {
            return <Text style={styles.input}>No categories selected</Text>;
        }
        return (
            <Text style={styles.input}>
                {restaurantData.categories.join(', ')}
            </Text>
        );
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <ScrollView
            className="mb-10"
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
        >
            {/* Header Section */}
            <View style={styles.header}>
                <Pressable
                    onPress={() => setEditMode(false)} // Remove the parentheses to pass the function reference
                    style={styles.backButton}
                >
                    {editMode && <Text style={styles.cancelText}>Cancel</Text>}
                </Pressable>
                <Text style={styles.headerTitle}>Profile</Text>
                <TouchableOpacity
                    onPress={toggleEditMode}
                    disabled={loading || uploading}
                    style={styles.editButton}
                >
                    <Text style={styles.editButtonText}>
                        {editMode ? 'Save' : 'Edit'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Profile Image Section */}
            <View style={styles.profileHeader}>
                <View style={styles.coverPhotoContainer}>
                    <TouchableOpacity
                        onPress={() => handleFileUpload('covers')}
                        disabled={!editMode || uploading}
                    >
                        {cover ? (
                            <Image
                                source={{ uri: cover }}
                                style={styles.coverPhoto}
                                resizeMode="cover"
                            />
                        ) : (
                            <View
                                style={[
                                    styles.coverPhoto,
                                    styles.coverPlaceholder
                                ]}
                            >
                                <Ionicons
                                    name="image"
                                    size={32}
                                    color="#FF6969"
                                />
                                {editMode && (
                                    <Text style={styles.uploadPrompt}>
                                        Tap to upload cover
                                    </Text>
                                )}
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.profilePhotoContainer}>
                    <TouchableOpacity
                        onPress={() => handleFileUpload('logos')}
                        disabled={!editMode || uploading}
                    >
                        {logo ? (
                            <Image
                                source={{ uri: logo }}
                                style={styles.profilePhoto}
                                resizeMode="cover"
                            />
                        ) : (
                            <View
                                style={[
                                    styles.profilePhoto,
                                    styles.profilePlaceholder
                                ]}
                            >
                                <Ionicons
                                    name="person"
                                    size={40}
                                    color="white"
                                />
                            </View>
                        )}
                        {editMode && (
                            <View style={styles.editPhotoBadge}>
                                <Ionicons
                                    name="camera"
                                    size={16}
                                    color="white"
                                />
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            {/* Welcome Text */}
            <Text style={styles.welcomeText}>
                Welcome back, {restaurantData.serviceName || 'User'}!
            </Text>

            {/* Form Section */}
            <View style={styles.formContainer}>
                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Service Name</Text>
                    <TextInput
                        style={styles.inputField}
                        editable={editMode}
                        value={restaurantData.serviceName || ''}
                        onChangeText={text => handleChange('serviceName', text)}
                        placeholder="Your service name"
                        placeholderTextColor="#999"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Email</Text>
                    <TextInput
                        keyboardType="email-address"
                        style={styles.inputField}
                        editable={editMode}
                        value={restaurantData.email || ''}
                        onChangeText={text => handleChange('email', text)}
                        placeholder="your@email.com"
                        placeholderTextColor="#999"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Phone Number</Text>
                    <TextInput
                        keyboardType="phone-pad"
                        style={styles.inputField}
                        editable={editMode}
                        value={restaurantData.phoneNumber || ''}
                        onChangeText={text => handleChange('phoneNumber', text)}
                        placeholder="+1 (___) ___-____"
                        placeholderTextColor="#999"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Categories</Text>
                    <View style={styles.categoriesContainer}>
                        {restaurantData.categories?.length > 0 ? (
                            restaurantData.categories.map((category, index) => (
                                <View key={index} style={styles.categoryPill}>
                                    <Text style={styles.categoryText}>
                                        {category}
                                    </Text>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.noCategoriesText}>
                                No categories selected
                            </Text>
                        )}
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>About</Text>
                    <TextInput
                        style={[styles.inputField, styles.multilineInput]}
                        editable={editMode}
                        multiline
                        numberOfLines={4}
                        value={restaurantData.info || ''}
                        onChangeText={text => handleChange('info', text)}
                        placeholder="Tell us about your service..."
                        placeholderTextColor="#999"
                    />
                </View>
            </View>

            {/* Uploading Indicator */}
            {uploading && (
                <View style={styles.uploadingOverlay}>
                    <ActivityIndicator size="large" color="#FF6969" />
                    <Text style={styles.uploadingText}>Uploading...</Text>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8'
    },
    scrollContent: {
        paddingBottom: 40
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#EEE'
    },
    backButton: {
        padding: 8
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333'
    },
    editButton: {
        padding: 8
    },
    editButtonText: {
        color: '#FF6969',
        fontSize: 16,
        fontWeight: '500'
    },
    profileHeader: {
        marginBottom: 24
    },
    coverPhotoContainer: {
        height: 160,
        backgroundColor: '#F0F0F0'
    },
    coverPhoto: {
        width: '100%',
        height: '100%'
    },
    coverPlaceholder: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFE9E9'
    },
    uploadPrompt: {
        marginTop: 8,
        color: '#FF6969',
        fontSize: 14
    },
    profilePhotoContainer: {
        position: 'absolute',
        bottom: -40,
        left: 16
    },
    profilePhoto: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: 'white'
    },
    profilePlaceholder: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFA0A0'
    },
    editPhotoBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#FF6969',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white'
    },
    welcomeText: {
        fontSize: 22,
        fontWeight: '600',
        color: '#333',
        marginTop: 56,
        marginHorizontal: 16,
        marginBottom: 24
    },
    formContainer: {
        paddingHorizontal: 16
    },
    inputGroup: {
        marginBottom: 20
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FF6969',
        marginBottom: 8
    },
    inputField: {
        backgroundColor: 'white',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#333',
        borderWidth: 1,
        borderColor: '#EEE'
    },
    multilineInput: {
        minHeight: 100,
        textAlignVertical: 'top'
    },
    categoriesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8
    },
    categoryPill: {
        backgroundColor: '#FFE9E9',
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 8,
        marginBottom: 8
    },
    categoryText: {
        color: '#FF6969',
        fontSize: 14
    },
    noCategoriesText: {
        color: '#999',
        fontSize: 16,
        paddingVertical: 14
    },
    uploadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    uploadingText: {
        marginTop: 16,
        color: '#FF6969',
        fontSize: 16
    }
});
