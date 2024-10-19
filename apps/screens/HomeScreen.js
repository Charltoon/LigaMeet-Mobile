import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Ensure this import matches your setup

const HomeScreen = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => setIsDarkMode(prevMode => !prevMode);

  const theme = {
    background: isDarkMode ? '#121212' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    primary: '#FF4136',
    secondary: isDarkMode ? '#1E1E1E' : '#F0F0F0',
    accent: '#FF725C',
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={[styles.logo, { color: theme.primary }]}>LigaMeet</Text>
          <View style={styles.headerRight}>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={styles.upcomingMatches}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Upcoming Matches</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[1, 2, 3].map((item) => (
              <View key={item} style={[styles.matchCard, { backgroundColor: theme.secondary }]}>
                <Text style={[styles.matchTitle, { color: theme.text }]}>City Strikers vs. United Kickers</Text>
                <Text style={[styles.matchInfo, { color: theme.text }]}>Today, 7:00 PM</Text>
                <Text style={[styles.matchVenue, { color: theme.text }]}>Central Stadium</Text>
                <TouchableOpacity style={[styles.joinButton, { backgroundColor: theme.primary }]}>
                  <Text style={styles.joinButtonText}>Join</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.recentActivity}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Activity</Text>
          {[1, 2, 3].map((item) => (
            <View key={item} style={[styles.activityItem, { backgroundColor: theme.secondary }]}>
              <Icon name="basketball-outline" size={24} color={theme.primary} />
              <View style={styles.activityContent}>
                <Text style={[styles.activityTitle, { color: theme.text }]}>New match near you!</Text>
                <Text style={[styles.activityInfo, { color: theme.text }]}>5v5 • 3 km away • 2 spots left</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileButton: {
    padding: 4,
    marginLeft: 16,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
  },
  actionButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    width: '45%',
  },
  actionButtonText: {
    marginTop: 8,
    fontSize: 14,
  },
  upcomingMatches: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  matchCard: {
    borderRadius: 8,
    padding: 16,
    marginRight: 12,
    width: 250,
  },
  matchTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  matchInfo: {
    fontSize: 14,
    marginBottom: 4,
  },
  matchVenue: {
    fontSize: 14,
    marginBottom: 12,
  },
  joinButton: {
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  recentActivity: {
    padding: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  activityContent: {
    marginLeft: 12,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  activityInfo: {
    fontSize: 12,
  },
});

export default HomeScreen;