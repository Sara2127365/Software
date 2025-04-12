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
import img from '../../../assets/images/res.jpg';
import bgImg from '../../../assets/images/foodImg.png';
import { handleLogout } from '../../../utils/backend helpers/authCalls';
import { useRouter } from 'expo-router';
const HomeScreen = () => {
    const router = useRouter();
    const topRestaurants = [
        {
            id: '1',
            name: 'Burger Palace',
            image: img
        },
        {
            id: '2',
            name: 'Pizza Heaven',
            image: img
        },
        {
            id: '3',
            name: 'Sushi World',
            image: img
        }
    ];

    const topOffers = [
        {
            id: '1',
            name: '50% Off',
            image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop',
            offer: 'On all burgers'
        },
        {
            id: '2',
            name: 'Buy 1 Get 1',
            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop',
            offer: 'Free pizza'
        },
        {
            id: '3',
            name: 'Free Drink',
            image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop',
            offer: 'With any meal'
        }
    ];

    // JUST FOR TESTING
    useEffect(() => {
        async function fn() {
            await AsyncStorage.removeItem('onboardingCompleted');
            console.log('DELETED');
        }
        fn();
    }, []);

    async function signout() {
        const res = await handleLogout();
        if (res) {
            router.replace('/onBoarding');
        }
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcomeText}>Welcome, User</Text>
                <TouchableOpacity onPress={signout}>
                    <Text style={styles.appName}>log out</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.heroSection}>
                <ImageBackground
                    source={bgImg}
                    resizeMode="cover"
                    style={styles.image}
                >
                    <Text style={styles.heroTitle}>Welcome to Toomila!</Text>
                    <Text style={styles.heroText}>
                        Let's make food on campus easier than ever. Start
                        ordering now!
                    </Text>
                    <TouchableOpacity style={styles.exploreButton}>
                        <Text style={styles.exploreButtonText}>
                            explore restaurants →
                        </Text>
                    </TouchableOpacity>
                </ImageBackground>
            </View>

            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Top Restaurants</Text>
                    <TouchableOpacity>
                        <Text style={styles.viewMore}>view more →</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.horizontalScroll}
                >
                    {topRestaurants.map(item => (
                        <TouchableOpacity key={item.id} style={styles.itemCard}>
                            <Image
                                source={item.image}
                                style={styles.itemImage}
                                resizeMode="cover"
                            />
                            <Text style={styles.itemName}>{item.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Top Offers</Text>
                    <TouchableOpacity>
                        <Text style={styles.viewMore}>view more →</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.horizontalScroll}
                >
                    {topOffers.map(item => (
                        <TouchableOpacity key={item.id} style={styles.itemCard}>
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
                        </TouchableOpacity>
                    ))}
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
                <TouchableOpacity style={styles.knowMoreButton}>
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
        padding: 16,
        backgroundColor: '#CC4C4C',
        margin: 16,
        borderRadius: 8
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
        borderRadius: 5
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        backgroundColor: '#CC4C4C'
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
        backgroundColor: '#f5f5f5'
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
        borderRadius: 24
    },
    knowMoreText: {
        color: '#FF6B6B',
        fontSize: 16
    }
});

export default HomeScreen;
