import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db, storage, auth } from '../../../utils/firebase/config'
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Loading from "../../../components/onboarding/Loading";
import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import * as DocumentPicker from 'expo-document-picker';
import { useNavigation } from "expo-router";
import '../../../app/globals'

export default function Profile() {
    const navigation = useNavigation()
    const [RestaurantData, setRestaurantData] = useState({})
    const [id, setId] = useState(auth.currentUser.uid)
    const [logo, setLogo] = useState("")
    const [cover, setCover] = useState("")

    // Get Data
    async function getUserData(userId) {
        try {
            const docRef = doc(db, "service-users", userId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setRestaurantData(docSnap.data());
                return docSnap.data();
            } else {
                console.log("No user!");
                return null;
            }
        } catch (error) {
            console.error("Error fetching user:", error);
            throw error;
        }
    }

    // Update User
    const updateUser = async () => {
        const userId = id;
        const userRef = doc(db, 'service-users', userId);
        try {
            await updateDoc(userRef, RestaurantData);  // Update Firestore with new data
        } catch (error) {
            console.error('Error updating user:', error);
        }
        setEditBtn(!editBtn);
    };

    const [editBtn, setEditBtn] = useState(false);
    const handleChange = (field, text) => {
        setRestaurantData(prev => ({
            ...prev,
            [field]: text
        }));
    };

    const [isMultiSelectOpen, setIsMultiSelectOpen] = useState(false);

    const getImageUrl = async () => {
        const storage = getStorage();
        const coverImg = ref(storage, `services/covers/${id}`);
        const logoImg = ref(storage, `services/logos/${id}`);
        try {
            const url1 = await getDownloadURL(coverImg);
            const url2 = await getDownloadURL(logoImg);
            setCover(url1);
            setLogo(url2);
        } catch (error) {
            console.error('Error fetching image:', error);
            return null;
        }
    };

    const handleEdit = () => {
        setEditBtn(!editBtn);
    };

    useEffect(() => {
        getUserData(id);
        getImageUrl();
    }, []);

    const uploadImage = async (uri, imgName) => {
        const imageRef = ref(storage, `services/${imgName}/${id}`);
        try {
            const response = await fetch(uri);
            const blob = await response.blob();

            await uploadBytes(imageRef, blob);
            console.log('Image uploaded successfully!');

            const url = await getDownloadURL(imageRef);
            return url;

        } catch (error) {
            console.error('Error uploading image:', error);
            return null;
        }
    };

    const handleFileUpload = async (name) => {
        const fileUri = await pickDocument();
        if (fileUri) {
            const downloadUrl = await uploadImage(fileUri, name);
            if (downloadUrl) {
                getImageUrl(); // Refresh images after upload
            }
        }
    };

    // Function to pick image from device gallery
    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'image/*',
                copyToCacheDirectory: true,
                multiple: false,
            });

            if (result.canceled === true) return null;

            const file = result.assets[0];
            return file.uri;
        } catch (error) {
            console.error('Error picking document:', error);
            return null;
        }
    };

    // Function to handle registration
    const handleSignUp = async () => {
        if (editBtn) {
            // Save the data to Firestore upon registration
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                await setDoc(doc(db, 'service-users', user.uid), {
                    serviceName: RestaurantData.serviceName,
                    email: RestaurantData.email,
                    phoneNumber: RestaurantData.phoneNumber,
                    categories: [],
                    info: '',
                    createdAt: new Date(),
                });

                navigation.navigate('Profile');  // Redirect to Profile page after successful registration
            } catch (error) {
                console.error(error);
                alert('Error during sign up: ' + error.message);
            }
        } else {
            // Update profile data
            updateUser();
        }
    };

    return (
        Object.keys(RestaurantData).length > 0 ? (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.welcome}>Welcome, User</Text>
                    <Text style={styles.brand}>Toomiia</Text>
                </View>
                <View style={styles.backRow}>
                    <Pressable onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={28} color="#f26666" />
                    </Pressable>

                    <TouchableOpacity>
                        <Text onPress={handleEdit} style={styles.editBtn}>
                            {editBtn ? <Text onPress={handleSignUp}>Submit</Text> : "Edit"}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.coverSection}>
                    <TouchableOpacity onPress={() => handleFileUpload("covers")} style={styles.coverBox}>
                        {cover.length > 0 ? <Image style={styles.coverBox} source={{ uri: cover }} width={100} height={100} />
                            : <View style={styles.coverBox}>
                                <Text style={styles.coverText}>C O V E R</Text>
                            </View>
                        }
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleFileUpload("logos")}>
                        {logo.length > 0 ? <Image source={{ uri: logo }} style={styles.avatar} />
                            : <View style={styles.avatar}>
                                <Ionicons name="person" size={50} color="white" />
                            </View>}
                    </TouchableOpacity>
                </View>

                <View style={styles.form}>
                    <Text style={styles.label}>Service Name</Text>
                    <TextInput style={styles.input} editable={editBtn} value={RestaurantData.serviceName} onChangeText={(e) => { handleChange("serviceName", e) }} />

                    <Text style={styles.label}>Email</Text>
                    <TextInput keyboardType="email-address" style={styles.input} editable={editBtn} value={RestaurantData.email} onChangeText={(e) => { handleChange("email", e) }} />

                    <Text style={styles.label}>Phone Number</Text>
                    <TextInput keyboardType="numeric" autoCapitalize="none" style={styles.input} editable={editBtn} value={RestaurantData.phoneNumber} onChangeText={(e) => { handleChange("phoneNumber", e) }} />

                    <Text style={styles.label}>Categories</Text>
                    <Text style={styles.input}>
                        {RestaurantData.categories.map((t, index) => {
                            return <Text key={index}>{t + ","} </Text>
                        })}
                    </Text>

                    <Text style={styles.label}>Info</Text>
                    <TextInput style={styles.input} editable={editBtn} value={RestaurantData.info} onChangeText={(e) => { handleChange("info", e) }} />

                </View>

            </View>
        ) : <Loading />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
        paddingHorizontal: 16,
        paddingTop: "20px",
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    welcome: {
        fontSize: 18,
    },
    brand: {
        fontSize: 20,
        color: '#CC4C4C',
        fontWeight: 'bold',
    },
    backRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
        alignItems: 'center',
        backgroundColor: "white",
        padding: '7px',
        borderRadius: "10px"
    },
    editBtn: {
        color: '#FF6969',
        fontWeight: '500',
        fontSize: "20px"
    },
    coverSection: {
        alignItems: "flex-start",
        marginVertical: 20,
    },
    coverBox: {
        width: '100%',
        height: "130px",
        backgroundColor: '#f26666',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    coverText: {
        color: 'white',
        fontSize: 25,
        letterSpacing: 2,
    },
    avatar: {
        backgroundColor: '#FFA0A0',
        borderRadius: 50,
        padding: 3,
        marginTop: -40,
        marginLeft: "50px",
        borderWidth: 4,
        borderColor: '#fff',
        zIndex: "40",
        width: '100px',
        height: "100px"


    },
    avatar2: {
        backgroundColor: '#FFA0A0',
        borderRadius: 50,
        padding: 3,
        marginTop: -40,
        marginLeft: "50px",
        borderWidth: 4,
        borderColor: '#fff',
        zIndex: "40",
    },
    form: {
        gap: 10,
    },
    inputContainer: {
        marginBottom: 8,
    },
    label: {
        color: '#f26666',
        fontWeight: '600',
    },
    input: {
        backgroundColor: '#white',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: "white",

    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 20,
        paddingBottom: 30,
        borderTopWidth: 1,
        borderColor: '#eee',
        marginTop: 'auto',
    },
    navText: {
        fontSize: 12,
        color: '#f26666',
        textAlign: 'center',
    },
    deleteBtn: {
        width: "25%",
        marginTop: "3px",
        color: "black",
        fontSize: "20",
        fontWeight: "bold",
        backgroundColor: '#e53935', // Material red
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
});
