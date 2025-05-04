import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
    Pressable
} from 'react-native';
import React, { useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'; // استيراد Firebase Authentication

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    // دالة تسجيل الدخول
    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Missing Information", "Please fill out both fields.");
            return;
        }

        setLoading(true);
        const auth = getAuth();
        
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('User signed in:', user);
            // عند نجاح الدخول، يمكنك توجيه المستخدم إلى الصفحة الرئيسية أو أي صفحة أخرى
            router.push('/home'); // مثال: الانتقال إلى الصفحة الرئيسية
        } catch (error) {
            Alert.alert("Login Failed", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View
            style={{
                display: 'flex',
                flex: 1,
                backgroundColor: '#f0f0f0',  // Use a valid color
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
                    Enter your Account
                </Text>

                <View style={styles.contianericon}>
                    <FontAwesome
                        name={'envelope'}
                        size={24}
                        color={'#9A9A9A'}
                        style={styles.inputIcon}
                    />
                    <TextInput
                        style={styles.textinput}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                    />
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
                        placeholder="Password"
                        secureTextEntry={true}  // تأكد من ضبطه على true
                        value={password}
                        onChangeText={setPassword}
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
                    onPress={handleLogin}  // تنفيذ الدالة عند الضغط
                    disabled={loading} // Disable the button while loading
                >
                    <Text
                        style={{
                            fontFamily: 'outfit',
                            fontSize: 20,
                            color: 'white',
                            textAlign: 'center'
                        }}
                    >
                        {loading ? 'Logging in...' : 'Login'}
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
                            Don't have an account? Sign Up
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
