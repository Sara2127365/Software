import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Font from 'expo-font';
import FirstScreen from '../components/onboarding/FirstScreen';
import SecondScreen from '../components/onboarding/SecondScreen';
import './globals.css'

const onBoarding = () => {
    const [step, setStep] = useState(1);

    const [fontsLoaded, setFontsLoaded] = useState(false);

    useEffect(() => {
        Font.loadAsync({
            'Montserrat-r': require('../assets/fonts/Montserrat-Medium.ttf'),
            'Montserrat-sb': require('../assets/fonts/Montserrat-SemiBold.ttf'),
            'Montserrat-b': require('../assets/fonts/Montserrat-Bold.ttf')
        }).then(() => setFontsLoaded(true));
    }, []);

    if (!fontsLoaded) return null;

    return (
        <SafeAreaView className="flex flex-col px-3 font-montserrat-r  bg-main-white h-full justify-end">
            {step === 1 && <FirstScreen setStep={setStep} />}
            {step === 2 && <SecondScreen setStep={setStep} />}
        </SafeAreaView>
    );
};

export default onBoarding;
