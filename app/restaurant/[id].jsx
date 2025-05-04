import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, collection, query, where, getDocs, setDoc } from 'firebase/firestore';
import { db, auth } from '../../utils/firebase/config'; // تأكد من استيراد auth
import FlipCard from 'react-native-flip-card';

const RestaurantDetails = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [restaurant, setRestaurant] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['top selling']);
  const [selectedCategory, setSelectedCategory] = useState('top selling');
  const [productQuantities, setProductQuantities] = useState({});
  const [totalItems, setTotalItems] = useState(0);
  const [flippedStates, setFlippedStates] = useState({});

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

  const toggleFlip = (productId) => {
    setFlippedStates((prev) => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const saveCartToFirestore = async (cartData) => {
    try {
      const userCartRef = doc(db, 'carts', auth.currentUser.uid); // تحديد المستخدم باستخدام UID
      await setDoc(userCartRef, { items: cartData });
      console.log('Cart saved to Firestore');
    } catch (error) {
      console.error('Error saving cart to Firestore:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.welcomeText}>Welcome , User</Text>
        <TouchableOpacity onPress={() => router.push('(tabs)/Cart')}>
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
          <Image source={{ uri: restaurant.image }} style={styles.image} resizeMode="cover" />
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>{restaurant.rating} ★</Text>
          </View>
        </View>
        <View style={styles.logoCircle}>
          <Image source={{ uri: restaurant.logoImage }} style={styles.logoImage} resizeMode="contain" />
        </View>
        <Text style={styles.restaurantName}>{restaurant.name}</Text>
      </View>

      <View style={styles.categoriesContainer}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setSelectedCategory(cat)}
            style={[
              styles.categoryButton,
              selectedCategory === cat && styles.selectedCategoryButton,
            ]}
          >
            <Text style={styles.categoryText}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productContainer}>
            <FlipCard
              flip={flippedStates[item.id] || false}
              friction={6}
              perspective={1000}
              onFlip={() => toggleFlip(item.id)}
            >
              {/* Front View */}
              <View style={styles.cardFront}>
                <Image source={{ uri: item.image }} style={styles.productImage} />
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>{item.price} EGP</Text>
              </View>

              {/* Back View - Controls Quantity */}
              <View style={styles.cardBack}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>{item.price} EGP</Text>
                <View style={styles.quantityControls}>
                  <TouchableOpacity onPress={() => decrementQuantity(item.id)}>
                    <Text style={styles.decrementButton}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>
                    {productQuantities[item.id] || 0}
                  </Text>
                  <TouchableOpacity onPress={() => incrementQuantity(item.id)}>
                    <Text style={styles.incrementButton}>+</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.addToCartButton}
                  onPress={() => {
                    // عند الضغط على "أضف إلى السلة"، سيتم حفظ السلة إلى Firestore
                    const cartData = products.map((prod) => ({
                      ...prod,
                      quantity: productQuantities[prod.id] || 0, // إضافة الكمية الحالية للمنتج
                    }));
                    saveCartToFirestore(cartData); // استدعاء الدالة لحفظ السلة
                  }}
                >
                  <Text style={styles.addToCartText}>AddToCart</Text>
                </TouchableOpacity>
              </View>
            </FlipCard>
          </View>
        )}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cartIcon: {
    fontSize: 30,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: 'red',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 14,
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backArrow: {
    fontSize: 24,
    marginRight: 16,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  coverContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  cover: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff',
    padding: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  logoCircle: {
    position: 'absolute',
    top: 160,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 50,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  logoImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  categoryButton: {
    marginHorizontal: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  selectedCategoryButton: {
    backgroundColor: '#ff9900',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  productContainer: {
    flex: 1,
    marginBottom: 16,
  },
  cardFront: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 250,
  },
  productImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  productPrice: {
    fontSize: 14,
    color: '#FF4B3A',
  },
  cardBack: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  decrementButton: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 8,
  },
  incrementButton: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 16,
  },
  addToCartButton: {
    backgroundColor: '#FF4B3A',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 20,
    marginTop: 16,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  row: {
    flex: 1,
    justifyContent: 'space-between',
  },
});

export default RestaurantDetails;
