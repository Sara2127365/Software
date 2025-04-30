import { View, Text, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '../../../utils/firebase/config';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [userAddress, setUserAddress] = useState(""); 
  const [userFaculty, setUserFaculty] = useState(""); 

  
  const fetchCart = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'Cart'));
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCartItems(items);
      calculateTotal(items);
    } catch (error) {
      console.error('Error fetching cart data: ', error);
    }
  };

  
  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
    setTotalPrice(total.toFixed(2));
  };

  
  const decreaseQuantityOrRemove = async (item) => {
    try {
      if ((item.quantity || 1) <= 1) {
        await deleteDoc(doc(db, 'Cart', item.id));
        Alert.alert("Removed", "Item removed from cart");
      } else {
        await updateDoc(doc(db, 'Cart', item.id), {
          quantity: item.quantity - 1,
        });
      }
      fetchCart();
    } catch (error) {
      console.error('Error decreasing quantity: ', error);
      Alert.alert("Error", "Something went wrong");
    }
  };

  
  const increaseQuantity = async (item) => {
    try {
      const itemRef = doc(db, 'Cart', item.id);
      await updateDoc(itemRef, {
        quantity: (item.quantity || 1) + 1,
      });
      fetchCart();
    } catch (error) {
      console.error('Error increasing quantity: ', error);
      Alert.alert("Error", "Could not increase quantity");
    }
  };


  const checkoutCart = async () => {
    try {
      if (cartItems.length === 0) {
        Alert.alert("Cart is empty", "Add some items before checkout.");
        return;
      }

      if (!userAddress) {
        Alert.alert("Address required", "Please provide a shipping address.");
        return;
      }

      
      Alert.alert(
        "Checkout Confirmation",
        `Are you sure you want to checkout? \n\nFaculty: ${userFaculty}\nTotal Price: $${totalPrice}`,
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Confirm",
            onPress: async () => {
              const total = cartItems.reduce(
                (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
                0
              );

              
              await addDoc(collection(db, 'Orders'), {
                items: cartItems,
                total,
                createdAt: new Date(),
                address: userAddress, 
                faculty: userFaculty,   
              });

            
              for (const item of cartItems) {
                await deleteDoc(doc(db, 'Cart', item.id));
              }

              
              setCartItems([]);       
              setTotalPrice(0);         
              setUserAddress("");       
              setUserFaculty("");
              Alert.alert("Success", "Checkout completed and cart cleared.");
            },
          },
        ]
      );
    } catch (error) {
      console.error("Checkout failed:", error);
      Alert.alert("Error", "Checkout failed.");
    }
  };

  
  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-xl font-bold mb-4">My Cart</Text>

      {cartItems.length === 0 ? (
        <Text className="text-gray-500 text-center mt-10">Your cart is empty.</Text>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View className="mb-4 p-3 bg-gray-100 rounded-lg">
                {item.image && (
                  <Image
                    source={{ uri: item.image }}
                    style={{
                      width: '100%',
                      height: 150,
                      borderRadius: 10,
                      marginBottom: 8,
                    }}
                  />
                )}
                <Text className="text-lg font-bold">{item.name}</Text>
                <Text className="text-sm text-gray-600">{item.description}</Text>
                <Text className="mt-1 text-yellow-500">Rating: {item.rating}</Text>

                <Text className="text-black mt-1">Unit Price: ${item.price}</Text>
                <Text className="text-black">Quantity: {item.quantity || 1}</Text>
                <Text className="text-black font-semibold">
                  Total: ${(item.price * (item.quantity || 1)).toFixed(2)}
                </Text>

                <View className="flex-row mt-2 space-x-2">
                  <TouchableOpacity
                    onPress={() => increaseQuantity(item)}
                    className="bg-green-500 px-3 py-2 rounded"
                  >
                    <Text className="text-white font-semibold">+ Increase</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => decreaseQuantityOrRemove(item)}
                    className="bg-red-500 px-3 py-2 rounded"
                  >
                    <Text className="text-white font-semibold">- Decrease / Remove</Text>
                  </TouchableOpacity>
                </View>

                {item.tags && Array.isArray(item.tags) && (
                  <View className="flex-row flex-wrap mt-2">
                    {item.tags.map((tag, index) => (
                      <Text
                        key={index}
                        className="text-xs bg-[#FFDEDE] text-[#CC4C4C] px-2 py-1 rounded mr-2 mb-2"
                      >
                        {tag}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 40 }}
          />

          <View className="mt-6 p-4 border-t border-gray-300">
            <Text className="text-xl font-bold text-right">
              Total: ${totalPrice}
            </Text>

            <TouchableOpacity
              onPress={checkoutCart} 
              className="bg-blue-600 py-3 mt-4 rounded"
            >
              <Text className="text-center text-white font-bold">Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}
