import { addDoc, collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db, storage } from '../firebase/config';
import uuid from 'react-native-uuid'; // for generating unique IDs
import { getDownloadURL } from 'firebase/storage';
import { uploadImage } from '../firebase/storage';

export const getServiceData = async uid => {
    try {
        const docRef = doc(db, 'service-users', uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            console.warn('No such document!');
            return null;
        }
    } catch (error) {
        console.error('Error getting document: ', error);
        return null;
    }
};

export const addProduct = async ({ name, price, uri, uid, categories }) => {
    console.log(uri);

    try {
        // Step 1: Upload image to Firebase Storage
        const imageId = uuid.v4();
        const url = await uploadImage(uri, `products/${uid}/${imageId}`);

        // Step 2: Add product document to Firestore
        const docRef = await addDoc(collection(db, 'food'), {
            name,
            price,
            url,
            createdAt: new Date(),
            uid: uid,
            categories: categories
        });

        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('Error adding product:', error);
        return { success: false, error };
    }
};

// utils/backend helpers/foodCalls.js

export const getFoodsByUid = async uid => {
    try {
        const q = query(collection(db, 'food'), where('uid', '==', uid));

        const querySnapshot = await getDocs(q);
        const foods = [];

        querySnapshot.forEach(doc => {
            foods.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return foods;
    } catch (error) {
        console.error('Error getting foods by uid:', error);
        throw error;
    }
};
