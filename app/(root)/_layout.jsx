import { Redirect, Slot } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AppLayout() {
    const [isLoading, setIsLoading] = useState(true);
    const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);

    useEffect(() => {
        const checkOnboardingStatus = async () => {
            try {
                const status = await AsyncStorage.getItem(
                    'status'
                );
                setIsOnboardingCompleted(status === 'true');
            } catch (err) {
                console.error('Error reading onboarding status:', err);
            } finally {
                setIsLoading(false);
            }
        };

        checkOnboardingStatus();
    }, []);

    if (isLoading) return null;

    if (!isOnboardingCompleted) {
        return <Redirect href="/onBoarding" />;
    }

    return <Slot />;
}
