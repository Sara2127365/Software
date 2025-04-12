import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function Resetpassword() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Enter your Email</Text>

        <View style={styles.contianericon}>
          <FontAwesome
            name={"envelope"}
            size={24}
            color={"#9A9A9A"}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.textinput}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Reset Password</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingHorizontal: 20
  },
  scrollContainer: {
    paddingBottom: 20
  },
  title: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
    fontWeight: 'bold'
  },
  contianericon: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    borderRadius: 20,
    elevation: 5,
    marginVertical: 20,
    alignItems: "center",
    paddingHorizontal: 15,
    height: 50
  },
  inputIcon: {
    marginRight: 10
  },
  textinput: {
    flex: 1,
    fontSize: 16
  },
  button: {
    padding: 15,
    backgroundColor: 'red',
    width: '100%',
    borderRadius: 15,
    marginTop: 15
  },
  buttonText: {
    fontFamily: 'outfit',
    fontSize: 20,
    color: 'white',
    textAlign: 'center'
  }
});
