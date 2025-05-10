import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    Image,
    ActivityIndicator // Loading spinner
} from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db, storage } from '../../../utils/firebase/config';
import { useRouter } from 'expo-router';
import { getDownloadURL, ref } from 'firebase/storage';

const Restaurants = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [selectedTag, setSelectedTag] = useState(null);
    const [selectedRating, setSelectedRating] = useState(null);
    const [showRatingOptions, setShowRatingOptions] = useState(false);
    const [ratingButtonPosition, setRatingButtonPosition] = useState({
        x: 0,
        y: 0
    });
    const [loading, setLoading] = useState(true); // Add loading state
    const [error, setError] = useState(null); // Add error state

    const ratingButtonRef = useRef();
    const router = useRouter();


    const getServiceUsers = async () => {
        try {
            setLoading(true);
            const resSnapshot = await getDocs(collection(db, 'service-users'));
            const data = await Promise.all(
                resSnapshot.docs.map(async doc => {
                    const docId = doc.id;
                    console.log('docId' , docId);
                    
                    const docData = doc.data();

                    let logoURL = '';
                    let coverURL = '';

                    try {
                        logoURL = await getDownloadURL(
                            ref(storage, `services/logos/${docId}`)
                        );
                    } catch (error) {
                        console.warn(`No logo found for ${docId}`, error);
                    }

                    // try {
                    //     coverURL = await getDownloadURL(
                    //         ref(storage, `services/covers/${docId}`)
                    //     );
                    // } catch (error) {
                    //     console.warn(`No cover found for ${docId}`, error);
                    // }

                    return {
                        id: docId,
                        ...docData,
                        logoURL,
                        coverURL
                    };
                })
            );

            setRestaurants(data);
            setFilteredData(data);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            setError('Error fetching data. Please try again later.');
            console.error('Error fetching data:', err);
        }
    };

    useEffect(() => {
        getServiceUsers();
    }, []);

    console.log('restaurants' , restaurants[11]);
    

    useEffect(() => {
        let filtered = [...restaurants];

        if (searchText) {
            filtered = filtered.filter(item =>
                item.serviceName
                    ?.toLowerCase()
                    .includes(searchText.toLowerCase())
            );
        }

        if (selectedTag) {
            filtered = filtered.filter(
                item =>
                    Array.isArray(item.categories) &&
                    item.categories.some(tag =>
                        typeof tag === 'string'
                            ? tag.toLowerCase() === selectedTag.toLowerCase()
                            : tag.label?.toLowerCase() ===
                              selectedTag.toLowerCase()
                    )
            );
        }

        if (selectedRating) {
            filtered = filtered.filter(
                item => item.rating && parseFloat(item.rating) >= selectedRating
            );
        }

        setFilteredData(filtered);
    }, [searchText, selectedTag, selectedRating, restaurants]);

    return (
        <View className="mb-10" style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcomeText}>Welcome, User</Text>
                <Text style={styles.appName}>Toomiia</Text>
            </View>

            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search ..."
                    placeholderTextColor="#999"
                    value={searchText}
                    onChangeText={setSearchText}
                />
            </View>

            <View style={styles.filterContainer}>
                <TouchableOpacity
                    style={[
                        styles.filterButton,
                        selectedTag === 'food' && styles.activeFilterButton
                    ]}
                    onPress={() => setSelectedTag('food')}
                >
                    <Text
                        style={[
                            styles.filterText,
                            selectedTag === 'food' && styles.activeFilterText
                        ]}
                    >
                        Food
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.filterButton,
                        selectedTag === 'drinks' && styles.activeFilterButton
                    ]}
                    onPress={() => setSelectedTag('drinks')}
                >
                    <Text
                        style={[
                            styles.filterText,
                            selectedTag === 'drinks' && styles.activeFilterText
                        ]}
                    >
                        Drinks
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    ref={ratingButtonRef}
                    style={styles.filterButton}
                    onPress={() => {
                        ratingButtonRef.current.measure(
                            (fx, fy, width, height, px, py) => {
                                setRatingButtonPosition({
                                    x: px,
                                    y: py + height
                                });
                                setShowRatingOptions(!showRatingOptions);
                            }
                        );
                    }}
                >
                    <Text style={styles.filterText}>Rating</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.filterButton}
                    onPress={() => {
                        setSelectedTag(null);
                        setSelectedRating(null);
                        setSearchText('');
                    }}
                >
                    <Text style={styles.filterText}>Reset</Text>
                </TouchableOpacity>
            </View>

            {showRatingOptions && (
                <View
                    style={[
                        styles.ratingOptions,
                        {
                            top: ratingButtonPosition.y,
                            left: ratingButtonPosition.x
                        }
                    ]}
                >
                    {[5, 4.5, 4, 3.5, 3].map(rating => (
                        <TouchableOpacity
                            key={rating}
                            onPress={() => {
                                setSelectedRating(rating);
                                setShowRatingOptions(false);
                            }}
                        >
                            <Text style={{ padding: 8, fontSize: 16 }}>
                                {rating} ★
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#CC4C4C" />
                    <Text>Loading restaurants...</Text>
                </View>
            ) : error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredData}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() =>
                                router.push(`/restaurant/${item.id}`)
                            }
                        >
                            <Image
                                source={{ uri: item.logoURL }}
                                style={styles.cardImage}
                                resizeMode="cover"
                            />
                            <View style={styles.cardContent}>
                                <View style={styles.cardHeader}>
                                    <Text style={styles.cardTitle}>
                                        {item.serviceName}
                                    </Text>
                                    <Text style={styles.cardRating}>
                                        {item.rating ? `${item.rating} ★` : '—'}
                                    </Text>
                                </View>
                                <Text style={styles.cardDescription}>
                                    {item.info}
                                </Text>
                                <View style={styles.tagsContainer}>
                                    {Array.isArray(item.categories) &&
                                        item.categories.map((tag, index) => (
                                            <View
                                                key={index}
                                                style={styles.tag}
                                            >
                                                <Text style={styles.tagText}>
                                                    {typeof tag === 'object'
                                                        ? tag.label
                                                        : String(tag)}
                                                </Text>
                                            </View>
                                        ))}
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={{ alignItems: 'center', marginTop: 40 }}>
                            <Text style={{ fontSize: 16, color: '#000' }}>
                                No matching results found
                            </Text>
                        </View>
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
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
    searchContainer: {
        marginBottom: 16
    },
    searchInput: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16
    },
    filterContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        flexWrap: 'wrap'
    },
    filterButton: {
        marginRight: 12,
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: '#f0f0f0',
        borderRadius: 16,
        marginBottom: 8
    },
    filterText: {
        color: '#CC4C4C',
        fontSize: 14
    },
    ratingOptions: {
        position: 'absolute',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 8,
        elevation: 5,
        zIndex: 999,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4
    },
    listContent: {
        paddingBottom: 20
    },
    card: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center'
    },
    cardImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 12
    },
    cardContent: {
        flex: 1,
        justifyContent: 'center'
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    cardRating: {
        fontSize: 16,
        color: '#FFA500'
    },
    cardDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    tag: {
        backgroundColor: '#FF6969',
        borderRadius: 12,
        paddingVertical: 4,
        paddingHorizontal: 10,
        marginRight: 8,
        marginBottom: 8
    },
    tagText: {
        fontSize: 12,
        color: '#fff'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    errorText: {
        color: '#FF0000',
        fontSize: 16
    }
});

export default Restaurants;
