// utils/addToCart.js
import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase/config';

export const addToCart = async (item) => {
  try {
    if (!item.price || isNaN(item.price)) {
      alert("Item must have a valid price");
      return;
    }

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

    alert("Added to cart successfully");
  } catch (error) {
    console.error("Error adding to cart:", error);
    alert("Failed to add to cart");
  }
};
