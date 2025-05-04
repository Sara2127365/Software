// index.jsx
import React from 'react';
import { CartProvider } from './context/cartcontext';  // Ensure the path to CartContext is correct
import HomeScreen from './(root)/(tabs)/index';
import CartScreen from './(root)/(tabs)/Cart';  // Ensure the path to HomeScreen is correct

const App = () => {
    return (
        <CartProvider>
            <HomeScreen />
            <CartScreen/>
        </CartProvider>
    );
};

export default App;
