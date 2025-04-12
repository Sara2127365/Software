import React from 'react';
import { View, Text, StyleSheet, FlatList, useWindowDimensions } from 'react-native';

const teamData = [
    { id: '1', name: 'Uosry', role: 'Team Member', bio: 'Uosry is responsible for leading the team, ensuring smooth collaboration, and making key decisions.' },
    { id: '2', name: 'Lekaa', role: 'Team Member', bio: 'Lekaa is a skilled developer who focuses on front-end development and user experience.' },
    { id: '3', name: 'Nada', role: 'Team Member', bio: 'Nada specializes in back-end development and ensures the application runs smoothly.' },
    { id: '4', name: 'Mo3tasem', role: 'Team Member', bio: 'Nada specializes in back-end development and ensures the application runs smoothly.' },
    { id: '5', name: 'Yasmen', role: 'Team Member', bio: 'Nada specializes in back-end development and ensures the application runs smoothly.' },
    { id: '6', name: 'Sara', role: 'Team Member', bio: 'Nada specializes in back-end development and ensures the application runs smoothly.' },


];

const About = () => {
    const { width } = useWindowDimensions();

    const sections = [
        { type: 'header', id: 'header' },
        { type: 'about', id: 'about' },
        { type: 'teamTitle', id: 'teamTitle' },
        ...teamData.map(member => ({ type: 'teamMember', ...member })),
        { type: 'footer', id: 'footer' },
    ];

    const renderItem = ({ item }) => {
        switch (item.type) {
            case 'header':
                return (
                    <View style={[styles.smallHeader, { padding: width * 0.004 }]}>
                        <Text style={[styles.smallHeaderText, { fontSize: width * 0.06 }]}>About Us</Text>
                    </View>
                );
            case 'about':
                return (
                    <View style={styles.section}>
                        <Text style={[styles.title, { fontSize: width * 0.08 }]}>About Our Team</Text>
                        <Text style={[styles.description, { fontSize: width * 0.04 }]}>
                            We are a dedicated team working on an exciting Expo project. Our goal is to deliver a high-quality application that meets the needs of our users. Meet the team behind this project:
                        </Text>
                    </View>
                );
            case 'teamTitle':
                return (
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { fontSize: width * 0.06 }]}>Meet the Team</Text>
                    </View>
                );
            case 'teamMember':
                return (
                    <View style={styles.teamMember}>
                        <Text style={[styles.memberName, { fontSize: width * 0.05 }]}>{item.name}</Text>
                        <Text style={[styles.memberRole, { fontSize: width * 0.04 }]}>{item.role}</Text>
                        <Text style={[styles.memberBio, { fontSize: width * 0.035 }]}>{item.bio}</Text>
                    </View>
                );
            case 'footer':
                return (
                    <View style={[styles.smallFooter, { padding: width * 0.04 }]}>
                        <Text style={[styles.footerText, { fontSize: width * 0.035 }]}>© 2023 MyApp. All rights reserved.</Text>
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <Layout>

            <FlatList
                data={sections}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={[styles.container, { padding: width * 0.05 }]}
                showsVerticalScrollIndicator={true}
            />
        </Layout>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },
    smallHeader: {
        backgroundColor: '#CC4C4C',
        alignItems: 'center',
        marginBottom: 16,
        borderRadius: "10px"
    },
    smallHeaderText: {
        fontWeight: 'bold',
        color: '#fff',
    },
    section: {
        marginBottom: 10,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
        color: '#FF6969',
    },
    description: {
        textAlign: 'center',
        color: '#FF6969',
        marginBottom: 5,
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    teamMember: {
        marginBottom: 5,
    },
    memberName: {
        fontWeight: 'bold',
        color: '#FF6969',
    },
    memberRole: {
        color: '#CC4C4C',
        marginBottom: 8,
    },
    memberBio: {
        color: '#6B645D',
    },
    smallFooter: {
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#CC4C4C',
        marginTop: 24,
    },
    footerText: {
        color: '#666',
    },
});

export default About;