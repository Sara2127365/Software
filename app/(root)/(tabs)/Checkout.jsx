import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Button, Alert } from 'react-native';
import { auth, db } from '../../../utils/firebase/config';
import { doc, getDoc } from 'firebase/firestore';

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

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
            const calculatedTotal = filteredItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
            setTotal(calculatedTotal);
          } else {
            console.log("Cart is empty.");
          }
        } catch (error) {
          console.error("Error fetching cart:", error);
        }
      }
    };

    fetchCart();
  }, []);

  const handleCheckout = () => {
    if (!cart || cart.length === 0) {
      Alert.alert("Checkout Error", "Your cart is empty.");
      return;
    }
    Alert.alert("Success", "Your order has been placed!");
    // هنا ممكن تضيف كود لمسح السلة أو إرسال الطلب
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checkout</Text>

      {cart.length === 0 ? (
        <Text>Your cart is empty.</Text>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <View style={styles.details}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text>Price: {item.price} EGP</Text>
                  <Text>Quantity: {item.quantity}</Text>
                  <Text>Total: {item.price * item.quantity} EGP</Text>
                </View>
              </View>
            )}
          />
          <Text style={styles.total}>Total: {total} EGP</Text>
          <Button title="Place Order" onPress={handleCheckout} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  item: {
    flexDirection: 'row',
    marginBottom: 12,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  details: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'right',
  },
});

export default Checkout;
