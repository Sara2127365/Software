import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function SignIn() {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Enter your Account</Text>

        {/* Email */}
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
            value={username}
            onChangeText={setUserName}
          />
        </View>

        {/* Password */}
        <View style={styles.contianericon}>
          <FontAwesome
            name={"lock"}
            size={24}
            color={"#9A9A9A"}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.textinput}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

       

        {/* Sign In Button */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        {/* Sign Up Redirect */}
        <Pressable onPress={() => router.push("/auth/signUp")}>
          <Text style={styles.signupText}>
            Don't have an account? Sign Up Here
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  scroll: {
    alignItems: "center",
    paddingBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginVertical: 20,
  },
  contianericon: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    borderRadius: 20,
    elevation: 5,
    marginVertical: 10,
    alignItems: "center",
    paddingHorizontal: 15,
    height: 50,
    width: "100%",
  },
  inputIcon: {
    marginRight: 10,
  },
  textinput: {
    flex: 1,
    fontSize: 16,
  },
  forgot: {
    color: "red",
    fontWeight: "bold",
    marginTop: 10,
    alignSelf: "flex-end",
  },
  button: {
    padding: 15,
    backgroundColor: "red",
    width: "100%",
    marginTop: 20,
    borderRadius: 15,
  },
  buttonText: {
    fontSize: 20,
    color: "white",
    textAlign: "center",
  },
  signupText: {
    color: "red",
    fontWeight: "bold",
    marginTop: 25,
    textAlign: "center",
  },
});

