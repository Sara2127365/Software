import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './config'; // adjust path if needed

export const signUp = async obj => {
    try {
        console.log('OBJ', obj);

        const userCredential = await createUserWithEmailAndPassword(
            auth,
            obj.email,
            obj.password
        );
        const user = userCredential.user;

        await setDoc(
            doc(
                db,
                obj.table === 'users' ? 'users' : 'service-users',// خلي بالك هنا اهم حاجه ابعتي بس انت هترمي علي انهي تابل في فايربيز
                user.uid
            ),
            obj.table === 'users' ? {
                email: obj.email,
                faculty: obj.faculty || 'test faculty',
                type: obj.type || 'default type',
                password: obj.password || 'test password',
                phoneNumber: obj.phoneNumber || 'test phone',
                name: obj.name || 'test name',
                createdAt: new Date().toISOString()
            } : {
                email: obj.email,
                categories: obj.categories?.length > 0 ? obj.categories.join(' , ') : 'test , test',
                info: obj.info || 'info test',
                password: obj.password || 'test password',
                phoneNumber: obj.phoneNumber || 'test phone',
                serviceName: obj.restaurantName || 'test name',
                createdAt: new Date().toISOString()
            }
        );

        console.log('User signed up and data saved!');
    } catch (error) {
        console.error('Signup error:', error.message);
    }
};
