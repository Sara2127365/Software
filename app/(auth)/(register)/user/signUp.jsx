import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, FlatList, StyleSheet, ScrollView, Image, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';

const faculties = ['Faculty of Science', 'Faculty of Arts', 'Faculty of Business', 'Faculty of Law', 'Faculty of Archaeology', 'Faculty of Urban Planning', 'Faculty of Dar Al Uloom', 'Faculty of Mass Communication'];
const states = ['Student', 'Worker'];

export default function SignUp() {
  const router = useRouter();
  const [facultyModalVisible, setFacultyModalVisible] = useState(false);
  const [stateModalVisible, setStateModalVisible] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
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
      const result = await DocumentPicker.getDocumentAsync({ type: 'image/*', copyToCacheDirectory: true, multiple: false });
      if (!result.canceled && result.assets?.length > 0) {
        const file = result.assets[0];
        setFormData(prev => ({ ...prev, [id]: file }));
      }
    } catch (err) {
      console.error('Error picking file:', err);
    }
  };

  const handleRegisterSubmit = () => {
    if (!formData.fullname || !formData.email || !formData.phone || !formData.password || !selectedFaculty || !selectedState) {
      alert('Please fill in all fields');
      return;
    }

    const userData = { ...formData, faculty: selectedFaculty, state: selectedState };
    
    // تسجيل المستخدم (إذا كنتِ تستخدمين backend helper أو Firebase، استخدميه هنا)
    // handleRegister(userData);

    // الانتقال إلى صفحة الـ Login بعد التسجيل
    try {
      router.push('/LoginPage');  // الانتقال إلى صفحة تسجيل الدخول بعد إتمام التسجيل
    } catch (error) {
      console.error("Navigation error:", error);
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
          <TextInput style={styles.input} placeholder="Full name" value={formData.fullname} onChangeText={(text) => setFormData(prev => ({ ...prev, fullname: text }))} />
          <TextInput style={styles.input} placeholder="Email" value={formData.email} onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))} />
          <TextInput style={styles.input} placeholder="Phone number" value={formData.phone} onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))} />
          <TouchableOpacity style={styles.input} onPress={() => setFacultyModalVisible(true)}>
            <Text>{selectedFaculty || 'Select Faculty'}</Text>
          </TouchableOpacity>
          <Modal visible={facultyModalVisible} transparent animationType="fade">
            <TouchableWithoutFeedback onPress={() => setFacultyModalVisible(false)}>
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <FlatList data={faculties} renderItem={({ item }) => <TouchableOpacity onPress={() => handleSelectFaculty(item)}><Text>{item}</Text></TouchableOpacity>} />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
          <TouchableOpacity style={styles.input} onPress={() => setStateModalVisible(true)}>
            <Text>{selectedState || 'Select State'}</Text>
          </TouchableOpacity>
          <Modal visible={stateModalVisible} transparent animationType="fade">
            <TouchableWithoutFeedback onPress={() => setStateModalVisible(false)}>
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <FlatList data={states} renderItem={({ item }) => <TouchableOpacity onPress={() => handleSelectState(item)}><Text>{item}</Text></TouchableOpacity>} />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
          <TextInput style={styles.input} placeholder="Password" secureTextEntry value={formData.password} onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))} />
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
  input: { 
    borderWidth: 1, 
    borderColor: '#D3D3D3', 
    padding: 12, 
    borderRadius: 8, 
    marginBottom: 20, 
    fontSize: 16, 
    backgroundColor: '#fff' 
  },
  registerButton: {
    backgroundColor: '#FF6969', 
    paddingVertical: 12, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginTop: 30,
  },
  registerText: {
    color: 'bold', 
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
});
