import { View, Text } from 'react-native';
import React, { useState } from 'react';

const ProgressBar = ({ step = 1 }) => {
    return (
        <View className="flex flex-row items-center justify-center gap-1">
            <Item step={step} flag={1} />
            <Item step={step} flag={2} />
            <Item step={step} flag={3} />
        </View>
    );
};

function Item({ step, flag }) {
    return (
        <View
            className={`h-2 rounded-full  ${
                step === flag ? 'bg-main-rose w-14' : 'bg-[#EBCCCC] w-5'
            } `}
        ></View>
    );
}

export default ProgressBar;
