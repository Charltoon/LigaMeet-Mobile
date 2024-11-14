import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const FindTeamScreen = () => {
  const [activeTab, setActiveTab] = useState('myTeam');

  const team = {
    name: 'Thunderbolts',
    coach: 'Mike Johnson',
    members: ['John Doe', 'Jane Smith', 'Bob Wilson'],
  };

  const teams = [
    { id: 1, name: 'Eagles', type: 'Basketball' },
    { id: 2, name: 'Sharks', type: 'Volleyball' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}></Text>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'myTeam' && styles.activeTab]}
            onPress={() => setActiveTab('myTeam')}
          >
            <Text style={[styles.tabText, activeTab === 'myTeam' && styles.activeTabText]}>My Team</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'findTeam' && styles.activeTab]}
            onPress={() => setActiveTab('findTeam')}
          >
            <Text style={[styles.tabText, activeTab === 'findTeam' && styles.activeTabText]}>Find Team</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'myTeam' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Team: {team.name}</Text>
            <Text style={styles.coachText}>Coach: {team.coach}</Text>
            <Text style={styles.membersText}>Members:</Text>
            {team.members.map((member, index) => (
              <Text key={index} style={styles.memberItem}>{member}</Text>
            ))}
            <TouchableOpacity style={styles.manageButton}>
              <Text style={styles.buttonText}>Manage Team</Text>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'findTeam' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Find Teams</Text>
            {teams.map((team) => (
              <View key={team.id} style={styles.teamItem}>
                <Image
                  source={{ uri: 'https://via.placeholder.com/50' }}
                  style={styles.teamLogo}
                />
                <View style={styles.teamInfoContainer}>
                  <Text style={styles.teamName}>{team.name}</Text>
                  <Text style={styles.teamType}>Type: {team.type}</Text>
                </View>
                <TouchableOpacity style={styles.viewButton}>
                  <Text style={styles.buttonText}>View Team</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
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
    marginVertical: 5,
    fontFamily: 'Roboto',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#E5E9F2',
    borderRadius: 8,
    marginHorizontal: 5,
  },
  activeTab: {
    backgroundColor: '#3C4858',
  },
  tabText: {
    fontWeight: 'bold',
    color: '#1F2D3D',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  section: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1F2D3D',
  },
  coachText: {
    fontSize: 14,
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
    marginLeft: 10,
    marginBottom: 5,
  },
  teamItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  teamLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  teamInfoContainer: {
    flex: 1,
  },
  teamName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#1F2D3D',
  },
  teamType: {
    fontSize: 14,
    color: '#3C4858',
  },
  manageButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 15,
    alignItems: 'center',
  },
  viewButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default FindTeamScreen;
