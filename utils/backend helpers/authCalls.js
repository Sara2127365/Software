import Toast from 'react-native-toast-message';
import { getUserData, signUp } from '../firebase/auth';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function createServiceAccount(formData) {
    try {
        const result = await signUp({
            ...formData,
            table: 'service-users',
            is_service : true
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
export async function createUserAccount(formData) {
    try {
        const result = await signUp({
            ...formData,
            table: 'users'
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

export const handleLogin = async obj => {
    console.log(obj);

    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            obj.email,
            obj.password
        );
        const user = userCredential.user;
        const userData = await getUserData(user.uid);

        AsyncStorage.setItem('uid',user.uid)
        console.log('userData' , userData);
        

        Toast.show({
            type: 'success',
            text1: 'Welcome Back !',
            text2: 'Logged In successfully',
            position: 'top'
        });
        return userData || true
    } catch (error) {
        Toast.show({
            type: 'error',
            text1: error.message,
            position: 'top'
        });
    }
};

export const handleLogout = async () => {
    console.log('LOGGING OUT');
    try {
        await signOut(auth);
        AsyncStorage.removeItem('status');
        AsyncStorage.removeItem('uid');
        console.log('DONEEEEEEEEEEEE');
        return true;
    } catch (error) {
        console.log(error);

        Toast.show({
            type: 'success',
            text1: 'Logged out successfully!',
            position: 'top'
        });
    }
};
