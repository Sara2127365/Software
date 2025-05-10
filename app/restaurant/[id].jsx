import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ScrollView, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, collection, query, where, getDocs, setDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../../utils/firebase/config';
import FlipCard from 'react-native-flip-card';
import StarRating, { Rating } from 'react-native-ratings';
import { AirbnbRating } from 'react-native-ratings';

const RestaurantDetails = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [restaurant, setRestaurant] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['top selling']);
  const [selectedCategories, setSelectedCategories] = useState('top selling');
  const [productQuantities, setProductQuantities] = useState({});
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [flippedStates, setFlippedStates] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, 'service-users', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const restaurantData = docSnap.data();
          setRestaurant(restaurantData);

          const rawCategories = Array.isArray(restaurantData.categories) ? restaurantData.categories : [];
          const formattedCategories = rawCategories.map((cat) => cat.toLowerCase());
          setCategories(['top selling', ...formattedCategories]);
        }
      } catch (error) {
        console.error('Error fetching restaurant:', error);
      }
    };
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, 'food'), where('uid', '==', id));
        const snapshot = await getDocs(q);

        const fetchedProducts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products from food collection:', error);
      }
    };


    const loadReviews = async () => {
      try {
        const q = query(collection(db, 'reviews'), where('restaurantId', '==', id));
        const snapshot = await getDocs(q);
        setReviews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    if (id) {
      fetchData();
      fetchProducts();
      loadReviews();
    }
  }, [id]);


  const calculateAverageRating = () => {
    if (reviews.length === 0) return "No Rating";
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  const handleAddReview = async () => {
    if (!auth.currentUser) return alert("يجب تسجيل الدخول لإضافة مراجعة!");

    try {
      await addDoc(collection(db, "reviews"), {
        restaurantId: id,
        userId: auth.currentUser.uid,
        rating,
        reviewText,
        createdAt: new Date(),
      });

      setReviewText('');
      setRating(5);

      const updatedReviews = await getDocs(query(collection(db, "reviews"), where("restaurantId", "==", id)));
      setReviews(updatedReviews.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("خطأ أثناء إضافة المراجعة:", error);
    }
  };

  const handleUpdateReview = async (reviewId, newText, newRating) => {
    try {
      const reviewRef = doc(db, "reviews", reviewId);
      await updateDoc(reviewRef, { reviewText: newText, rating: newRating });

      alert("تم تحديث المراجعة بنجاح!");
      const updatedReviews = await getDocs(query(collection(db, "reviews"), where("restaurantId", "==", id)));
      setReviews(updatedReviews.docs.map(doc => ({ id: doc.id, ...doc.data() })));

    } catch (error) {
      console.error("خطأ أثناء تحديث المراجعة:", error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteDoc(doc(db, "reviews", reviewId));
      setReviews(reviews.filter(review => review.id !== reviewId));
      alert("تم حذف المراجعة بنجاح!");
    } catch (error) {
      console.error("خطأ أثناء حذف المراجعة:", error);
    }
  };


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
    selectedCategories === 'top selling'
      ? products
      : products.filter((prod) => {
        if (typeof prod.categories === 'string') {
          return prod.categories.toLowerCase() === selectedCategories.toLowerCase();
        }
        return false;
      });

  const toggleFlip = (productId) => {
    setFlippedStates((prev) => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const saveCartToFirestore = async (cartData) => {
    try {
      const userCartRef = doc(db, 'carts', auth.currentUser.uid);
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
        <TouchableOpacity onPress={() => router.push('(tabs)/Restaurants')}>
          <Text style={styles.backArrow}>{'←'}</Text>
        </TouchableOpacity>
        <Text style={styles.pageTitle}>{restaurant?.serviceName}</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.coverContainer}>
        <View style={styles.cover}>
          <Image source={{ uri: restaurant.image }} style={styles.image} resizeMode="cover" />
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>{restaurant.rating} ★</Text>
          </View>
        </View>
        <View style={[styles.logoCircle, { alignSelf: 'flex-start', marginLeft: 16 }]}>
          <Image source={{ uri: restaurant.logoImage }} style={styles.logoImage} resizeMode="contain" />
        </View>
        <Text style={styles.restaurantName}>{restaurant?.serviceName}</Text>
      </View>

      <View style={styles.categoriesContainer}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setSelectedCategories(cat)}
            style={[
              styles.categoriesButton,
              selectedCategories === cat && styles.selectedCategoriesButton,
            ]}
          >
            <Text style={styles.categoriesText}>{cat}</Text>
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
                <Image source={{ uri: item.url }} style={styles.productImage} />
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
      <View style={styles.topBar}>
        <Text style={styles.pageTitle}>{restaurant?.name}</Text>
        <Text style={styles.ratingText}>⭐ {calculateAverageRating()}</Text>
      </View>

      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.reviewCard}>
            <Text style={styles.reviewRating}>⭐ {item.rating}</Text>
            <Text style={styles.reviewText}>{item.reviewText}</Text>
            {item.userId === auth.currentUser?.uid && (
              <>
                <TouchableOpacity onPress={() => handleUpdateReview(item.id, "Edited", 4)} style={styles.editButton}>
                  <Text style={styles.editButtonText}>✏️ Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleDeleteReview(item.id)} style={styles.deleteButton}>
                  <Text style={styles.deleteButtonText}>🗑️ Delete</Text>
                </TouchableOpacity>
              </>
            )}


          </View>
        )}
      />

      <View style={styles.reviewInputContainer}>
        <Text style={styles.label}>Rating:</Text>
        <AirbnbRating
          count={5} // عدد النجوم المتاحة
          defaultRating={rating} // التقييم الافتراضي
          size={30} // حجم النجوم
          onFinishRating={(newRating) => setRating(newRating)} // تحديث عند تغيير التقييم
        />

        <Text style={styles.label}>write your review:</Text>
        <TextInput
          placeholder="write here.."
          value={reviewText}
          onChangeText={setReviewText}
          style={styles.reviewInput}
        />

        <TouchableOpacity onPress={handleAddReview} style={styles.reviewButton}>
          <Text style={styles.reviewButtonText}>send rating</Text>
        </TouchableOpacity>
      </View>


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
    color: '#FFA500',
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
  categoriesButton: {
    marginHorizontal: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  selectedCategoriesButton: {
    backgroundColor: '#ff9900',
  },
  categoriesText: {
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
  ratingText: {
    fontSize: 18, color: '#FFA500'

  },
  reviewCard: {
    padding: 10, borderBottomWidth: 1

  },
  reviewRating: {
    fontWeight: 'bold', fontSize: 16, color: '#FFA500'

  },
  reviewText: {
    fontSize: 14, color: '#333'

  },
  reviewInputContainer: {
    marginTop: 20, padding: 16, backgroundColor: '#f9f9f9', borderRadius: 8

  },
  label: {
    fontSize: 16, fontWeight: 'bold', marginBottom: 8
  },
  reviewInput: {
    borderWidth: 1, padding: 8, borderRadius: 8, marginBottom: 16

  },
  reviewButton: {
    backgroundColor: 'rgb(255 105 105)', padding: 12, borderRadius: 8

  },
  reviewButtonText: {
    color: 'black', textAlign: 'center', fontSize: 16, fontWeight: 'bold'
  },
  editButton: {
    backgroundColor: '#FFA500', padding: 6, borderRadius: 4, marginTop: 4
  },
  editButtonText: {
    color: 'white', fontSize: 14, fontWeight: 'bold'
  },
  deleteButton: {
    backgroundColor: 'rgb(255 105 105)', padding: 6, borderRadius: 4, marginTop: 4
  },
  deleteButtonText: {
    color: 'white', fontSize: 14, fontWeight: 'bold'
  },
});


export default RestaurantDetails;