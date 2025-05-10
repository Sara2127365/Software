import { Slot, Redirect } from 'expo-router';
import Toast from 'react-native-toast-message';
import { CartProvider } from '../context/cartcontext';
import '../globals.css';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';

export default function RootLayout() {
    const [isLoading, setIsLoading] = useState(true);
    const [hasUid, setHasUid] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const uid = await AsyncStorage.getItem('uid');
            setHasUid(!!uid);
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    if (isLoading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!hasUid) {
        return <Redirect href="/LoginPage" />;
    }

    return (
        <CartProvider>
            <Slot />
            <Toast />
        </CartProvider>
    );
}
