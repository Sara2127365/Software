import React from 'react';
import { View, Text, StyleSheet, FlatList, useWindowDimensions } from 'react-native';

const teamData = [
    { id: '1', name: 'Uosry', role: 'Team Member', bio: 'Uosry is responsible for leading the team, ensuring smooth collaboration, and making key decisions.' },
    { id: '2', name: 'Lekaa', role: 'Team Member', bio: 'Lekaa is a skilled developer who focuses on front-end development and user experience.' },
    { id: '3', name: 'kareem', role: 'Team Member', bio: 'kareem is specializes in back-end development, focusing on API integration and server-side logic.' },
    { id: '4', name: 'Mo3tasem', role: 'Team Member', bio: 'Mo3tasem excels in back-end development, optimizing database performance and scalability.' },
    { id: '5', name: 'Yasmen', role: 'Team Member', bio: 'Yasmen is a back-end developer with expertise in cloud infrastructure and deployment.' },
    { id: '6', name: 'Sara', role: 'Team Member', bio: 'Sara focuses on back-end security, ensuring the app is robust and protected.' },
];

const About = () => {
    const { width } = useWindowDimensions();

    const sections = [
        { type: 'header', id: 'header' },
        { type: 'aboutToomia', id: 'aboutToomia' },
        { type: 'mission', id: 'mission' },
        { type: 'offer', id: 'offer' },
        { type: 'teamTitle', id: 'teamTitle' },
        { type: 'teamDescription', id: 'teamDescription' },
        ...teamData.map(member => ({ type: 'teamMember', ...member })),
    ];

    const renderItem = ({ item }) => {
        switch (item.type) {
            case 'header':
                return (
                    <View style={styles.header}>
                        <Text style={[styles.headerText, { fontSize: width * 0.1 }]}>Toomia</Text>
                    </View>
                );
            case 'aboutToomia':
                return (
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { fontSize: width * 0.06 }]}>About Toomia 🍔🎓</Text>
                        <Text style={[styles.description, { fontSize: width * 0.04 }]}>
                            Toomia is your trusted food delivery service designed exclusively for university students, faculty, and staff. We connect you with your favorite on-campus restaurants, making it easier than ever to enjoy fresh and tasty meals without leaving your study zone.
                        </Text>
                    </View>
                );
            case 'mission':
                return (
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { fontSize: width * 0.06 }]}>Our Mission 🎯</Text>
                        <Text style={[styles.description, { fontSize: width * 0.04 }]}>
                            To make campus life more convenient by bringing your favorite meals right to your doorstep – whether you’re in the dorms, library, or chilling in the student lounge.
                        </Text>
                    </View>
                );
            case 'offer':
                return (
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { fontSize: width * 0.06 }]}>What We Offer 🍕</Text>
                        <View style={styles.offerList}>
                            <Text style={[styles.offerItem, { fontSize: width * 0.04 }]}>
                                <Text style={styles.bullet}>➔ </Text>A wide selection of campus restaurant menus
                            </Text>
                            <Text style={[styles.offerItem, { fontSize: width * 0.04 }]}>
                                <Text style={styles.bullet}>➔ </Text>Fast, reliable, and student-friendly delivery
                            </Text>
                            <Text style={[styles.offerItem, { fontSize: width * 0.04 }]}>
                                <Text style={styles.bullet}>➔ </Text>Exclusive student discounts and deals
                            </Text>
                        </View>
                    </View>
                );
            case 'teamTitle':
                return (
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { fontSize: width * 0.06 }]}>Meet the Team 👥</Text>
                    </View>
                );
            case 'teamDescription':
                return (
                    <View style={styles.section}>
                        <Text style={[styles.description, { fontSize: width * 0.04 }]}>
                            Behind Toomia is a group of passionate students who love food just as much as they love building cool things. We’re on a mission to improve campus life – one delivery at a time.
                        </Text>
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
            default:
                return null;
        }
    };

    return (
        <FlatList
            data={sections}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[styles.container, { padding: width * 0.05 }]}
            showsVerticalScrollIndicator={true}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },
    header: {
        alignItems: 'center',
        marginBottom: 16,
    },
    headerText: {
        fontWeight: 'bold',
        color: '#FF6969',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#FF6969',
    },
    description: {
        color: '#000',
    },
    offerList: {
        marginTop: 8,
    },
    offerItem: {
        color: '#000',
        marginBottom: 4,
    },
    bullet: {
        color: '#FF6969',
    },
    teamMember: {
        marginBottom: 16,
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
});

export default About;