import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Modal,
    FlatList,
    StyleSheet,
    ScrollView,
    Image,
    TouchableWithoutFeedback,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import {
    collection,
    doc,
    getDocs,
    setDoc,
    query,
    where
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db } from '../../../../utils/firebase/config';
import LargeBtn from '../../../../common/LargeBtn';

const faculties = [
    'Faculty of Science',
    'Faculty of Arts',
    'Faculty of Business',
    'Faculty of Law',
    'Faculty of Archaeology',
    'Faculty of Urban Planning',
    'Faculty of Dar Al Uloom',
    'Faculty of Mass Communication'
];
const states = ['Student', 'Worker'];

const uploadImageToFirebase = async (file, uid) => {
    try {
        const response = await fetch(file.uri);
        const blob = await response.blob();

        const storage = getStorage();
        const storageRef = ref(storage, `profilePictures/${uid}.jpg`);

        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    } catch (error) {
        console.error('Error uploading image:', error);
        return null;
    }
};

export default function SignUp() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [facultyModalVisible, setFacultyModalVisible] = useState(false);
    const [stateModalVisible, setStateModalVisible] = useState(false);
    const [selectedFaculty, setSelectedFaculty] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        password: '',
        logo: null
    });

    const handleSelectFaculty = faculty => {
        setSelectedFaculty(faculty);
        setFacultyModalVisible(false);
    };

    const handleSelectState = state => {
        setSelectedState(state);
        setStateModalVisible(false);
    };

    const pickFile = async id => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'image/*',
                copyToCacheDirectory: true,
                multiple: false
            });
            if (!result.canceled && result.assets?.length > 0) {
                const file = result.assets[0];
                setFormData(prev => ({ ...prev, [id]: file }));
            }
        } catch (err) {
            console.error('Error picking file:', err);
        }
    };

    const handleRegisterSubmit = async () => {
        const { name, email, phoneNumber, password, logo } = formData;

        if (
            !name ||
            !email ||
            !phoneNumber ||
            !password ||
            !selectedFaculty ||
            !selectedState
        ) {
            alert('Please fill all fields');
            return;
        }

        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            alert('Invalid email format');
            return;
        }

        const phoneNumberRegex = /^01[0-9]{9}$/;
        if (!phoneNumberRegex.test(phoneNumber)) {
            alert('Please enter a valid Egyptian phone number');
            return;
        }

        if (password.length < 6) {
            alert('Password must be at least 6 characters');
            return;
        }

        try {
            setLoading(true)
            const usersRef = collection(db, 'users');
            const emailQuery = query(usersRef, where('email', '==', email));
            const querySnapshot = await getDocs(emailQuery);

            if (!querySnapshot.empty) {
                alert('Email already exists');
                return;
            }

            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            const user = userCredential.user;

            let imageUrl = null;
            if (logo) {
                imageUrl = await uploadImageToFirebase(logo, user.uid);
            }

            const userRef = doc(db, 'users', user.uid);
            await setDoc(userRef, {
                uid: user.uid,
                name,
                email,
                phoneNumber,
                faculty: selectedFaculty,
                state: selectedState,
                logo: imageUrl
            });

            alert('Account created successfully');
            router.push('/LoginPage');
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                alert('Email already in use');
            } else {
                alert('Error creating account');
                console.error(error);
            }
        } finally {
            setLoading(false)
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                >
                    <AntDesign name="arrowleft" size={24} color="#CC4C4C" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Create user account</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.avatarContainer}>
                    <View style={styles.avatarCircle}>
                        {formData.logo ? (
                            <Image
                                source={{ uri: formData.logo.uri }}
                                style={styles.avatarImage}
                                resizeMode="cover"
                            />
                        ) : (
                            <FontAwesome name="user" size={48} color="white" />
                        )}
                        <TouchableOpacity
                            onPress={() => pickFile('logo')}
                            style={styles.cameraIcon}
                        >
                            <Feather name="camera" size={18} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.formContainer}>
                    {/* Name Input */}
                    <View style={styles.inputWrapper}>
                        <Feather
                            name="user"
                            size={20}
                            color="#D3D3D3"
                            style={styles.inputIcon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Full name"
                            value={formData.name}
                            onChangeText={text =>
                                setFormData(prev => ({ ...prev, name: text }))
                            }
                        />
                    </View>

                    {/* Email Input */}
                    <View style={styles.inputWrapper}>
                        <Feather
                            name="mail"
                            size={20}
                            color="#D3D3D3"
                            style={styles.inputIcon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={formData.email}
                            onChangeText={text =>
                                setFormData(prev => ({ ...prev, email: text }))
                            }
                        />
                    </View>

                    {/* Phone Input */}
                    <View style={styles.inputWrapper}>
                        <Feather
                            name="phone"
                            size={20}
                            color="#D3D3D3"
                            style={styles.inputIcon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Phone Number"
                            keyboardType="phone-pad"
                            value={formData.phoneNumber}
                            onChangeText={text =>
                                setFormData(prev => ({
                                    ...prev,
                                    phoneNumber: text
                                }))
                            }
                        />
                    </View>

                    {/* Faculty Selector */}
                    <TouchableOpacity
                        style={[styles.inputWrapper, styles.selectorWrapper]}
                        onPress={() => setFacultyModalVisible(true)}
                    >
                        <Text
                            style={[
                                styles.selectorText,
                                !selectedFaculty && styles.placeholderText
                            ]}
                        >
                            {selectedFaculty || 'Select Faculty'}
                        </Text>
                        <Feather
                            name="chevron-down"
                            size={20}
                            color="#D3D3D3"
                            style={styles.selectorIcon}
                        />
                    </TouchableOpacity>

                    {/* State Selector */}
                    <TouchableOpacity
                        style={[styles.inputWrapper, styles.selectorWrapper]}
                        onPress={() => setStateModalVisible(true)}
                    >
                        <Text
                            style={[
                                styles.selectorText,
                                !selectedState && styles.placeholderText
                            ]}
                        >
                            {selectedState || 'Select State'}
                        </Text>
                        <Feather
                            name="chevron-down"
                            size={20}
                            color="#D3D3D3"
                            style={styles.selectorIcon}
                        />
                    </TouchableOpacity>

                    {/* Password Input */}
                    <View style={styles.inputWrapper}>
                        <Feather
                            name="lock"
                            size={20}
                            color="#D3D3D3"
                            style={styles.inputIcon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            secureTextEntry
                            value={formData.password}
                            onChangeText={text =>
                                setFormData(prev => ({
                                    ...prev,
                                    password: text
                                }))
                            }
                        />
                    </View>
                </View>

                <LargeBtn
                        loading={loading}
                        onPress={handleRegisterSubmit}
                        text="Register"
                        classes="py-4 mt-10 w-full bg-main-rose rounded-xl"
                        textClasses="text-lg"
                    />

                {/* <TouchableOpacity
                    style={styles.registerButton}
                    onPress={handleRegisterSubmit}
                >
                    <Text style={styles.registerButtonText}>Register</Text>
                </TouchableOpacity> */}
            </ScrollView>

            {/* Faculty Modal */}
            <Modal
                visible={facultyModalVisible}
                transparent
                animationType="fade"
            >
                <TouchableWithoutFeedback
                    onPress={() => setFacultyModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <FlatList
                                data={faculties}
                                keyExtractor={item => item}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() =>
                                            handleSelectFaculty(item)
                                        }
                                        style={styles.modalItem}
                                    >
                                        <Text style={styles.modalItemText}>
                                            {item}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {/* State Modal */}
            <Modal visible={stateModalVisible} transparent animationType="fade">
                <TouchableWithoutFeedback
                    onPress={() => setStateModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <FlatList
                                data={states}
                                keyExtractor={item => item}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => handleSelectState(item)}
                                        style={styles.modalItem}
                                    >
                                        <Text style={styles.modalItemText}>
                                            {item}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8'
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
        fontSize: 18,
        fontWeight: '600',
        color: '#333'
    },
    scrollContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40
    },
    avatarContainer: {
        alignItems: 'center',
        marginVertical: 20
    },
    avatarCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#FFBABA',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        borderRadius: 60
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#FF6969',
        borderRadius: 20,
        padding: 8,
        borderWidth: 2,
        borderColor: 'white'
    },
    formContainer: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#D3D3D3',
        borderRadius: 8,
        marginBottom: 16,
        paddingHorizontal: 12
    },
    inputIcon: {
        marginRight: 10
    },
    input: {
        flex: 1,
        height: 48,
        fontSize: 16,
        color: '#333',
        paddingVertical: 0 // Important for vertical alignment
    },
    selectorWrapper: {
        justifyContent: 'space-between',
        paddingRight: 8,
        height: 48
    },
    selectorText: {
        fontSize: 16,
        color: '#333'
    },
    placeholderText: {
        color: '#999'
    },
    selectorIcon: {
        marginLeft: 8
    },
    registerButton: {
        backgroundColor: '#FF6969',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    registerButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600'
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        maxHeight: '60%'
    },
    modalItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE'
    },
    modalItemText: {
        fontSize: 16
    }
});
