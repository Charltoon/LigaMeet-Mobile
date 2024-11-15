import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('teams');

  const user = {
    username: 'Jay Montebon',
    sport: 'Basketball',
    gamesPlayed: 10,
    points: 15.5,
    assists: 5.2,
  };

  const team = {
    name: 'Lion',
    coach: 'Tab Baldwin',
    members: ['Jay Montebon', 'Manuel Amante', 'Frime Baculao'],
  };

  const recentActivities = [
    { id: 1, description: 'Joined a new team', timestamp: '2023-11-14 14:30' },
    { id: 2, description: 'Played a match', timestamp: '2023-11-13 18:00' },
  ];

  const invitations = [
    { id: 1, teamName: 'Rockets' },
    { id: 2, teamName: 'Comets' },
  ];

  const teams = [
    { id: 1, name: 'Eagles', type: 'Basketball' },
    { id: 2, name: 'Sharks', type: 'Volleyball' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Player Dashboard</Text>
        
        <View style={styles.header}>
          <Image
            source={{ uri: 'https://via.placeholder.com/100' }}
            style={styles.avatar}
          />
          <Text style={styles.username}>Welcome, {user.username}!</Text>
          <Text style={styles.sport}>Sport: {user.sport}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.gamesPlayed}</Text>
            <Text style={styles.statLabel}>Games Played</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.points}</Text>
            <Text style={styles.statLabel}>PPG</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.assists}</Text>
            <Text style={styles.statLabel}>APG</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Team: {team.name}</Text>
          <Text style={styles.coachText}>Coach: {team.coach}</Text>
          <Text style={styles.membersText}>Members:</Text>
          {team.members.map((member, index) => (
            <Text key={index} style={styles.memberItem}>{member}</Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {recentActivities.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <Text style={styles.activityDescription}>{activity.description}</Text>
              <Text style={styles.activityTimestamp}>{activity.timestamp}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Invitations</Text>
          {invitations.map((invitation) => (
            <View key={invitation.id} style={styles.invitation}>
              <Text style={styles.invitationText}>
                {invitation.teamName} invited you to join
              </Text>
              <View style={styles.invitationButtons}>
                <TouchableOpacity style={[styles.button, styles.acceptButton]}>
                  <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.declineButton]}>
                  <Text style={styles.buttonText}>Decline</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8FB',
    padding: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#1F2D3D',
    textAlign: 'center',
    marginVertical: 25,
    fontFamily: 'Roboto',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#1F2D3D',
  },
  role: {
    fontSize: 14,
    color: '#3C4858',
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 15,
  },
  statItem: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2D3D',
  },
  statLabel: {
    fontSize: 14,
    color: '#3C4858',
  },
  section: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1F2D3D',
  },
  coachText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3C4858',
    marginBottom: 5,
  },
  membersText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3C4858',
    marginBottom: 5,
  },
  memberItem: {
    color: '#3C4858',
    marginBottom: 5,
    paddingLeft: 10, 
    fontSize: 14,
  },
  activityItem: {
    marginBottom: 10,
    paddingLeft: 10, 
  },
  activityDescription: {
    color: '#3C4858',
    fontWeight: '600',
  },
  activityTimestamp: {
    color: '#888',
    fontSize: 12,
  },
  invitation: {
    marginBottom: 15,
  },
  invitationText: {
    color: '#1F2D3D',
  },
  invitationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  declineButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default Dashboard;
