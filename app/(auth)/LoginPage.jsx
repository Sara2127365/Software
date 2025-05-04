import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { emailIcon, passwordIcon } from '../../constants/icons';
import Input from '../../common/Input';
import LargeBtn from '../../common/LargeBtn';
import { handleLogin } from '../../utils/backend helpers/authCalls';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  function handleChange(value, id) {
    setFormData(old => ({ ...old, [id]: value }));
  }

  async function handleSubmit() {
    const result = await handleLogin(formData);
    if (result) {
      router.replace('/');
      AsyncStorage.setItem('status', 'true');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Toomiia</Text>
        </View>
        <View style={styles.inputContainer}>
          <Input
            type="email"
            value={formData.email}
            onChange={value => handleChange(value, 'email')}
            placeholder="email"
            icon={emailIcon()}
          />
          <Input
            value={formData.password}
            onChange={value => handleChange(value, 'password')}
            type="password"
            placeholder="password"
            icon={passwordIcon()}
          />
          <LargeBtn
            onPress={handleSubmit}
            text="Login"
            classes="py-4 mt-4 w-full bg-main-rose rounded-xl"
            textClasses="text-lg"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 60,
    alignItems: 'center',
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 36,
    color: '#F04E23',
    fontWeight: 'bold',
  },
  inputContainer: {
    width: '100%',
    gap: 20,
  }
});

export default LoginPage;
