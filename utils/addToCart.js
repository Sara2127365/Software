// utils/addToCart.js
import { doc, setDoc, getDocs, collection, updateDoc } from 'firebase/firestore';
import { db } from './firebase/config';

export const addToCart = async (item, setCart) => {
  try {
    if (!item.price || isNaN(item.price)) {
      alert("Item must have a valid price");
      return;
    }

    // تحقق من وجود المنتج في السلة بالفعل
    const cartRef = collection(db, 'Cart');
    const cartSnapshot = await getDocs(cartRef);
    const existingItem = cartSnapshot.docs.find(doc => doc.data().id === item.id);

    if (existingItem) {
      // إذا كان المنتج موجودًا بالفعل، نقوم بتحديث الكمية
      const cartDocRef = doc(db, 'Cart', existingItem.id);
      await updateDoc(cartDocRef, {
        quantity: existingItem.data().quantity + 1, // زيادة الكمية
      });
    } else {
      // إذا لم يكن المنتج موجودًا، نضيفه
      await setDoc(doc(db, 'Cart', item.id), {
        id: item.id,
        name: item.name,
        description: item.description || '',
        image: item.image || '',
        rating: item.rating || 0,
        tags: item.tags || [],
        quantity: item.quantity || 1,
        price: Number(item.price),
      });
    }

    // بعد الإضافة أو التحديث، جلب السلة وتحديثها
    const cartSnapshotAfterUpdate = await getDocs(cartRef);
    const updatedCartItems = cartSnapshotAfterUpdate.docs.map(doc => doc.data());

    setCart(updatedCartItems);  // تحديث السلة في الstate

    alert("Added to cart successfully");
  } catch (error) {
    console.error("Error adding to cart:", error);
    alert("Failed to add to cart");
  }
};
