import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { handleLogout } from '../../../utils/backend helpers/authCalls';

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
    const [role, setRole] = useState(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            const storedRole = await AsyncStorage.getItem('role');
            setRole(storedRole);
            setIsReady(true);
        };

        loadData();
    }, []);

    const is_service = role === 'true';

    if (!isReady) return null;

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
                    headerShown: false,
                    title: 'Home',
                    href: is_service ? null : undefined,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            Icon={
                                <Icon
                                    name="home"
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
                    headerShown: false,
                    title: 'About',
                    href: is_service ? null : null,
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
                    headerShown: false,
                    title: 'Restaurants',
                    href: is_service ? null : undefined,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            Icon={
                                <Icon
                                    name="list"
                                    size={17}
                                    color={focused ? '#CC4C4C' : '#FF6969'}
                                />
                            }
                            title="Restaurants"
                        />
                    )
                }}
            />

            <Tabs.Screen
                name="Cart"
                options={{
                    headerShown: false,
                    title: 'Cart',
                    href: is_service ? null : undefined,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            Icon={
                                <Icon
                                    name="shopping-cart"
                                    size={17}
                                    color={focused ? '#CC4C4C' : '#FF6969'}
                                />
                            }
                            title="Cart"
                        />
                    )
                }}
            />

            <Tabs.Screen
                name="Profile"
                options={{
                    headerShown: false,
                    title: 'Profile',
                    href: is_service ? undefined : null,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            Icon={
                                <Icon
                                    name="user"
                                    size={17}
                                    color={focused ? '#CC4C4C' : '#FF6969'}
                                />
                            }
                            title="Profile"
                        />
                    )
                }}
            />

            <Tabs.Screen
                name="ProfileScreen"
                options={{
                    headerShown: false,
                    title: 'Profile',
                    href: is_service ? null : undefined,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            Icon={
                                <Icon
                                    name="user"
                                    size={17}
                                    color={focused ? '#CC4C4C' : '#FF6969'}
                                />
                            }
                            title="Profile"
                        />
                    )
                }}
            />
            <Tabs.Screen
                name="PrivacyPolicy"
                options={{
                    headerShown: false,
                    title: 'Profile',
                    href: is_service ? null : undefined,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            Icon={
                                <Icon
                                    name="home-outline"
                                    size={17}
                                    color={focused ? '#CC4C4C' : '#FF6969'}
                                />
                            }
                            title="Profile"
                        />
                    )
                }}
            />




            <Tabs.Screen
                name="Dasboard"
                options={{
                    headerShown: false,
                    title: 'Dasboard',
                    href: is_service ? undefined : null,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            Icon={
                                <Icon
                                    name="dashboard"
                                    size={17}
                                    color={focused ? '#CC4C4C' : '#FF6969'}
                                />
                            }
                            title="Dasboard"
                        />
                    )
                }}
            />
        </Tabs>
    );
};

export default _layout;

const styles = StyleSheet.create({});
