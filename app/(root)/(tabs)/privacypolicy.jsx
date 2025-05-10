
import React from 'react';
import { View, Text, StyleSheet, FlatList, useWindowDimensions, SafeAreaView } from 'react-native';

const privacyPolicyData = [
  {
    id: 'header',
    type: 'header',
    title: 'Privacy Policy 🍔',
  },
  {
    id: 'intro',
    type: 'description',
    text:
      'Hey there! Welcome to Toomia, the app that gets you food from campus restaurants fast. We care about your privacy, so here’s the deal on how we handle your info. Using Toomia means you’re cool with this!',
  },
  {
    id: 'collectTitle',
    type: 'sectionTitle',
    title: 'What We Collect 📋',
  },
  {
    id: 'collectDescription',
    type: 'description',
    text:
      'To make Toomia work, we grab some info like:',
  },
  {
    id: 'collectItems',
    type: 'listItem',
    text:
      '• Your name, email, and phone number when you sign up.',
  },
  {
    id: 'collectOrder',
    type: 'listItem',
    text:
      '• Stuff like what you ordered and where to deliver it (like your dorm or library spot).',
  },
  {
    id: 'collectLocation',
    type: 'listItem',
    text:
      '• Your location (only if you say it’s okay) to find restaurants near you.',
  },
  {
    id: 'useTitle',
    type: 'sectionTitle',
    title: 'What We Do With It 🛠️',
  },
  {
    id: 'useDescription',
    type: 'description',
    text:
      'We use your info to get your food to you, suggest cool restaurants, and make the app better. We might also send you deals (but you can tell us to stop).',
  },
  {
    id: 'shareTitle',
    type: 'sectionTitle',
    title: 'Who We Share It With 🤝',
  },
  {
    id: 'shareDescription',
    type: 'description',
    text:
      'We don’t sell your info, promise! We only share it with restaurants to make your order happen or with delivery guys to get your food to you. We might have to share it if the law asks us to.',
  },
  {
    id: 'protectTitle',
    type: 'sectionTitle',
    title: 'How We Keep It Safe 🔒',
  },
  {
    id: 'protectDescription',
    type: 'description',
    text:
      'We lock your info up tight with cool tech stuff like encryption. But, you know, nothing online is 100% hacker-proof.',
  },
  {
    id: 'yourRightsTitle',
    type: 'sectionTitle',
    title: 'Your Choices ✌️',
  },
  {
    id: 'yourRightsDescription',
    type: 'description',
    text:
      'Wanna change your info or stop sharing your location? You can do that in the app. If you want to delete your account, just hit us up at support@toomia.com.',
  },
  {
    id: 'contactTitle',
    type: 'sectionTitle',
    title: 'Got Questions? 📩',
  },
  {
    id: 'contactDescription',
    type: 'description',
    text:
      'If you’re curious about anything, shoot us an email at support@toomia.com, and we’ll sort you out!',
  },
];

const PrivacyPolicy = () => {
  const { width } = useWindowDimensions();

  const renderItem = ({ item }) => {
    switch (item.type) {
      case 'header':
        return (
          <View style={styles.header}>
            <Text style={[styles.headerText, { fontSize: width * 0.1 }]}>
              {item.title}
            </Text>
          </View>
        );
      case 'sectionTitle':
        return (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { fontSize: width * 0.06 }]}>
              {item.title}
            </Text>
          </View>
        );
      case 'description':
        return (
          <View style={styles.section}>
            <Text style={[styles.description, { fontSize: width * 0.04 }]}>
              {item.text}
            </Text>
          </View>
        );
      case 'listItem':
        return (
          <View style={styles.section}>
            <Text style={[styles.offerItem, { fontSize: width * 0.04 }]}>
              <Text style={styles.bullet}>➔ </Text>
              {item.text}
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={privacyPolicyData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.container,
          { padding: width * 0.05, paddingBottom: 50 },
        ]}
        showsVerticalScrollIndicator={true}
        style={styles.flatList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flatList: {
    flex: 1,
  },
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
  offerItem: {
    color: '#000',
    marginBottom: 4,
  },
  bullet: {
    color: '#FF6969',
  },
});

export default PrivacyPolicy;
