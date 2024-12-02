import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const HomeScreen = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const theme = {
    background: '#FFFFFF',
    text: '#000000',
    primary: '#FF4136',
    secondary: '#F0F0F0',
    accent: '#FF725C',
    cancelled: '#FF6F61', // Color for cancelled events
  };

  useEffect(() => {
    fetch('http://192.168.1.2:8000/api/events/')
      .then((response) => response.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching events:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </SafeAreaView>
    );
  }

  const categorizedEvents = {
    upcoming: events.filter(event => event.status === 'open'),
    ongoing: events.filter(event => event.status === 'ongoing'),
    cancelled: events.filter(event => event.status === 'cancelled'),
    top: events, // Replace with logic to get top events if needed
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
            {categorizedEvents.upcoming.length > 0 ? (
              categorizedEvents.upcoming.map((event) => (
                <View key={event.id} style={[styles.eventCard, { backgroundColor: theme.secondary }]}>
                  <View style={styles.cardContent}>
                    <Image
                      source={{ uri: event.image || 'https://via.placeholder.com/250x150' }}
                      style={styles.eventImage}
                    />
                    <Text style={[styles.eventTitle, { color: theme.text }]}>{event.name}</Text>
                    <Text style={[styles.eventDate, { color: theme.text }]}>{new Date(event.date_start).toLocaleString()}</Text>
                    <Text style={[styles.eventLocation, { color: theme.text }]}>{event.location}</Text>
                  </View>
                  <TouchableOpacity style={[styles.moreInfoButton, { backgroundColor: theme.accent }]}>
                    <Text style={styles.moreInfoButtonText}>More Info</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={[styles.noEventsText, { color: theme.text }]}>No upcoming events available.</Text>
            )}
          </ScrollView>
        </View>

        {/* Ongoing Events Section */}
        <View style={styles.eventsSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Ongoing Events</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categorizedEvents.ongoing.length > 0 ? (
              categorizedEvents.ongoing.map((event) => (
                <View key={event.id} style={[styles.eventCard, { backgroundColor: theme.secondary }]}>
                  <View style={styles.cardContent}>
                    <Image
                      source={{ uri: event.image || 'https://via.placeholder.com/250x150' }}
                      style={styles.eventImage}
                    />
                    <Text style={[styles.eventTitle, { color: theme.text }]}>{event.name}</Text>
                    <Text style={[styles.eventDate, { color: theme.text }]}>{new Date(event.date_start).toLocaleString()}</Text>
                    <Text style={[styles.eventLocation, { color: theme.text }]}>{event.location}</Text>
                  </View>
                  <TouchableOpacity style={[styles.moreInfoButton, { backgroundColor: theme.accent }]}>
                    <Text style={styles.moreInfoButtonText}>More Info</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={[styles.noEventsText, { color: theme.text }]}>No ongoing events available.</Text>
            )}
          </ScrollView>
        </View>

        {/* Cancelled Events Section */}
        <View style={styles.eventsSection}>
          <Text style={[styles.sectionTitle, { color: theme.cancelled }]}>Cancelled Events</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categorizedEvents.cancelled.length > 0 ? (
              categorizedEvents.cancelled.map((event) => (
                <View key={event.id} style={[styles.eventCard, { backgroundColor: theme.secondary }]}>
                  <View style={styles.cardContent}>
                    <Image
                      source={{ uri: event.image || 'https://via.placeholder.com/250x150' }}
                      style={styles.eventImage}
                    />
                    <Text style={[styles.eventTitle, { color: theme.text }]}>{event.name}</Text>
                    <Text style={[styles.eventDate, { color: theme.text }]}>{new Date(event.date_start).toLocaleString()}</Text>
                    <Text style={[styles.eventLocation, { color: theme.text }]}>{event.location}</Text>
                  </View>
                  <TouchableOpacity style={[styles.moreInfoButton, { backgroundColor: theme.accent }]}>
                    <Text style={styles.moreInfoButtonText}>More Info</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={[styles.noEventsText, { color: theme.cancelled }]}>No cancelled events available.</Text>
            )}
          </ScrollView>
        </View>


        {/* Top Sports Events Section */}
        <View style={styles.topEvents}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Top Sports Events</Text>
          {categorizedEvents.top.slice(0, 4).map((event) => ( // Limit to the first 4 events
            <View key={event.id} style={[styles.topEventCard, { backgroundColor: theme.secondary }]}>
              <Icon name="trophy-outline" size={28} color={theme.primary} style={styles.eventIcon} />
              <View style={styles.topEventContent}>
                <Text style={[styles.eventTitle, { color: theme.text }]}>{event.name}</Text>
                <Text style={[styles.eventDate, { color: theme.text }]}>{new Date(event.date_start).toLocaleString()}</Text>
                <Text style={[styles.eventLocation, { color: theme.text }]}>{event.location}</Text>
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
    minHeight: 300, // Ensures all cards are at least the same height
    justifyContent: 'space-between', // Distributes content evenly
  },
  eventImage: {
    width: '100%',
    height: 120, // Ensures consistent image size
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
    alignSelf: 'center', // Ensures buttons are consistently centered
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  liveButton: {
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'center',
  },
  liveButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  cancelledButton: {
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'center',
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
    alignSelf: 'center',
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
  noEventsText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default HomeScreen;
