import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    Image
} from 'react-native';

import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../utils/firebase/config';
import { useRouter } from 'expo-router';
import { addToCart } from '../../../utils/addToCart';

const Restaurants = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [selectedTag, setSelectedTag] = useState(null);
    const [selectedRating, setSelectedRating] = useState(null);
    const [showRatingOptions, setShowRatingOptions] = useState(false);
    const [ratingButtonPosition, setRatingButtonPosition] = useState({ x: 0, y: 0 });

    const ratingButtonRef = useRef();
    const router = useRouter();

    const getRestaurants = async () => {
        try {
            const resSnapshot = await getDocs(collection(db, "restaurants"));
            const data = resSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setRestaurants(data);
            setFilteredData(data);
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    };

    useEffect(() => {
        getRestaurants();
    }, []);

    useEffect(() => {
        let filtered = [...restaurants];

        if (searchText) {
            filtered = filtered.filter(item =>
               item.name.toLowerCase().startsWith(searchText.toLowerCase())
            );
        }

        if (selectedTag) {
            filtered = filtered.filter(item =>
                item.tags.includes(selectedTag)
            );
        }

        if (selectedRating) {
            filtered = filtered.filter(item =>
                parseFloat(item.rating) >= selectedRating
            );
        }

        setFilteredData(filtered);
    }, [searchText, selectedTag, selectedRating, restaurants]);

    return (
        <View style={styles.container}>
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
                <TouchableOpacity style={styles.filterButton} onPress={() => setSelectedTag('food')}>
                    <Text style={styles.filterText}>Food</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterButton} onPress={() => setSelectedTag('drinks')}>
                    <Text style={styles.filterText}>Drinks</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    ref={ratingButtonRef}
                    style={styles.filterButton}
                    onPress={() => {
                        ratingButtonRef.current.measure((fx, fy, width, height, px, py) => {
                            setRatingButtonPosition({ x: px, y: py + height });
                            setShowRatingOptions(!showRatingOptions);
                        });
                    }}
                >
                    <Text style={styles.filterText}>Rating</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterButton} onPress={() => {
                    setSelectedTag(null);
                    setSelectedRating(null);
                    setSearchText('');
                }}>
                    <Text style={styles.filterText}>Reset</Text>
                </TouchableOpacity>
            </View>

            {showRatingOptions && (
                <View style={[styles.ratingOptions, { top: ratingButtonPosition.y, left: ratingButtonPosition.x }]}>
                    {[5, 4.5, 4, 3.5, 3].map(rating => (
                        <TouchableOpacity
                            key={rating}
                            onPress={() => {
                                setSelectedRating(rating);
                                setShowRatingOptions(false);
                            }}
                        >
                            <Text style={{ padding: 8, fontSize: 16 }}>{rating} ★</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            <FlatList
                data={filteredData}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Image
                            source={{ uri: item.image }}
                            style={styles.cardImage}
                            resizeMode="cover"
                        />
                        <View style={styles.cardContent}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardTitle}>{item.name}</Text>
                                <Text style={styles.cardRating}>{item.rating} ★</Text>
                            </View>
                            <Text style={styles.cardDescription}>{item.description}</Text>
                            <View style={styles.tagsContainer}>
                                {item.tags.map((tag, index) => (
                                    <View key={index} style={styles.tag}>
                                        <Text style={styles.tagText}>{tag}</Text>
                                    </View>
                                ))}
                            </View>
                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={() => addToCart(item)}
                            >
                                <Text style={styles.addButtonText}>Add to Cart</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 16 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
    },
    welcomeText: { fontSize: 18, color: '#333' },
    appName: { fontSize: 20, fontWeight: 'bold', color: '#CC4C4C' },
    searchContainer: { marginBottom: 16 },
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
    filterText: { color: '#CC4C4C', fontSize: 14 },
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
        shadowRadius: 4,
    },
    listContent: { paddingBottom: 20 },
    card: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 12,
    },
    cardContent: {
        flex: 1,
        justifyContent: 'center',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8
    },
    cardTitle: { fontSize: 16, fontWeight: 'bold' },
    cardRating: { fontSize: 16, color: '#FFA500' },
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
        color: 'black'
    },
    addButton: {
        backgroundColor: '#FF6969',
        paddingVertical: 6,
        borderRadius: 6,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default Restaurants;
