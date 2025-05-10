import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Modal, FlatList,
  StyleSheet, ScrollView, Image, TouchableWithoutFeedback
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, getDocs, setDoc, query, where } from 'firebase/firestore';
import { auth, db } from '../../../../utils/firebase/config';

const faculties = [
  'Faculty of Science', 'Faculty of Arts', 'Faculty of Business',
  'Faculty of Law', 'Faculty of Archaeology', 'Faculty of Urban Planning',
  'Faculty of Dar Al Uloom', 'Faculty of Mass Communication'
];
const states = ['Student', 'Worker'];

export default function SignUp() {
  const router = useRouter();
  const [facultyModalVisible, setFacultyModalVisible] = useState(false);
  const [stateModalVisible, setStateModalVisible] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    logo: null,
  });

  const handleSelectFaculty = (faculty) => {
    setSelectedFaculty(faculty);
    setFacultyModalVisible(false);
  };

  const handleSelectState = (state) => {
    setSelectedState(state);
    setStateModalVisible(false);
  };

  const pickFile = async (id) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
        copyToCacheDirectory: true,
        multiple: false
      });
      if (!result.canceled && result.assets?.length > 0) {
        const file = result.assets[0];
        setFormData(prev => ({ ...prev, [id]: file }));
      }
    } catch (err) {
      console.error('Error picking file:', err);
    }
  };

  const handleRegisterSubmit = async () => {
    const { name, email, phoneNumber, password } = formData;

    if (!name || !email || !phoneNumber || !password || !selectedFaculty || !selectedState) {
      alert('يرجى ملء جميع الحقول');
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      alert('صيغة البريد الإلكتروني غير صحيحة');
      return;
    }

    const phoneNumberRegex = /^01[0-9]{9}$/;
    if (!phoneNumberRegex.test(phoneNumber)) {
      alert('يرجى إدخال رقم هاتف مصري صحيح');
      return;
    }

    if (password.length < 6) {
      alert('كلمة المرور يجب أن تكون على الأقل 6 أحرف');
      return;
    }

    try {
      // Query Firestore for existing users with the same email
      const usersRef = collection(db, 'users');
      const emailQuery = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(emailQuery);

      if (!querySnapshot.empty) {
        alert('البريد الإلكتروني مستخدم بالفعل في النظام');
        return;
      }

      // Create a new user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Use auth.currentUser.uid (which is the same as user.uid) as the document ID in Firestore
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        uid: user.uid, // saving the uid field explicitly (optional)
        name,
        email,
        phoneNumber,
        faculty: selectedFaculty,
        state: selectedState,
        logo: formData.logo ? formData.logo.uri : null,
        password, // In production, DO NOT store plaintext password
      });

      alert('تم إنشاء الحساب بنجاح');
      router.push('/LoginPage');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        alert('هذا البريد الإلكتروني مستخدم بالفعل');
      } else {
        alert('حدث خطأ أثناء إنشاء الحساب');
        console.error(error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <AntDesign onPress={() => router.back()} name="arrowleft" size={24} color="#CC4C4C" />
        <Text style={styles.headerTitle}>Create user account</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarCircle}>
            {formData.logo ? (
              <Image source={{ uri: formData.logo.uri }} style={styles.avatarImage} resizeMode="cover" />
            ) : (
              <FontAwesome name="user" size={48} color="white" />
            )}
            <TouchableOpacity onPress={() => pickFile('logo')} style={styles.cameraIcon}>
              <Feather name="camera" size={18} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.all}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Full name"
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
            />
            <Feather name="user" size={20} color="#D3D3D3" style={styles.iconRight} />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={formData.email}
              onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
            />
            <Feather name="mail" size={20} color="#D3D3D3" style={styles.iconRight} />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChangeText={(text) => setFormData(prev => ({ ...prev, phoneNumber: text }))}
            />
            <Feather name="phone" size={20} color="#D3D3D3" style={styles.iconRight} />
          </View>
          <TouchableOpacity style={styles.input} onPress={() => setFacultyModalVisible(true)}>
            <Text>{selectedFaculty || 'Select Faculty'}</Text>
            <Feather name="chevron-down" size={20} color="#D3D3D3" style={styles.iconRight} />
          </TouchableOpacity>
          <Modal visible={facultyModalVisible} transparent animationType="fade">
            <TouchableWithoutFeedback onPress={() => setFacultyModalVisible(false)}>
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <FlatList
                    data={faculties}
                    renderItem={({ item }) => (
                      <TouchableOpacity onPress={() => handleSelectFaculty(item)} style={styles.facultyItem}>
                        <Text>{item}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
          <TouchableOpacity style={styles.input} onPress={() => setStateModalVisible(true)}>
            <Text>{selectedState || 'Select State'}</Text>
            <Feather name="chevron-down" size={20} color="#D3D3D3" style={styles.iconRight} />
          </TouchableOpacity>
          <Modal visible={stateModalVisible} transparent animationType="fade">
            <TouchableWithoutFeedback onPress={() => setStateModalVisible(false)}>
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <FlatList
                    data={states}
                    renderItem={({ item }) => (
                      <TouchableOpacity onPress={() => handleSelectState(item)} style={styles.stateItem}>
                        <Text>{item}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={formData.password}
              onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
            />
            <Feather name="lock" size={20} color="#D3D3D3" style={styles.iconRight} />
          </View>
        </View>
        <TouchableOpacity style={styles.registerButton} onPress={handleRegisterSubmit}>
          <Text style={styles.registerText}>Register</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F2' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#3F3F3F' },
  avatarContainer: { alignItems: 'center', marginVertical: 30 },
  avatarCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#FFBABA', justifyContent: 'center', alignItems: 'center' },
  cameraIcon: { position: 'absolute', bottom: -5, right: -5, backgroundColor: '#FF6969', borderRadius: 20, padding: 6 },
  all: { backgroundColor: '#fff', padding: 20, borderRadius: 12 },
  inputContainer: { position: 'relative' },
  input: {
    borderWidth: 1,
    borderColor: '#D3D3D3',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#fff'
  },
  iconRight: { position: 'absolute', right: 12, top: '50%', transform: [{ translateY: -10 }] },
  registerButton: {
    backgroundColor: '#FF6969',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  registerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50
  },
  facultyItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#D3D3D3',
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  stateItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#D3D3D3',
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
});