import React from 'react';
import { View, Text, StyleSheet, FlatList, useWindowDimensions, SafeAreaView } from 'react-native';

const privacyPolicyData = [
  {
    id: 'header',
    type: 'header',
    title: 'Privacy Policy',
  },
  {
    id: 'effectiveDate',
    type: 'description',
    text: 'Effective Date: April 30, 2025',
  },
  {
    id: 'intro',
    type: 'description',
    text:
      'Welcome to Toomia, your go-to food delivery app for university students. At Toomia, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, share, and safeguard your data when you use our app. By using Toomia, you agree to the terms outlined below.',
  },
  {
    id: 'collectTitle',
    type: 'sectionTitle',
    title: '1. Information We Collect',
  },
  {
    id: 'collectDescription',
    type: 'description',
    text:
      'We collect information to provide and improve our services. This includes:',
  },
  {
    id: 'collectProvided',
    type: 'listItem',
    text:
      '• Account Information: When you sign up, we may collect your name, email address, phone number, and university affiliation.',
  },
  {
    id: 'collectOrder',
    type: 'listItem',
    text:
      '• Order Information: When you place an order, we collect details like items ordered, delivery address (e.g., campus location), and payment information.',
  },
  {
    id: 'collectLocation',
    type: 'listItem',
    text:
      '• Location Data: With your permission, we collect your device’s location to suggest nearby restaurants or facilitate delivery.',
  },
  {
    id: 'collectUsage',
    type: 'listItem',
    text:
      '• Usage Data: We collect information about how you use the app, such as pages visited and features used.',
  },
  {
    id: 'useTitle',
    type: 'sectionTitle',
    title: '2. How We Use Your Information',
  },
  {
    id: 'useDescription',
    type: 'description',
    text:
      'We use your information to: process and fulfill your orders, provide personalized restaurant recommendations, improve the app’s functionality, and communicate with you about orders or promotions (you can opt out of marketing emails).',
  },
  {
    id: 'shareTitle',
    type: 'sectionTitle',
    title: '3. How We Share Your Information',
  },
  {
    id: 'shareDescription',
    type: 'description',
    text:
      'We do not sell your personal information. We may share your data with restaurants to process orders, delivery partners for order fulfillment, or trusted service providers (e.g., payment processors) who help us operate the app. We may also share data if required by law.',
  },
  {
    id: 'protectTitle',
    type: 'sectionTitle',
    title: '4. How We Protect Your Information',
  },
  {
    id: 'protectDescription',
    type: 'description',
    text:
      'We use encryption, secure authentication, and other measures to protect your data. However, no internet-based service is 100% secure, and we cannot guarantee absolute security.',
  },
  {
    id: 'rightsTitle',
    type: 'sectionTitle',
    title: '5. Your Choices and Rights',
  },
  {
    id: 'rightsDescription',
    type: 'description',
    text:
      'You can update your account information, disable location sharing, opt out of promotional emails, or request account deletion by contacting us at support@toomia.com.',
  },
  {
    id: 'contactTitle',
    type: 'sectionTitle',
    title: '6. Contact Us',
  },
  {
    id: 'contactDescription',
    type: 'description',
    text:
      'If you have questions about this Privacy Policy, please reach out to us at support@toomia.com.',
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
