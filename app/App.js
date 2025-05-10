
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Cart from './(root)/(tabs)/Cart'; // المسار إلى صفحة الكارت
import Checkout from './(root)/(tabs)/Checkout'; // المسار إلى صفحة التشيك أوت

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Cart">

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
