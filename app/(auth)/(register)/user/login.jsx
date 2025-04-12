import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity
} from 'react-native';
import React, { useState } from 'react';
import { ScrollView, Pressable } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function Login() {
    const [username, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    return (
        <View
            style={{
                display: 'flex',
                flex: 1,
                backgroundColor: ' dark white',
                paddingTop: 20,
                padding: 15,
                alignItems: 'center'
            }}
        >
            <ScrollView>
                <Text
                    style={{
                        fontSize: 30,
                        fontFamily: 'outfit-bold'
                    }}
                >
                    {' '}
                    Enter your Account
                </Text>

                <View style={styles.contianericon}>
                    <FontAwesome
                        name={'envelope'}
                        size={24}
                        color={'#9A9A9A'}
                        style={styles.inputIcon}
                    />

                    <TextInput style={styles.textinput} placeholder=" Email" />
                </View>

                <View style={styles.contianericon}>
                    <FontAwesome
                        name={'lock'}
                        size={24}
                        color={'#9A9A9A'}
                        style={styles.inputIcon}
                    />

                    <TextInput
                        style={styles.textinput}
                        placeholder=" Password"
                        secureTextEntry="hide"
                    />
                   
                </View>

                <TouchableOpacity
                    style={{
                        padding: 5,
                        backgroundColor: 'red',
                        width: '100%',
                        marginTop: 10,
                        borderRadius: 15
                    }}
                >
                    <Text
                        style={{
                            fontFamily: 'outfit',
                            fontSize: 20,
                            color: 'white',
                            textAlign: 'center'
                        }}
                    >
                        Login
                    </Text>
                </TouchableOpacity>

                <View>
                    <Pressable onPress={() => router.push('/auth/signUp')}>
                        <Text
                            style={{
                                color: 'red',
                                fontFamily: 'outfit-bold'
                            }}
                        >
                            {' '}
                            Donot have Account SignUp Here{' '}
                        </Text>
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    contianericon: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        borderRadius: 20,
        marginHorizontal: 40,
        elevation: 10,
        marginVertical: 20,
        alignItems: 'center',
        height: 50
    },
    inputIcon: {
        marginLeft: 15,
        alignItems: 'center'
    },
    textinput: {
        flex: 1
    }
});
