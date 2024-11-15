import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const HomeScreen = () => {
  const theme = {
    background: '#FFFFFF',
    text: '#000000',
    primary: '#FF4136',
    secondary: '#F0F0F0',
    accent: '#FF725C',
    cancelled: '#FF6F61', // Color for cancelled events
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={[styles.logo, { color: theme.primary }]}>LigaMeet</Text>
        </View>

        {/* Upcoming Events Section */}
        <View style={styles.eventsSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Upcoming Events</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[1, 2, 3].map((item) => (
              <View key={item} style={[styles.eventCard, { backgroundColor: theme.secondary }]}>
                <Image
                  source={{ uri: 'https://via.placeholder.com/250x150' }}
                  style={styles.eventImage}
                />
                <Text style={[styles.eventTitle, { color: theme.text }]}>Annual Sports Festival</Text>
                <Text style={[styles.eventDate, { color: theme.text }]}>November 25, 2024 - 9:00 AM</Text>
                <Text style={[styles.eventLocation, { color: theme.text }]}>Downtown Arena</Text>
                <TouchableOpacity style={[styles.registerButton, { backgroundColor: theme.primary }]}>
                  <Text style={styles.registerButtonText}>Register</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Ongoing Events Section */}
        <View style={styles.eventsSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Ongoing Events</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[1, 2].map((item) => (
              <View key={item} style={[styles.eventCard, { backgroundColor: theme.secondary }]}>
                <Image
                  source={{ uri: 'https://via.placeholder.com/250x150' }}
                  style={styles.eventImage}
                />
                <Text style={[styles.eventTitle, { color: theme.text }]}>Street Basketball Tournament</Text>
                <Text style={[styles.eventDate, { color: theme.text }]}>Today, 3:00 PM - 6:00 PM</Text>
                <Text style={[styles.eventLocation, { color: theme.text }]}>Central Park</Text>
                {/* <TouchableOpacity style={[styles.liveButton, { backgroundColor: theme.accent }]}>
                  <Text style={styles.liveButtonText}>Watch Live</Text>
                </TouchableOpacity> */}
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Cancelled Events Section */}
        <View style={styles.eventsSection}>
          <Text style={[styles.sectionTitle, { color: theme.cancelled }]}>Cancelled Events</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[1].map((item) => (
              <View key={item} style={[styles.eventCard, { backgroundColor: theme.secondary, borderColor: theme.cancelled, borderWidth: 2 }]}>
                <Image
                  source={{ uri: 'https://via.placeholder.com/250x150' }}
                  style={styles.eventImage}
                />
                <Text style={[styles.eventTitle, { color: theme.text }]}>Winter Sports Gala</Text>
                <Text style={[styles.eventDate, { color: theme.text }]}>December 5, 2024 - Cancelled</Text>
                <Text style={[styles.eventLocation, { color: theme.text }]}>Snowhill Stadium</Text>
                <TouchableOpacity style={[styles.cancelledButton, { backgroundColor: theme.cancelled }]}>
                  <Text style={styles.cancelledButtonText}>More Info</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Top Sports Events Section */}
        <View style={styles.topEvents}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Top Sports Events</Text>
          {[1, 2, 3].map((item) => (
            <View key={item} style={[styles.topEventCard, { backgroundColor: theme.secondary }]}>
              <Icon name="trophy-outline" size={28} color={theme.primary} style={styles.eventIcon} />
              <View style={styles.topEventContent}>
                <Text style={[styles.eventTitle, { color: theme.text }]}>Champions Cup Finals</Text>
                <Text style={[styles.eventDate, { color: theme.text }]}>December 20, 2024</Text>
                <Text style={[styles.eventLocation, { color: theme.text }]}>National Stadium</Text>
                <TouchableOpacity style={[styles.moreInfoButton, { backgroundColor: theme.accent }]}>
                  <Text style={styles.moreInfoButtonText}>More Info</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Featured Players Section */}
        <View style={styles.featuredPlayersSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Featured Players</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[1, 2, 3].map((item) => (
              <View key={item} style={[styles.playerCard, { backgroundColor: theme.secondary }]}>
                <Image
                  source={{ uri: 'https://via.placeholder.com/150' }}
                  style={styles.playerImage}
                />
                <Text style={[styles.playerName, { color: theme.text }]}>Mike Wazowski</Text>
                <Text style={[styles.playerSport, { color: theme.text }]}>Basketball</Text>
                <Text style={[styles.playerStats, { color: theme.text }]}>Top Scorer: 1200 Points</Text>
                <TouchableOpacity style={[styles.viewProfileButton, { backgroundColor: theme.primary }]}>
                  <Text style={styles.viewProfileButtonText}>View Profile</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
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
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  eventsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  eventCard: {
    borderRadius: 8,
    padding: 16,
    marginRight: 12,
    width: 250,
  },
  eventImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 14,
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 14,
    marginBottom: 12,
  },
  registerButton: {
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  liveButton: {
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  liveButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  cancelledButton: {
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  cancelledButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  topEvents: {
    padding: 16,
  },
  topEventCard: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  topEventContent: {
    marginLeft: 12,
    flex: 1,
  },
  moreInfoButton: {
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  moreInfoButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  featuredPlayersSection: {
    padding: 16,
  },
  playerCard: {
    borderRadius: 8,
    padding: 16,
    marginRight: 12,
    width: 180,
    alignItems: 'center',
  },
  playerImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  playerSport: {
    fontSize: 14,
    marginBottom: 4,
  },
  playerStats: {
    fontSize: 14,
    marginBottom: 8,
  },
  viewProfileButton: {
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'center',
  },
  viewProfileButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
