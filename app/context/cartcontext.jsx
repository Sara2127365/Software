import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase/config';

// إنشاء السياق
const CartContext = createContext();

// مزود السياق
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // تحميل السلة
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
      console.error('خطأ في تحميل بيانات السلة:', error);
    }
  };

  // حساب الإجمالي
  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
    setTotalPrice(total.toFixed(2));
  };

  // زيادة الكمية
  const increaseQuantity = async (item) => {
    try {
      const newQuantity = (item.quantity || 1) + 1;
      await updateDoc(doc(db, 'Cart', item.id), { quantity: newQuantity });
      fetchCart();
    } catch (error) {
      console.error('خطأ أثناء زيادة الكمية:', error);
    }
  };

  // تقليل الكمية أو الحذف
  const decreaseQuantity = async (item) => {
    try {
      if ((item.quantity || 1) <= 1) {
        await deleteDoc(doc(db, 'Cart', item.id));
      } else {
        await updateDoc(doc(db, 'Cart', item.id), { quantity: item.quantity - 1 });
      }
      fetchCart();
    } catch (error) {
      console.error('خطأ أثناء تقليل الكمية:', error);
    }
  };
  // إضافة العنصر إلى السلة
const addToCart = async (item) => {
  try {
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);

    if (existingItem) {
      // إذا كان العنصر موجودًا، قم بزيادة الكمية
      await increaseQuantity(existingItem);
    } else {
      // إذا كان العنصر غير موجود، قم بإضافته
      await addDoc(collection(db, 'Cart'), {
        ...item,
        quantity: 1, // تعيين الكمية كبداية إلى 1
      });
    }
    fetchCart();
  } catch (error) {
    console.error('خطأ أثناء إضافة العنصر إلى السلة:', error);
  }
};

  // تنفيذ الشراء
  const checkoutCart = async (address, faculty, userName) => {
    try {
      if (cartItems.length === 0) {
        alert("السلة فارغة.");
        return;
      }

      if (!address || !faculty) {
        alert("يرجى إدخال العنوان والكلية.");
        return;
      }

      const total = cartItems.reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
        0
      );

      await addDoc(collection(db, 'Orders'), {
        items: cartItems,
        total,
        address,
        faculty,
        userName,
        createdAt: new Date(),
      });

      for (const item of cartItems) {
        await deleteDoc(doc(db, 'Cart', item.id));
      }

      setCartItems([]);
      setTotalPrice(0);
      alert("تمت عملية الشراء بنجاح!");
    } catch (error) {
      console.error('فشل تنفيذ عملية الشراء:', error);
      alert("فشل تنفيذ عملية الشراء.");
    }
  };

  // تنظيف السلة (للاستخدام بعد الشراء مثلاً)
  const clearCart = async () => {
    try {
      for (const item of cartItems) {
        await deleteDoc(doc(db, 'Cart', item.id));
      }
      setCartItems([]);
      setTotalPrice(0);
    } catch (error) {
      console.error('فشل في تنظيف السلة:', error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalPrice,
        increaseQuantity,
        decreaseQuantity,
        checkoutCart,
        fetchCart,
        clearCart,
        addToCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// هوك للاستخدام
export const useCart = () => useContext(CartContext);
