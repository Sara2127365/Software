import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';

const LargeBtn = ({ onPress = () => null, text = '', classes = '', textClasses = '', loading = false }) => {
    return (
        <TouchableOpacity
            onPress={loading ? null : onPress}
            className={` ${classes} rounded-lg py-4 flex items-center justify-center w-full`}
            disabled={loading}
        >
            {loading ? (
                <ActivityIndicator color="#ffffff" /> // Change color as needed
            ) : (
                <Text className={`text-center font-montserrat-sb ${textClasses}`}>
                    {text}
                </Text>
            )}
        </TouchableOpacity>
    );
};

export default LargeBtn;
