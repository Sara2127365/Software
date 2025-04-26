import { View, Text, SafeAreaView, FlatList, Image } from 'react-native';
import React from 'react';

import { users } from './../../users';

console.log(users);

const exam = () => {
    const renderItem = ({ item }) => (
        <View className="mb-10">
            <View className="w-20 h-20 flex items-center overflow-hidden justify-end flex-row">
                <Image
                    source={item.imageUrl}
                    resizeMode="contain"
                    className="w-60"
                />
            </View>
            <Text>{item.name}</Text>
            <Text>{item.username}</Text>
        </View>
    );

    return (
        <SafeAreaView>
            <FlatList
                className="p-4 flex flex-col gap-10"
                data={users}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={true}
            />
        </SafeAreaView>
    )
};

export default exam;
