import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import {
    ImageBackground,
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image
} from 'react-native';
import bgImg from '../../../assets/images/foodImg.png';
import { handleLogout } from '../../../utils/backend helpers/authCalls';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { db } from '../../../utils/firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { useState } from 'react';


const HomeScreen = () => {
    const router = useRouter();
    const [topRestaurants, setTopRestaurants] = useState([]);
    const [topOffers, setTopOffers] = useState([]);


    useEffect(() => {
        async function fetchData() {
            try {
                const restaurantsSnap = await getDocs(collection(db, 'restaurants'));
                const offersSnap = await getDocs(collection(db, 'offers'));

                const restaurantsData = restaurantsSnap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                const offersData = offersSnap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setTopRestaurants(restaurantsData);
                setTopOffers(offersData);
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        }

        fetchData();
    }, []);

    async function signout() {
        const res = await handleLogout();
        if (res) {
            router.replace('/onBoarding');
        }
    }

    return (
        <ScrollView className="font-montserrat-r" style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcomeText}>Welcome, User</Text>
                <TouchableOpacity onPress={signout}>
                    <Text style={styles.appName}>log out</Text>
                </TouchableOpacity>
            </View>

            <LinearGradient
                colors={['#FFA0A0', '#CC4C4C']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="relative "
                style={styles.heroSection}
            >
                <View className="w-full h-full flex items-center overflow-hidden justify-end flex-row left-0 top-0 opacity-15 absolute">
                    <Image
                        source={bgImg}
                        resizeMode="contain"
                        className="w-60"
                    />
                </View>

                <View className="p-5 gap-8 font-montserrat-r text-white">
                    <Text className="text-white font-montserrat-sb text-2xl">
                        Welcome to Toomiia!
                    </Text>
                    <Text className="text-white text-lg font-montserrat-r">
                        Let's make food on campus easier than ever. Start
                        ordering now!
                    </Text>
                    <View className="flex flex-row justify-end">
                        <TouchableOpacity
                            style={styles.exploreButton}
                            onPress={() => router.push('/Restaurants')}
                        >
                            <Text className="!font-montserrat-sb text-white">
                                explore restaurants →
                            </Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </LinearGradient>

            <View style={styles.section}>
                <LinearGradient
                    colors={['#FF6969', '#FFCB2D']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.sectionHeader}
                >
                    <Text className="text-lg font-montserrat-sb">
                        Top restaurants
                    </Text>
                    <TouchableOpacity onPress={() => router.push('/Restaurants')}>
                        <Text className="text-sm font-montserrat-sb">
                            view more →
                        </Text>
                    </TouchableOpacity>

                </LinearGradient>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.horizontalScroll}
                >
                    {topRestaurants.slice(0, 3).map(item => {
                        return (
                            <TouchableOpacity
                                className="shadow border border-gray-100 p-2"
                                key={item.id}
                                style={styles.itemCard}
                            >
                                <Image
                                    className="rounded-lg"
                                    source={{ uri: item.image }}
                                    style={styles.itemImage}
                                    resizeMode="cover"
                                />
                                <Text style={styles.itemName}>{item.name}</Text>
                            </TouchableOpacity>
                        );
                    })}

                </ScrollView>
            </View>

            <View style={styles.section}>
                <LinearGradient
                    colors={['#FF6969', '#FFCB2D']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.sectionHeader}
                >
                    <Text className="text-lg font-montserrat-sb">
                        Top offers
                    </Text>
                    <TouchableOpacity onPress={() => router.push('/Offers')}>
                        <Text className="text-sm font-montserrat-sb">
                            view more →
                        </Text>
                    </TouchableOpacity>

                </LinearGradient>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.horizontalScroll}
                >
                    {topOffers.slice(0, 3).map(item => {
                        return (
                            <TouchableOpacity
                                className="shadow border border-gray-100 p-2"
                                key={item.id}
                                style={styles.itemCard}
                            >
                                <Image
                                    className="rounded-lg"
                                    source={{ uri: item.image }}
                                    style={styles.itemImage}
                                    resizeMode="cover"
                                />
                                <View style={styles.offerBadge}>
                                    <Text style={styles.offerText}>{item.name}</Text>
                                </View>
                                <Text style={styles.itemOffer}>{item.offer}</Text>
                            </TouchableOpacity>
                        );
                    })}

                </ScrollView>
            </View>

            <View style={styles.adSection}>
                <Image
                    source={{
                        uri: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop'
                    }}
                    style={styles.adImage}
                    resizeMode="cover"
                />
                <Text style={styles.adText}>Special Student Discounts</Text>
            </View>



            <View style={styles.footer}>
                <TouchableOpacity style={styles.knowMoreButton} onPress={() => router.push('/About')}>
                    <Text style={styles.knowMoreText}>know more about us</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    header: {
        padding: 16,
        paddingTop: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    welcomeText: {
        fontSize: 18,
        color: '#333'
    },
    appName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#CC4C4C'
    },
    heroSection: {
        backgroundColor: '#CC4C4C',
        margin: 16,
        borderRadius: 20
    },
    heroTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#CC4C4C'
    },
    heroText: {
        fontSize: 16,
        marginBottom: 16,
        color: 'white',
        fontWeight: 'bold'
    },
    image: {
        flex: 1,
        justifyContent: 'flex-end',
        height: '100%',
        width: '100%',
        borderRadius: 10
    },
    exploreButton: {
        alignSelf: 'flex-start'
    },
    exploreButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold'
    },
    section: {
        marginVertical: 16,
        paddingHorizontal: 16
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        backgroundColor: '#CC4C4C',
        padding: 10,
        borderRadius: 10
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    viewMore: {
        color: 'white',
        fontSize: 14
    },
    horizontalScroll: {
        paddingVertical: 8
    },
    itemCard: {
        width: 160,
        marginRight: 12,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#ffffff'
    },
    itemImage: {
        width: '100%',
        height: 120
    },
    itemName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        padding: 8,
        textAlign: 'center'
    },
    itemOffer: {
        fontSize: 12,
        color: '#666',
        paddingBottom: 8,
        textAlign: 'center'
    },
    offerBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#CC4C4C',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 12
    },
    offerText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold'
    },
    adSection: {
        height: 160,
        margin: 16,
        borderRadius: 8,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center'
    },
    adImage: {
        width: '100%',
        height: '100%',
        position: 'absolute'
    },
    adText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 8,
        borderRadius: 8
    },
    footer: {
        padding: 16,
        alignItems: 'center'
    },
    knowMoreButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderWidth: 1,
        borderColor: '#FF6B6B',
        borderRadius: 24,
        marginBottom: 80
    },
    knowMoreText: {
        color: '#FF6B6B',
        fontSize: 16
    }
});

export default HomeScreen;











