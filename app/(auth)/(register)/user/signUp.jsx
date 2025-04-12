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
    Pressable
} from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { signUp } from '../../../../utils/firebase/auth';
import { createUserAccount } from '../../../../utils/backend helpers/authCalls';

const faculties = [
    'Faculty of Engineering',
    'Faculty of Medicine',
    'Faculty of Arts',
    'Faculty of Science',
    'Faculty of Business'
];

const states = ['Student', 'Worker'];

export default function SignUp() {
    const [facultyModalVisible, setFacultyModalVisible] = useState(false);
    const [stateModalVisible, setStateModalVisible] = useState(false);

    const [selectedFaculty, setSelectedFaculty] = useState(null);
    const [selectedState, setSelectedState] = useState(null);

    const [formData, setFormData] = useState({
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

    const router = useRouter();

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

    return (
        <View style={styles.mainContainer}>
            <ScrollView style={styles.scroll}>
                <Text style={styles.title}>Create New Account</Text>
                {/* Fullname */}
                <View style={styles.contianericon}>
                    <FontAwesome
                        name={'user'}
                        size={24}
                        color={'#9A9A9A'}
                        style={styles.inputIcon}
                    />
                    <TextInput
                        onChangeText={value => handleChange(value, 'name')}
                        style={styles.textinput}
                        placeholder="Fullname"
                    />
                </View>
                {/* Email */}
                <View style={styles.contianericon}>
                    <FontAwesome
                        name={'envelope'}
                        size={24}
                        color={'#9A9A9A'}
                        style={styles.inputIcon}
                    />
                    <TextInput
                        onChangeText={value => handleChange(value, 'email')}
                        style={styles.textinput}
                        placeholder="Email"
                    />
                </View>
                {/* Phone */}
                <View style={styles.contianericon}>
                    <FontAwesome
                        name={'phone'}
                        size={24}
                        color={'#9A9A9A'}
                        style={styles.inputIcon}
                    />
                    <TextInput
                        onChangeText={value =>
                            handleChange(value, 'phoneNumber')
                        }
                        style={styles.textinput}
                        placeholder="Phone"
                    />
                </View>
                {/* Faculty Dropdown */}
                <View style={styles.contianericon}>
                    <FontAwesome
                        name={'university'}
                        size={24}
                        color={'#9A9A9A'}
                        style={styles.inputIcon}
                    />
                    <TouchableOpacity
                        style={styles.dropdownButton}
                        onPress={() => setFacultyModalVisible(true)}
                    >
                        <Text style={styles.dropdownText}>
                            {selectedFaculty || 'Select Faculty'}
                        </Text>
                    </TouchableOpacity>
                </View>
                <Modal
                    visible={facultyModalVisible}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setFacultyModalVisible(false)}
                >
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        activeOpacity={1}
                        onPressOut={() => setFacultyModalVisible(false)}
                    >
                        <View style={styles.modalContent}>
                            <FlatList
                                data={faculties}
                                keyExtractor={item => item}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.option}
                                        onPress={() =>
                                            handleSelectFaculty(item)
                                        }
                                    >
                                        <Text style={styles.optionText}>
                                            {item}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </TouchableOpacity>
                </Modal>
                {/* State Dropdown */}
                <View style={styles.contianericon}>
                    <FontAwesome
                        name={'user-circle'}
                        size={24}
                        color={'#9A9A9A'}
                        style={styles.inputIcon}
                    />
                    <TouchableOpacity
                        style={styles.dropdownButton}
                        onPress={() => setStateModalVisible(true)}
                    >
                        <Text style={styles.dropdownText}>
                            {selectedState || 'Select State'}
                        </Text>
                    </TouchableOpacity>
                </View>
                <Modal
                    visible={stateModalVisible}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setStateModalVisible(false)}
                >
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        activeOpacity={1}
                        onPressOut={() => setStateModalVisible(false)}
                    >
                        <View style={styles.modalContent}>
                            <FlatList
                                data={states}
                                keyExtractor={item => item}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.option}
                                        onPress={() => handleSelectState(item)}
                                    >
                                        <Text style={styles.optionText}>
                                            {item}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </TouchableOpacity>
                </Modal>
                {/* Password */}
                <View style={styles.contianericon}>
                    <FontAwesome
                        name={'lock'}
                        size={24}
                        color={'#9A9A9A'}
                        style={styles.inputIcon}
                    />
                    <TextInput
                        onChangeText={value => handleChange(value, 'password')}
                        style={styles.textinput}
                        placeholder="Password"
                        secureTextEntry={true}
                    />
                </View>
                {/* SignUp Button */}
                <TouchableOpacity
                    onPress={handleSubmit}
                    style={styles.signupButton}
                >
                    <Text style={styles.signupText}>Sign Up</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 20,
        padding: 15,
        alignItems: 'center'
    },
    scroll: {
        width: '100%'
    },
    title: {
        fontSize: 30,
        fontFamily: 'outfit-bold',
        marginBottom: 20
    },
    contianericon: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        borderRadius: 20,
        elevation: 10,
        marginVertical: 10,
        alignItems: 'center',
        paddingHorizontal: 15,
        height: 50,
        width: '100%'
    },
    inputIcon: {
        marginRight: 10
    },
    textinput: {
        flex: 1
    },
    dropdownButton: {
        flex: 1,
        padding: 10
    },
    dropdownText: {
        fontSize: 16,
        color: '#333'
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)'
    },
    modalContent: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        elevation: 5
    },
    option: {
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    optionText: {
        fontSize: 15
    },
    signupButton: {
        padding: 15,
        backgroundColor: 'red',
        width: '100%',
        marginTop: 15,
        borderRadius: 15
    },
    signupText: {
        fontFamily: 'outfit',
        fontSize: 20,
        color: 'white',
        textAlign: 'center'
    }
});
