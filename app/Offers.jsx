import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase/config';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchOffers() {
      const offersSnap = await getDocs(collection(db, 'offers'));
      const offersData = offersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOffers(offersData);
    }

    fetchOffers();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.desc}>{item.offer}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
  <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
    <Ionicons name="arrow-back" size={24} color="#333" />
    <Text style={styles.title}>Offers</Text>
  </TouchableOpacity>
</View>


      <FlatList
        data={offers}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={renderItem}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    width: '48%',
  },
  image: {
    width: '100%',
    height: 120,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    margin: 8,
  },
  desc: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 8,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 8,
  },  
});

export default Offers;
