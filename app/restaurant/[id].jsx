import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../utils/firebase/config';

const RestaurantDetails = () => {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const [restaurant, setRestaurant] = useState(null);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState(['top selling']);
    const [selectedCategory, setSelectedCategory] = useState('top selling');
    const [flippedProducts, setFlippedProducts] = useState({});
    const [productQuantities, setProductQuantities] = useState({});
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const docRef = doc(db, 'restaurants', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const restaurantData = docSnap.data();
                    setRestaurant(restaurantData);

                    const tags = Array.isArray(restaurantData.tags) ? restaurantData.tags : [];
                    setCategories(['top selling', ...tags]);
                }
            } catch (error) {
                console.error('Error fetching restaurant:', error);
            }
        };

        const fetchProducts = async () => {
            try {
                const q = query(collection(db, 'products'), where('restaurantId', '==', Number(id)));
                const querySnapshot = await getDocs(q);
                const fetchedProducts = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setProducts(fetchedProducts);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        if (id) {
            fetchData();
            fetchProducts();
        }
    }, [id]);

    useEffect(() => {
        const total = Object.values(productQuantities).reduce((sum, qty) => sum + qty, 0);
        setTotalItems(total);
    }, [productQuantities]);


    if (!restaurant) return <Text style={{ padding: 20 }}>Loading...</Text>;

    const toggleFlip = (productId) => {
        setFlippedProducts((prev) => ({
            ...prev,
            [productId]: !prev[productId]
        }));
    };

    const incrementQuantity = (productId) => {
        setProductQuantities((prev) => ({
            ...prev,
            [productId]: (prev[productId] || 0) + 1
        }));
    };

    const decrementQuantity = (productId) => {
        setProductQuantities((prev) => {
            const current = prev[productId] || 0;
            return {
                ...prev,
                [productId]: current > 0 ? current - 1 : 0
            };
        });
    };

    const filteredProducts =
        selectedCategory === 'top selling'
            ? products
            : products.filter(
                (prod) => prod.category?.toLowerCase() === selectedCategory.toLowerCase()
            );

    return (
        <ScrollView style={styles.container}>
            {/* Header with welcome & cart */}
            <View style={styles.topBar}>
                <Text style={styles.welcomeText}>Welcome , User</Text>
                <TouchableOpacity style={styles.cartIconContainer} onPress={() => router.push('(tabs)/Cart')}>
                    <Text style={styles.cartIcon}>🛍️</Text>
                    {totalItems > 0 && (
                        <View style={styles.cartBadge}>
                            <Text style={styles.cartBadgeText}>{totalItems}</Text>
                        </View>
                    )}
                </TouchableOpacity>




            </View>

            <View style={styles.subHeader}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backArrow}>{'←'}</Text>
                </TouchableOpacity>
                <Text style={styles.pageTitle}>{restaurant.name}</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.coverContainer}>
                <View style={styles.cover}>
                    <Image
                        source={{ uri: restaurant.image }}
                        style={styles.image}
                        resizeMode="cover"
                    />

                    <View style={styles.ratingBadge}>
                        <Text style={styles.ratingText}>{restaurant.rating} ★</Text>
                    </View>
                </View>

                <View style={styles.logoCircle}>
                    <Image
                        source={{ uri: restaurant.logoImage }}
                        style={styles.logoImage}
                        resizeMode="contain"
                    />                </View>

                <Text style={styles.restaurantName}>{restaurant.name}</Text>

            </View>


            <View style={styles.categoriesContainer}>
                {categories.map((cat) => (
                    <TouchableOpacity
                        key={cat}
                        onPress={() => setSelectedCategory(cat)}
                        style={[
                            styles.category,
                            selectedCategory === cat && styles.activeCategory
                        ]}
                    >
                        <Text style={styles.categoryText}>{cat}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <FlatList
                data={filteredProducts}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={{ paddingBottom: 60 }}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                renderItem={({ item }) => {
                    const isFlipped = flippedProducts[item.id];

                    return (
                        <View style={styles.productCard}>
                            {isFlipped ? (
                                <View style={styles.backCard}>
                                    <Text style={styles.productName}>{item.name}</Text>
                                    <View style={styles.counterContainer}>
                                        <TouchableOpacity onPress={() => decrementQuantity(item.id)}>
                                            <Text style={styles.counterBtn}>-</Text>
                                        </TouchableOpacity>

                                        <Text style={styles.counterValue}>
                                            {productQuantities[item.id] || 0}
                                        </Text>

                                        <TouchableOpacity onPress={() => incrementQuantity(item.id)}>
                                            <Text style={styles.counterBtn}>+</Text>
                                        </TouchableOpacity>

                                    </View>
                                    <TouchableOpacity onPress={() => toggleFlip(item.id)}>
                                        <Text style={styles.backArrow}>←</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <>
                                    <View style={styles.imageWrapper}>
                                        <Image
                                            source={{ uri: item.image }}
                                            style={styles.productImage}
                                            resizeMode="contain"
                                        />
                                    </View>

                                    <TouchableOpacity
                                        style={styles.redBadge}
                                        onPress={() => toggleFlip(item.id)}
                                    >
                                        <Text style={styles.badgeText}>
                                            {productQuantities[item.id] || 0}
                                        </Text>

                                    </TouchableOpacity>

                                    <Text style={styles.productName}>{item.name}</Text>
                                    <Text style={styles.productPrice}>{item.price} EGP</Text>
                                </>
                            )}
                        </View>
                    );
                }}


            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 16 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16
    },
    backArrow: { fontSize: 24, color: '#CC4C4C' },
    headerTitle: { fontSize: 16, fontWeight: '500', color: '#000' },
    coverContainer: { alignItems: 'center', marginBottom: 16 },
    cover: {
        backgroundColor: '#FF8686',
        width: '100%',
        height: 100,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    coverText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    logoCircle: {
        backgroundColor: '#fff',
        borderWidth: 4,
        borderColor: '#FF8686',
        borderRadius: 50,
        width: 80,
        height: 80,
        position: 'absolute',
        top: 70,
        left: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logoText: { fontWeight: 'bold', color: '#CC4C4C' },
    restaurantName: { fontSize: 18, marginTop: 8 },
    rating: { color: '#FFA500', fontSize: 16 },
    categoriesContainer: {
        flexDirection: 'row',
        marginVertical: 12,
        flexWrap: 'wrap'
    },
    category: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: '#eee',
        marginRight: 8,
        marginBottom: 8
    },
    activeCategory: {
        backgroundColor: '#FF8686'
    },
    categoryText: { fontSize: 14, color: '#333' },
    productCard: {
        backgroundColor: '#FFE5E5',
        borderRadius: 12,
        padding: 10,
        width: '48%',
        marginBottom: 16,
        alignItems: 'center',
        position: 'relative'
    },
    productImage: {
        width: 80,
        height: 80,
        marginBottom: 8
    },
    productName: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 4
    },
    productPrice: { fontSize: 14, color: '#000' },
    productRating: { fontSize: 12, color: '#FFA500', marginTop: 4 },
    imageWrapper: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center'
    },
    redBadge: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        backgroundColor: '#CC4C4C',
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold'
    },
    backCard: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    counterContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 6,
        marginTop: 12
    },
    counterBtn: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#CC4C4C',
        marginHorizontal: 10
    },
    counterValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        backgroundColor: '#eee',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 10
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8
    },
    welcomeText: {
        fontSize: 14,
        color: '#333'
    },
    cartIconContainer: {
        position: 'relative'
    },
    cartIcon: {
        fontSize: 20
    },
    cartBadge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#CC4C4C',
        borderRadius: 8,
        width: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cartBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold'
    },
    subHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8
    },
    pageTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000'
    },
    ratingBadge: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        backgroundColor: '#fff',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12
    },
    ratingText: {
        color: '#FFA500',
        fontWeight: 'bold'
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 12
    },
    logoImage: {
        width: 60,
        height: 60,
        borderRadius: 30
    }

});

export default RestaurantDetails;
