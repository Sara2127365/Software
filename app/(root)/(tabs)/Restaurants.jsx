import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    Image
} from 'react-native';
const data = [
    {
        id: '1',
        name: 'Test Name',
        rating: '4.5 ★',
        description: 'eat your favourite food beside ur fav drink ...',
        tags: ['food', 'drinks'],
        image: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Phoenicopterus_ruber_in_S%C3%A3o_Paulo_Zoo.jpg'
    },
    {
        id: '2',
        name: 'Test Name',
        rating: '4.5 ★',
        description: 'eat your favourite food beside ur fav drink ...',
        tags: ['food', 'drinks', 'coffee'],
        image: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Phoenicopterus_ruber_in_S%C3%A3o_Paulo_Zoo.jpg'
    },
    {
        id: '3',
        name: 'Test Name',
        rating: '4.5 ★',
        description: 'eat your favourite food beside ur fav drink ...',
        tags: ['food'],
        image: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Phoenicopterus_ruber_in_S%C3%A3o_Paulo_Zoo.jpg'
    }
];
// const getdata = collection(db, "resturant")
// const getres = async () => {
//     try {
//         const data = await getDocs(getdata)
//         console.log(data.docs.map((doc) => ({
//             ...doc.data(),
//             id: doc.id,
//         })));

//     }
//     catch (err) {
//         console.error(err)
//     }
// }
// useEffect(() => {
//     getres()
// }, [])

const Restaurants = () => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcomeText}>Welcome , User</Text>
                <Text style={styles.appName}>Toomila</Text>
            </View>

            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search ..."
                    placeholderTextColor="#999"
                />
            </View>

            <View style={styles.filterContainer}>
                <TouchableOpacity style={styles.filterButton}>
                    <Text style={styles.filterText}>category</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterButton}>
                    <Text style={styles.filterText}>rating</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterButton}>
                    <Text style={styles.filterText}>reset</Text>
                </TouchableOpacity>
            </View>

            {/* Main Content with FlatList */}
            <FlatList
                data={data}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        {/* Image at the top of the card */}
                        <Image
                            source={{ uri: item.image }}
                            style={styles.cardImage}
                            resizeMode="cover"
                        />
                        <View style={styles.cardContent}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardTitle}>
                                    {item.name}
                                </Text>
                                <Text style={styles.cardRating}>
                                    {item.rating}
                                </Text>
                            </View>
                            <Text style={styles.cardDescription}>
                                {item.description}
                            </Text>
                            <View style={styles.tagsContainer}>
                                {item.tags.map((tag, index) => (
                                    <View key={index} style={styles.tag}>
                                        <Text style={styles.tagText}>
                                            {tag}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                )}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
    },
    welcomeText: {
        fontSize: 18,
        color: '#333'
    },
    appName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#CC4C4C'
    },
    searchContainer: {
        marginBottom: 16
    },
    searchInput: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16
    },
    cardImage: {
        width: '100%',
        height: 140 // Matching the design height
    },
    filterContainer: {
        flexDirection: 'row',
        marginBottom: 16
    },
    filterButton: {
        marginRight: 12,
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: '#f0f0f0',
        borderRadius: 16
    },
    filterText: {
        color: '#CC4C4C',
        fontSize: 14
    },
    listContent: {
        paddingBottom: 20
    },
    card: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    cardRating: {
        fontSize: 16,
        color: '#FFA500' // Orange color for stars
    },
    cardDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    tag: {
        backgroundColor: '#FF6969',
        borderRadius: 12,
        paddingVertical: 4,
        paddingHorizontal: 10,
        marginRight: 8,
        marginBottom: 8
    },
    tagText: {
        fontSize: 12,
        color: 'black'
    }
});

export default Restaurants;
