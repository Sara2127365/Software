import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { auth, db } from '../../../utils/firebase/config';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function ProfileScreen() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    faculty: '',
    type: '',
    photoURL: '',
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'User is not logged in!');
        return;
      }

      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        let photoURL = '';
        if (docSnap.exists()) {
          const data = docSnap.data();
          photoURL = data.photoURL;

          // If photoURL isn't set in Firestore, try to fetch it from storage
          if (!photoURL) {
            const storage = getStorage();
            const imageRef = ref(storage, `profilePictures/${user.uid}.jpg`);
            try {
              photoURL = await getDownloadURL(imageRef);
              await updateDoc(docRef, { photoURL }); // Save for next time
            } catch (error) {
              console.log("No profile image found in storage.");
            }
          }

          setUserData({
            ...data,
            email: user.email,
            photoURL,
          });
        }
      } catch (err) {
        Alert.alert('Error', 'Failed to load profile.');
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'User is not logged in!');
      return;
    }

    try {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, {
        name: userData.name,
        phoneNumber: userData.phoneNumber,
        faculty: userData.faculty,
        type: userData.type,
      });
      Alert.alert('Success', 'Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile.');
      console.error(error);
    }
  };

  const pickAndUploadImage = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'User is not logged in!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result || result.canceled || !result.assets || !result.assets.length) return;

    const image = result.assets[0];
    const response = await fetch(image.uri);
    const blob = await response.blob();

    const storage = getStorage();
    const storageRef = ref(storage, `profilePictures/${user.uid}.jpg`);

    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);

    const userDocRef = doc(db, 'users', user.uid);
    await updateDoc(userDocRef, { photoURL: downloadURL });

    setUserData(prev => ({ ...prev, photoURL: downloadURL }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.welcome}>Welcome, {userData.name || 'User'}</Text>
      <Text style={styles.brand}>Toomiia</Text>

      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={pickAndUploadImage}>
          {userData.photoURL ? (
            <Image
              source={{ uri: userData.photoURL }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.placeholderAvatar}>
              <Text style={styles.placeholderIcon}>👤</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => (isEditing ? handleSave() : setIsEditing(true))}>
          <Text style={styles.edit}>{isEditing ? 'Save' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <LabelInput
          label="Name"
          value={userData.name}
          editable={isEditing}
          onChangeText={text => setUserData({ ...userData, name: text })}
        />
        <LabelInput
          label="Email"
          value={userData.email}
          editable={false}
        />
        <LabelInput
          label="Phone Number"
          value={userData.phoneNumber}
          editable={isEditing}
          onChangeText={text => setUserData({ ...userData, phoneNumber: text })}
        />
        <LabelInput
          label="Faculty"
          value={userData.faculty}
          editable={isEditing}
          onChangeText={text => setUserData({ ...userData, faculty: text })}
        />
        <LabelInput
          label="You are"
          value={userData.type}
          editable={isEditing}
          onChangeText={text => setUserData({ ...userData, type: text })}
        />
      </View>
    </ScrollView>
  );
}

function LabelInput({ label, value, editable = false, onChangeText }) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        editable={editable}
        style={[styles.input, editable && styles.editableInput]}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1
  },
  welcome: {
    fontSize: 16,
    color: '#444'
  },
  brand: {
    textAlign: 'right',
    color: '#cc3366',
    fontWeight: 'bold',
    marginBottom: 20
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f2dede',
  },
  placeholderAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f2dede',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: {
    fontSize: 40,
    color: '#aaa',
  },
  edit: {
    color: '#cc3366',
    marginTop: 10,
    fontSize: 16
  },
  form: {
    gap: 15
  },
  inputGroup: {},
  label: {
    color: '#cc3366',
    marginBottom: 5
  },
  input: {
    backgroundColor: '#f8f8f8',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    color: '#000',
  },
  editableInput: {
    backgroundColor: '#fff',
    borderColor: '#cc3366',
  },
});
