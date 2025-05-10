// HomeScreen.jsx
import React, { useEffect, useState } from 'react';
import {
    ImageBackground,
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert
} from 'react-native';
import { handleLogout } from '../../../utils/backend helpers/authCalls';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { db } from '../../../utils/firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { useCart } from '../../context/cartcontext'; // Ensure the path to CartContext is correct
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
    const router = useRouter();
    const [topRestaurants, setTopRestaurants] = useState([]);
    const [topOffers, setTopOffers] = useState([]);
    const { cartItems, addToCart, removeFromCart } = useCart(); // Access cartItems and cart methods

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetching data from Firestore
                const restaurantsSnap = await getDocs(
                    collection(db, 'restaurants')
                );
                const offersSnap = await getDocs(collection(db, 'offers'));

                // Mapping the fetched data to an array of objects
                const restaurantsData = restaurantsSnap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                const offersData = offersSnap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                // Setting the state with the fetched data
                setTopRestaurants(restaurantsData);
                setTopOffers(offersData);
            } catch (error) {
                console.error('Error fetching data: ', error);
                Alert.alert('Error', 'Failed to fetch data');
            }
        }

        fetchData();
    }, []);

    // Function for logout
    async function signout() {
        try {
            const res = await handleLogout(); // Ensure handleLogout works correctly
            if (res) {
                router.replace('/onBoarding');
            }
        } catch (error) {
            console.error('Logout error: ', error);
            Alert.alert('Error', 'Failed to log out');
        }
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcomeText}>Welcome, User</Text>
                <TouchableOpacity onPress={signout}>
                    <Text style={styles.appName}>Log out</Text>
                </TouchableOpacity>
            </View>

            <LinearGradient
                colors={['#FFA0A0', '#CC4C4C']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroSection}
            >
                <View style={styles.heroContent}>
                    <Text style={styles.heroTitle}>Welcome to Toomiia!</Text>
                    <Text style={styles.heroSubtitle}>
                        Let's make food on campus easier than ever. Start
                        ordering now!
                    </Text>
                    <View style={styles.exploreButtonContainer}>
                        <TouchableOpacity
                            style={styles.exploreButton}
                            onPress={() => router.push('/Restaurants')}
                        >
                            <Text style={styles.exploreButtonText}>
                                Explore Restaurants →
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </LinearGradient>

            {/* Top Restaurants Section */}
            <View style={styles.section}>
                <LinearGradient
                    colors={['#FF6969', '#FFCB2D']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.sectionHeader}
                >
                    <Text style={styles.sectionHeaderText}>
                        Top Restaurants
                    </Text>
                    <TouchableOpacity
                        onPress={() => router.push('/Restaurants')}
                    >
                        <Text style={styles.viewMoreText}>View More →</Text>
                    </TouchableOpacity>
                </LinearGradient>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.horizontalScroll}
                >
                    {topRestaurants.slice(0, 3).map(item => (
                        <View key={item.id} style={styles.itemCard}>
                            <Image
                                source={{ uri: item.image }}
                                style={styles.itemImage}
                                resizeMode="cover"
                            />
                            <Text style={styles.itemName}>{item.name}</Text>
                        </View>
                    ))}

                </ScrollView>
            </View>

            {/* Top Offers Section */}
            <View style={styles.section}>
                <LinearGradient
                    colors={['#FF6969', '#FFCB2D']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.sectionHeader}
                >
                    <Text style={styles.sectionHeaderText}>Top Offers</Text>
                    <TouchableOpacity onPress={() => router.push('/Offers')}>
                        <Text style={styles.viewMoreText}>View More →</Text>
                    </TouchableOpacity>
                </LinearGradient>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.horizontalScroll}
                >
                    {topOffers.slice(0, 3).map(item => (
                        <View key={item.id} style={styles.itemCard}>
                            <Image
                                source={{ uri: item.image }}
                                style={styles.itemImage}
                                resizeMode="cover"
                            />
                            <View style={styles.offerBadge}>
                                <Text style={styles.offerText}>
                                    {item.name}
                                </Text>
                            </View>
                            <Text style={styles.itemOffer}>{item.offer}</Text>
                        </View>
                    ))}

                </ScrollView>
            </View>

            {/* Advertisement Section */}
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

            {/* Footer */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.knowMoreButton}
                    onPress={() => router.push('/About')}
                >
                    <Text style={styles.knowMoreText}>Know more about us</Text>
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
    bgImageContainer: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        opacity: 0.15
    },
    bgImage: {
        width: '60%'
    },
    heroContent: {
        padding: 16,
        gap: 8
    },
    heroTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: 'white'
    },
    heroSubtitle: {
        fontSize: 16,
        color: 'white'
    },
    exploreButtonContainer: {
        marginTop: 16,
        alignItems: 'flex-end'
    },
    exploreButton: {
        backgroundColor: '#FF6969',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20
    },
    exploreButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'white'
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
        backgroundColor: '#FF6969',
        padding: 10,
        borderRadius: 10
    },
    sectionHeaderText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff'
    },
    viewMoreText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#fff'
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
        fontSize: 12,
        fontWeight: 'bold',
        color: '#fff'
    },
    adSection: {
        marginVertical: 16,
        padding: 16,
        backgroundColor: '#f8f8f8',
        borderRadius: 8
    },
    adImage: {
        width: '100%',
        height: 200,
        borderRadius: 8
    },
    adText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 8,
        textAlign: 'center',
        color: '#333'
    },
    footer: {
        marginTop: 16,
        alignItems: 'center'
    },
    knowMoreButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderWidth: 1,
        borderColor: '#FF6B6B',
        backgroundColor: '#FF6969',
        borderRadius: 24,
        marginBottom: 80
    },
    knowMoreText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff'
    }
});

export default HomeScreen;
