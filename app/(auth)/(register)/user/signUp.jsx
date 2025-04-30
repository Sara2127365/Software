import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Modal, FlatList, StyleSheet,
  ScrollView, Image
} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';

const faculties = [
  'Faculty of Engineering',
  'Faculty of Medicine',
  'Faculty of Arts',
  'Faculty of Science',
  'Faculty of Business',
];

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
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*'
      });
      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setFormData(prev => ({ ...prev, [id]: file }));
      }
    } catch (err) {
      console.error('Error picking file:', err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <AntDesign
          onPress={() => router.back()}
          name="arrowleft"
          size={24}
          color="#CC4C4C"
        />
        <Text style={styles.headerTitle}>Create user account</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
        {/* User Image */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarCircle}>
            {formData.logo ? (
              <Image
                source={{ uri: formData.logo.uri }}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            ) : (
              <FontAwesome name="user" size={48} color="white" />
            )}
            <TouchableOpacity
              onPress={() => pickFile('logo')}
              style={styles.cameraIcon}
            >
              <Feather name="camera" size={18} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Input Fields */}
        <View style={styles.all}>
        <View style={styles.inputContainer}>
          <FontAwesome name="user" size={20} color="#9A9A9A" />
          <TextInput
            style={styles.input}
            placeholder="Full name"
            value={formData.fullname}
            onChangeText={(text) => setFormData(prev => ({ ...prev, fullname: text }))}
          />
        </View>

        <View style={styles.inputContainer}>
          <FontAwesome name="envelope" size={20} color="#9A9A9A" />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={formData.email}
            onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
          />
        </View>

        <View style={styles.inputContainer}>
          <FontAwesome name="phone" size={20} color="#9A9A9A" />
          <TextInput
            style={styles.input}
            placeholder="Phone number"
            value={formData.phone}
            onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
          />
        </View>

        <View style={styles.inputContainer}>
          <FontAwesome name="university" size={20} color="#9A9A9A" />
          <TouchableOpacity style={styles.input} onPress={() => setFacultyModalVisible(true)}>
            <Text style={styles.dropdownText}>{selectedFaculty || 'Faculty'}</Text>
          </TouchableOpacity>
        </View>

        {/* Faculty Modal */}
        <Modal visible={facultyModalVisible} transparent animationType="fade">
          <TouchableOpacity style={styles.modalOverlay} onPressOut={() => setFacultyModalVisible(false)}>
            <View style={styles.modalContent}>
              <FlatList
                data={faculties}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.option} onPress={() => handleSelectFaculty(item)}>
                    <Text style={styles.optionText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>

        <View style={styles.inputContainer}>
          <FontAwesome name="user-circle" size={20} color="#9A9A9A" />
          <TouchableOpacity style={styles.input} onPress={() => setStateModalVisible(true)}>
            <Text style={styles.dropdownText}>{selectedState || 'You are'}</Text>
          </TouchableOpacity>
        </View>

        {/* State Modal */}
        <Modal visible={stateModalVisible} transparent animationType="fade">
          <TouchableOpacity style={styles.modalOverlay} onPressOut={() => setStateModalVisible(false)}>
            <View style={styles.modalContent}>
              <FlatList
                data={states}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.option} onPress={() => handleSelectState(item)}>
                    <Text style={styles.optionText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>

        <View style={styles.inputContainer}>
          <FontAwesome name="lock" size={20} color="#9A9A9A" />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={formData.password}
            onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
          />
        </View>
        </View>

        {/* Register Button */}
        <TouchableOpacity style={styles.registerButton}>
          <Text style={styles.registerText}>Register</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(242,242,242,1)',
    paddingTop: 10,
    marginBottom:20
  },
  all:{
    paddingTop:10,
    borderRadius:12,
    marginBottom:20,
    backgroundColor:'#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    color: '#3F3F3F',
    fontWeight: '500',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFBABA',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    position: 'absolute'
  },
  cameraIcon: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#FF6969',
    borderRadius: 20,
    padding: 6,
    borderWidth: 2,
    borderColor: 'white'
  },
  inputContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    marginLeft:10,
    marginRight:10,
    paddingHorizontal:12,
    borderWidth: 1,
    borderColor: '#ddd', // حدود خفيفة زي الصورة
    paddingHorizontal: 12,
    height: 50,
    
  },
  input: {
    flex: 1,
    marginLeft: 8,
    color: '#333',
    fontSize:16,
    textAlign:'left'
  },
  dropdownText: {
    color: '#999',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContent: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
  },
  option: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    fontSize: 16,
    color: '#333'
  },
  registerButton: {
    backgroundColor: '#FF6969',
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40
  },
  registerText: {
    color: 'rgba(43,43,37,1)',
    fontSize: 18,
    fontWeight: 'bold'
  }
}); 