import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from './config'; 


export const addReview = async (restaurantId, userId, rating, reviewText) => {
    try {
        await addDoc(collection(db, "reviews"), {
            restaurantId,
            userId,
            rating,
            reviewText,
            createdAt: new Date(),
        });
        console.log("تمت إضافة المراجعة بنجاح!");
    } catch (err) {
        console.error("خطأ أثناء إضافة المراجعة:", err);
    }
};

export const fetchReviews = async (restaurantId) => {
    try {
        const q = query(collection(db, "reviews"), where("restaurantId", "==", restaurantId));
        const snapshot = await getDocs(q);
        const reviews = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        return reviews;
    } catch (err) {
        console.error("خطأ أثناء جلب المراجعات:", err);
        return [];
    }
};