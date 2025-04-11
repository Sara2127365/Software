import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import foodImg from '../../assets/images/foodImg.png';
import delivery from '../../assets/images/delivery.png';
import track from '../../assets/images/track.png';
import ProgressBar from './ProgressBar';
import Btn from '../../common/Btn';

const content = {
    1: {
        id: 1,
        img: foodImg,
        label: 'Order from Campus Restaurants',
        details: 'Browse menus from your favorite university eateries.'
    },
    2: {
        id: 2,
        img: delivery,
        label: 'Fast & Easy Delivery',
        details: 'Get your meals delivered straight to your dorm or study spot.'
    },
    3: {
        id: 3,
        img: track,
        label: 'Stay Updated',
        details:
            'Track your order in real time and enjoy exclusive student deals!'
    }
};

const SecondScreen = () => {
    const [currentScreen, setCurrentScreen] = useState(content[1]);

    function handleTravel() {
        if (currentScreen.id !== 3) {
            setCurrentScreen(
                content[
                    currentScreen.id + 1 <= 3
                        ? currentScreen.id + 1
                        : currentScreen.id
                ]
            );
        } else {
            return;
        }
    }

    function handleSkip() {
        return
    }

    return (
        <View className="h-full flex flex-col justify-between pt-10 pb-20  px-3 font-montserrat-r">
            <Text
                className="text-main-gray text-lg font-montserrat-sb"
                style={{ textAlign: 'right' }}
            >
                {currentScreen.id !== 3 ? 'Skip' : ''}
            </Text>
            <View className="flex flex-col  items-center gap-10  h-[85%] justify-between">
                <Image
                    resizeMode="contain"
                    className=" size-72 mr-2 mt-4"
                    source={currentScreen.img}
                />
                <View className="flex  flex-col gap-2">
                    <Text className="text-xl font-montserrat-sb text-center text-main-rose">
                        {currentScreen.label}
                    </Text>
                    <Text className="text-center text-main-gray text-lg mt-1 font-montserrat-r">
                        {currentScreen.details}
                    </Text>
                </View>
                <Btn
                    onPress={handleTravel}
                    text={currentScreen.id === 3 ? 'START' : 'NEXT'}
                />
                <ProgressBar step={currentScreen.id} />
            </View>
        </View>
    );
};

export default SecondScreen;
