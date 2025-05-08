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
import { TouchableWithoutFeedback, Keyboard } from 'react-native';

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
                item.name.toLowerCase().includes(searchText.toLowerCase())
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
        <TouchableWithoutFeedback
            onPress={() => {
                setShowRatingOptions(false); // نخفي القائمة
                Keyboard.dismiss(); // نغلق الكيبورد لو مفتوح
            }}
        >
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
                        style={[
                            styles.filterButton,
                            selectedRating && styles.activeFilterButton
                        ]}
                        onPress={() => {
                            ratingButtonRef.current.measure((fx, fy, width, height, px, py) => {
                                setRatingButtonPosition({ x: px, y: py + height });
                                setShowRatingOptions(!showRatingOptions);
                            });
                        }}
                    >
                        <Text
                            style={[
                                styles.filterText,
                                selectedRating && styles.activeFilterText
                            ]}
                        >
                            Rating
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            (!selectedTag && !selectedRating && searchText === '') && styles.activeFilterButton
                        ]}
                        onPress={() => {
                            setSelectedTag(null);
                            setSelectedRating(null);
                            setSearchText('');
                        }}
                    >
                        <Text
                            style={[
                                styles.filterText,
                                (!selectedTag && !selectedRating && searchText === '') && styles.activeFilterText
                            ]}
                        >
                            Reset
                        </Text>
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
                                style={[
                                    styles.ratingOption,
                                    selectedRating === rating && styles.activeRatingOption
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.ratingOptionText,
                                        selectedRating === rating && styles.activeRatingOptionText
                                    ]}
                                >
                                    {rating} ★
                                </Text>
                            </TouchableOpacity>
                        ))}

                    </View>
                )}

                <FlatList
                    data={filteredData}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.card} onPress={() => router.push(`/restaurant/${item.id}`)}>

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
            </View>
        </TouchableWithoutFeedback>
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
        shadowRadius: 4,
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
        color: 'black'
    },
    activeFilterButton: {
        backgroundColor: '#FF6666',
    },

    activeFilterText: {
        color: 'black',
    },
    ratingOption: {
        padding: 8,
        borderRadius: 8,
    },

    activeRatingOption: {
        backgroundColor: '#FF6666',
    },

    ratingOptionText: {
        fontSize: 16,
        color: '#000',
    },

    activeRatingOptionText: {
        color: '#000',
    },

});

export default Restaurants;
