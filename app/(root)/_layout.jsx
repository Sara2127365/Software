import { Slot } from 'expo-router';
import Toast from 'react-native-toast-message';
import { CartProvider } from '../context/cartcontext'; // تأكد من المسار الصحيح
import '../globals.css';

export default function RootLayout() {
  return (
    <CartProvider>
      <Slot />
      <Toast />
    </CartProvider>
  );
}
