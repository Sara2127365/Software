import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { auth, db } from './config';
import { uploadImage } from './storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const signUp = async obj => {
    console.log(obj);

    try {
        if ((!obj.email || !obj.password) && obj.table === 'service-users')
            throw new Error('Email and password are required');

        if (
            (!obj.logo?.uri || !obj.cover?.uri) &&
            obj.table === 'service-users'
        )
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
            obj.table === 'users'
                ? {
                      email: obj.email,
                      faculty: obj.faculty,
                      type: obj.type || 'info test',
                      phoneNumber: obj.phoneNumber || 'test phone',
                      name: obj.name || 'test name',
                      password: obj.password || 'test name',
                      createdAt: serverTimestamp()
                  }
                : {
                      email: obj.email,
                      categories: obj.categories?.length
                          ? obj.categories
                          : ['test', 'test'],
                      info: obj.info || 'info test',
                      phoneNumber: obj.phoneNumber || 'test phone',
                      serviceName: obj.restaurantName || 'test name',
                      password: obj.password || 'test name',
                      createdAt: serverTimestamp(),
                      is_service : true
                  }
        );

        if (obj.table === 'service-users') {
            await Promise.all([
                uploadImage(obj.logo.uri, `services/logos/${user.uid}`),
                uploadImage(obj.cover.uri, `services/covers/${user.uid}`)
            ]);
        }

        console.log('User signed up and data saved!');
        return { success: true, uid: user.uid };
    } catch (error) {
        throw new Error(error.message);
    }
};

export const Login = async obj => {
    console.log(obj);

    try {
        if ((!obj.email || !obj.password) && obj.table === 'service-users')
            throw new Error('Email and password are required');

        if (
            (!obj.logo?.uri || !obj.cover?.uri) &&
            obj.table === 'service-users'
        )
            throw new Error('Logo and cover images are required');

        const userCredential = await createUserWithEmailAndPassword(
            auth,
            obj.email,
            obj.password
        );
        const user = userCredential.user;

        await setDoc(
            doc(db, obj.table, user.uid),
            obj.table === 'users'
                ? {
                      email: obj.email,
                      faculty: obj.faculty,
                      type: obj.type || 'info test',
                      phoneNumber: obj.phoneNumber || 'test phone',
                      name: obj.name || 'test name',
                      password: obj.password || 'test name',
                      createdAt: serverTimestamp()
                  }
                : {
                      email: obj.email,
                      categories: obj.categories?.length
                          ? obj.categories
                          : ['test', 'test'],
                      info: obj.info || 'info test',
                      phoneNumber: obj.phoneNumber || 'test phone',
                      serviceName: obj.name || 'test name',
                      password: obj.password || 'test name',
                      createdAt: serverTimestamp()
                  }
        );

        if (obj.table === 'service-users') {
            await Promise.all([
                uploadImage(obj.logo.uri, `services/logos/${user.uid}`),
                uploadImage(obj.cover.uri, `services/covers/${user.uid}`)
            ]);
        }

        return { success: true, uid: user.uid };
    } catch (error) {
        throw new Error(error.message);
    }
};

export const login = async obj => {
    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            obj.email,
            obj.password
        );
        const user = userCredential.user;

        // احضار بيانات المستخدم من Firestore
        const docRef = doc(db, obj.table === 'users' ? 'users' : 'service-users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const userData = docSnap.data();

            // تخزين البيانات في AsyncStorage
            await AsyncStorage.setItem('userData', JSON.stringify(userData));
            await AsyncStorage.setItem('status', 'true');

            return { success: true, uid: user.uid, userData };
        } else {
            throw new Error('No user data found.');
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

export const getUserData = async uid => {
    try {
        const userRef = doc(db, 'users', uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
            return docSnap.data();
        } else if (!docSnap.exists()) {
            const serviceRef = doc(db, 'service-users', uid);
            const docSnap2 = await getDoc(serviceRef);
            if (docSnap2.exists) {
                return docSnap2.data();
            }
        } else {
            console.log('No such document!');
        }
    } catch (error) {
        console.error('Error getting user data:', error);
    }
};

