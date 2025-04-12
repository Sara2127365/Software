import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Modal, FlatList, StyleSheet,
  ScrollView, Pressable
} from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome from "react-native-vector-icons/FontAwesome";

const faculties = [
  'Faculty of Engineering',
  'Faculty of Medicine',
  'Faculty of Arts',
  'Faculty of Science',
  'Faculty of Business',
];

const states = [
  'Student',
  'Worker'
];

export default function SignUp() {
  const [facultyModalVisible, setFacultyModalVisible] = useState(false);
  const [stateModalVisible, setStateModalVisible] = useState(false);

  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [selectedState, setSelectedState] = useState(null);

  const router = useRouter();

  const handleSelectFaculty = (faculty) => {
    setSelectedFaculty(faculty);
    setFacultyModalVisible(false);
  };

  const handleSelectState = (state) => {
    setSelectedState(state);
    setStateModalVisible(false);
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView style={styles.scroll}>
        <Text style={styles.title}>Create New Account</Text>

        {/* Fullname */}
        <View style={styles.contianericon}>
          <FontAwesome name={"user"} size={24} color={"#9A9A9A"} style={styles.inputIcon} />
          <TextInput style={styles.textinput} placeholder="Fullname" />
        </View>

        {/* Email */}
        <View style={styles.contianericon}>
          <FontAwesome name={"envelope"} size={24} color={"#9A9A9A"} style={styles.inputIcon} />
          <TextInput style={styles.textinput} placeholder="Email" />
        </View>

        {/* Phone */}
        <View style={styles.contianericon}>
          <FontAwesome name={"phone"} size={24} color={"#9A9A9A"} style={styles.inputIcon} />
          <TextInput style={styles.textinput} placeholder="Phone" />
        </View>

        {/* Faculty Dropdown */}
        <View style={styles.contianericon}>
          <FontAwesome name={"university"} size={24} color={"#9A9A9A"} style={styles.inputIcon} />
          <TouchableOpacity style={styles.dropdownButton} onPress={() => setFacultyModalVisible(true)}>
            <Text style={styles.dropdownText}>
              {selectedFaculty || 'Select Faculty'}
            </Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={facultyModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setFacultyModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPressOut={() => setFacultyModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <FlatList
                data={faculties}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.option}
                    onPress={() => handleSelectFaculty(item)}
                  >
                    <Text style={styles.optionText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>

        {/* State Dropdown */}
        <View style={styles.contianericon}>
          <FontAwesome name={"user-circle"} size={24} color={"#9A9A9A"} style={styles.inputIcon} />
          <TouchableOpacity style={styles.dropdownButton} onPress={() => setStateModalVisible(true)}>
            <Text style={styles.dropdownText}>
              {selectedState || 'Select State'}
            </Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={stateModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setStateModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPressOut={() => setStateModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <FlatList
                data={states}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.option}
                    onPress={() => handleSelectState(item)}
                  >
                    <Text style={styles.optionText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Password */}
        <View style={styles.contianericon}>
          <FontAwesome name={"lock"} size={24} color={"#9A9A9A"} style={styles.inputIcon} />
          <TextInput style={styles.textinput} placeholder="Password" secureTextEntry={true} />
          <Pressable onPress={() => router.push('/auth/resetpassword')}>
            <Text style={{ color: 'red', fontFamily: 'outfit-bold' }}>Forget password</Text>
          </Pressable>
        </View>

        {/* SignUp Button */}
        <TouchableOpacity style={styles.signupButton}>
          <Text style={styles.signupText}>Sign Up</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 20,
    padding: 15,
    alignItems: 'center'
  },
  scroll: {
    width: '100%'
  },
  title: {
    fontSize: 30,
    fontFamily: 'outfit-bold',
    marginBottom: 20
  },
  contianericon: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    borderRadius: 20,
    elevation: 10,
    marginVertical: 10,
    alignItems: "center",
    paddingHorizontal: 15,
    height: 50,
    width: '100%'
  },
  inputIcon: {
    marginRight: 10
  },
  textinput: {
    flex: 1
  },
  dropdownButton: {
    flex: 1,
    padding: 10
  },
  dropdownText: {
    fontSize: 16,
    color: '#333'
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
    elevation: 5,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    fontSize: 15,
  },
  signupButton: {
    padding: 15,
    backgroundColor: 'red',
    width: '100%',
    marginTop: 15,
    borderRadius: 15
  },
  signupText: {
    fontFamily: 'outfit',
    fontSize: 20,
    color: 'white',
    textAlign: 'center'
  }
});
