import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './config';
// import { v4 as uuid } from 'uuid';

export const uploadImage = async (uri, path) => {
    try {
        // Convert URI to Blob
        const response = await fetch(uri);
        const blob = await response.blob();

        const imageRef = ref(storage, `${path}`);

        // Upload the image
        await uploadBytes(imageRef, blob);

        // Get the download URL
        const downloadURL = await getDownloadURL(imageRef);
        console.log(`downloadURL` , downloadURL);
        
        return downloadURL;
    } catch (error) {
        console.error('Upload failed:', error);
        throw error;
    }
};
