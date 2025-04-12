import { Slot, Stack } from 'expo-router';
import './globals.css';
import Toast from 'react-native-toast-message';
export default function RootLayout() {
    return (
        <>
            <Slot />
            <Toast />
        </>
    );
}
