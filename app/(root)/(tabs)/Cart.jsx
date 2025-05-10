import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { auth, db } from '../../../utils/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native'; // لاستخدام التنقل

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const navigation = useNavigation(); // الحصول على التنقل

  useEffect(() => {
    const fetchCart = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const cartRef = doc(db, 'carts', user.uid);
          const cartSnap = await getDoc(cartRef);
          if (cartSnap.exists()) {
            const cartData = cartSnap.data();
            const filteredItems = cartData.items.filter(item => item.quantity > 0);
            setCart(filteredItems);

            setTotal(filteredItems.reduce((sum, item) => sum + item.price * item.quantity, 0));
          } else {
            console.log("Cart is empty.");
          }
        } catch (error) {
          console.error("Error fetching cart:", error);
        }
      } else {
        console.log("No user logged in.");
      }
    };

    fetchCart();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>

      {/* عرض العناصر في السلة */}
      {cart.length === 0 ? (
        <Text>Your cart is empty.</Text>
      ) : (
        <FlatList
          data={cart}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <View style={styles.itemRow}>
                {/* عرض صورة المنتج */}
                <Image source={{ uri: item.image }} style={styles.productImage} />

                {/* عرض تفاصيل المنتج */}
                <View style={styles.itemDetails}>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.productPrice}>Price per unit: {item.price} EGP</Text>
                  <Text>Quantity: {item.quantity}</Text>
                  <Text>Total: {item.price * item.quantity} EGP</Text>
                </View>
              </View>
            </View>
          )}
        />
      )}
      <Text style={styles.total}>Total: {total} EGP</Text>

      {/* زر التشيك أوت */}
      {cart.length > 0 && (
        <TouchableOpacity style={styles.checkoutButton} onPress={() => navigation.navigate('Checkout')}>
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  item: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
    flexDirection: 'column',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: '#ff5733',
    marginBottom: 2,
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'right',
  },
  checkoutButton: {
    backgroundColor: '#ff5733',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default Cart;
