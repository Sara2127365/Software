import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { auth, db } from './config';
import { uploadImage } from './storage';

export const signUp = async obj => {
    try {
        if (!obj.email || !obj.password)
            throw new Error('Email and password are required');

        if (!obj.logo?.uri || !obj.cover?.uri)
            throw new Error('Logo and cover images are required');

        const userCredential = await createUserWithEmailAndPassword(
            auth,
            obj.email,
            obj.password
        );
        const user = userCredential.user;

        await setDoc(
            doc(
                db,
                obj.table === 'users' ? 'users' : 'service-users',
                user.uid
            ),
            {
                email: obj.email,
                categories: obj.categories?.length
                    ? obj.categories
                    : ['test', 'test'],
                info: obj.info || 'info test',
                phoneNumber: obj.phoneNumber || 'test phone',
                serviceName: obj.name || 'test name',
                createdAt: serverTimestamp()
            }
        );

        await Promise.all([
            uploadImage(obj.logo.uri, `services/logos/${user.uid}`),
            uploadImage(obj.cover.uri, `services/covers/${user.uid}`)
        ]);

        console.log('User signed up and data saved!');
        return { success: true, uid: user.uid };
    } catch (error) {
        throw new Error(error.message);
    }
};

export const getUserData = async uid => {
    try {
        const userRef = doc(db, 'users', uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
            console.log('User data:', docSnap.data());
            return docSnap.data();
        } else {
            console.log('No such document!');
        }
    } catch (error) {
        console.error('Error getting user data:', error);
    }
};
