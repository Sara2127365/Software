import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

const TabIcon = ({ focused, title, Icon }) => (
    <View className="flex-1 mt-3 flex flex-col items-center">
        {Icon}
        <Text
            className={`${focused ? 'text-[#CC4C4C]' : 'text-[#FF6969]'
                } text-xs w-full text-center mt-1`}
        >
            {title}
        </Text>
    </View>
);

const _layout = () => {
    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarStyle: {
                    backgroundColor: 'white',
                    position: 'absolute',
                    borderTopColor: '#0061FF1A',
                    borderTopWidth: 1,
                    minHeight: 70
                }
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            Icon={
                                <Icon
                                    name="rocket"
                                    size={17}
                                    color={focused ? '#CC4C4C' : '#FF6969'}
                                />
                            }
                            title="Home"
                        />
                    )
                }}
            />

            <Tabs.Screen
                name="About"
                options={{
                    title: 'About',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            Icon={
                                <Icon
                                    name="rocket"
                                    size={17}
                                    color={focused ? '#CC4C4C' : '#FF6969'}
                                />
                            }
                            title="About"
                        />
                    )
                }}
            />
            <Tabs.Screen
                name="Restaurants"
                options={{
                    title: 'Restaurants',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            Icon={
                                <Icon
                                    name="bars"
                                    size={17}
                                    color={focused ? '#CC4C4C' : '#FF6969'}
                                />
                            }
                            focused={focused}
                            title="Restaurants"
                        />
                    )
                }}
            />
        </Tabs>
    );
};

export default _layout;

const styles = StyleSheet.create({});
