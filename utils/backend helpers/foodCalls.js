import { collection, getDocs } from 'firebase/firestore';

import { db } from '../firebase/config';

export async function getAllCategories() {
    try {
        const querySnapshot = await getDocs(collection(db, 'categories'));
        const categories = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return categories;
    } catch (error) {
        console.log('Error fetching categories:', error);
        return [];
    }
}
