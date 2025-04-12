import Toast from 'react-native-toast-message';
import { getUserData, signUp } from '../firebase/auth';
import { signInWithEmailAndPassword } from 'firebase/auth';

export async function createServiceAccount(formData) {
    try {
        const result = await signUp({
            ...formData,
            table: 'service-users'
        });
        console.log('result result result', result);
        if (result.success) {
            Toast.show({
                type: 'success',
                text1: 'Account Created !',
                text2: 'User registered successfully',
                position: 'top'
            });
        }
        return true;
    } catch (error) {
        console.log(`error error error`, error.message);
        Toast.show({
            type: 'error',
            text1: error.message,
            position: 'top'
        });
    }
}

export const handleLogin = async () => {
    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );
        const user = userCredential.user;
        await getUserData(user.uid);

        Toast.show({
            type: 'success',
            text1: 'Welcome Back !',
            text2: 'Logged In successfully',
            position: 'top'
        });
        navigation.navigate('/');
    } catch (error) {
        console.error(error);
        Toast.show({
            type: 'error',
            text1: error.message,
            position: 'top'
        });
    }
};
