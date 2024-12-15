import React, { useState, useEffect, useCallback } from 'react';
import { View, Alert, Text, StyleSheet, ScrollView, Image, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('teams');
  const [invitations, setInvitations] = useState([]);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);
  const [teams, setTeams] = useState(null);

  // Consolidated data fetching function
  const fetchAllData = useCallback(async () => {
    try {
      // Fetch user session
      const session = await AsyncStorage.getItem('userSession');
      if (!session) throw new Error('User session not found');

      const { user_id: userId } = JSON.parse(session);
      if (!userId) throw new Error('User ID not found in session');

      // Fetch user details
      const userResponse = await fetch(`http://192.168.1.2:8000/api/account/fetch/?user_id=${userId}`);
      if (!userResponse.ok) throw new Error(`Error fetching user details: ${userResponse.statusText}`);

      const userData = await userResponse.json();
      const userDetails = {
        id: userId,
        username: userData.account_details.username,
        sports: userData.account_details.sports || [],
        gamesPlayed: userData.account_details.games_played || 0,
        points: userData.account_details.points || 0,
        assists: userData.account_details.assists || 0,
      };
      setUser(userDetails);

      // Fetch team data
      const teamResponse = await fetch(`http://192.168.1.2:8000/api/fetch/teams/?user_id=${userId}`);
      const teamData = await teamResponse.json();

      if (teamResponse.ok && teamData.teams.length > 0) {
        // Set all teams for the user
        const userTeams = teamData.teams.filter((team) =>
          team.members?.some((member) => member.id === userId)
        );

        if (userTeams.length > 0) {
          setTeams(userTeams.map((team) => ({
            id: team.id,
            name: team.name,
            coach: team.coach,
            members: team.members || [],
          })));
        } else {
          setTeams([]);
        }
      } else {
        setTeams([]);
      }

      // Fetch invitations
      const invitationsResponse = await fetch(`http://192.168.1.2:8000/api/invitations/${userId}/`);
      if (!invitationsResponse.ok) {
        throw new Error(`HTTP error! status: ${invitationsResponse.status}`);
      }
      const invitationsData = await invitationsResponse.json();
      const pendingInvitations = invitationsData.filter(
        (invitation) => invitation.status === 'Pending'
      );
      setInvitations(pendingInvitations);

    } catch (error) {
      console.error('Error fetching data:', error.message);
      handleNotification('Failed to refresh data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Pull to refresh handler
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAllData();
  }, [fetchAllData]);

  const handleNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLeaveTeam = async (teamId) => {
    if (!teamId || typeof teamId !== 'number') {
      console.error('Invalid team ID');
      return;
    }
  
    Alert.alert(
      'Leave Team',
      'Are you sure you want to leave this team?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              const response = await fetch('http://192.168.1.2:8000/api/team/leave/', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${user.token}`, // Include token if required
                },
                body: JSON.stringify({
                  user_id: user.id,
                  team_id: teamId,
                }),
              });
  
              const data = await response.json();
  
              if (response.ok) {
                setNotification(data.message);
                setTeams(null);
              } else {
                console.error('Error response from server:', data);
                setNotification(data.error || 'Failed to leave the team.');
              }
            } catch (error) {
              console.error('Error leaving team:', error);
              setNotification('An error occurred while leaving the team.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  // Keep existing methods for handling accept, decline, leave team, etc.
  const handleAccept = (invitationId) => {
    fetch(`http://192.168.1.2:8000/api/invitations/update/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        invitation_id: invitationId,
        status: 'Accepted',
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Invitation accepted:', data);
        setInvitations((prevInvitations) =>
          prevInvitations.map((invitation) =>
            invitation.id === invitationId
              ? { ...invitation, status: 'Accepted' }
              : invitation
          )
        );
  
        if (data.team) {
          setTeams({
            id: data.team.id,
            name: data.team.name,
            coach: data.team.coach,
            members: data.team.members,
          });
        }
  
        handleNotification('Invitation accepted successfully.');
      })
      .catch((error) => {
        console.error('Error accepting invitation:', error);
        handleNotification('Failed to accept invitation.');
      });
  };

  const handleDecline = (invitationId) => {
    fetch(`http://192.168.1.2:8000/api/invitations/update/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        invitation_id: invitationId,
        status: 'Declined',
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        setInvitations((prevInvitations) =>
          prevInvitations.map((invitation) =>
            invitation.id === invitationId
              ? { ...invitation, status: 'Declined' }
              : invitation
          )
        );
        handleNotification('Invitation declined.');
      })
      .catch((error) => {
        console.error('Error declining invitation:', error);
        handleNotification('Failed to decline invitation.');
      });
  };

  
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  const recentActivities = [
    { id: 1, description: 'Joined a new team', timestamp: '2023-11-14 14:30' },
    { id: 2, description: 'Played a match', timestamp: '2023-11-13 18:00' },
  ];

  return (
<SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#9Bd35A', '#689F38']} // Android colors
            tintColor="#689F38" // iOS color
            title="Pull to refresh" // iOS title
          />
        }
      >
        <Text style={styles.title}>Player Dashboard</Text>
        
        <View style={styles.header}>
          <Image
            source={{ uri: 'https://via.placeholder.com/100' }}
            style={styles.avatar}
          />
          <Text style={styles.username}>Welcome, {user.username}!</Text>
          <Text style={styles.sport}>
            Sports: {user.sports.length > 0 ? user.sports.join(', ') : 'No sports selected'}
          </Text>
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
          <Text style={styles.sectionTitle}>My Teams</Text>
          {teams && teams.length > 0 ? (
            <ScrollView horizontal>
              {teams.map((teamItem, index) => (
                <View key={index} style={styles.teamCard}>
                  <Text style={styles.teamName}>{teamItem.name}</Text>
                  <Text style={styles.coachText}>Coach: {teamItem.coach}</Text>
                  <Text style={styles.membersText}>Members:</Text>
                  {teamItem.members.map((member, idx) => (
                    <Text key={idx} style={styles.memberItem}>
                      {member.name}
                    </Text>
                  ))}
                  <TouchableOpacity
                    style={styles.leaveButton}
                    onPress={() => handleLeaveTeam(teamItem.id)}
                  >
                    <Text style={styles.buttonText}>Leave Team</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.placeholderText}>
              You are not currently part of any team.
            </Text>
          )}
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
          {invitations.length > 0 ? (
            invitations.map((invitation) => (
              <View key={invitation.id} style={styles.invitation}>
                <Text style={styles.invitationText}>
                  Team Name: {invitation.team_name}
                </Text>
                <Text>Sent At: {new Date(invitation.sent_at).toLocaleString()}</Text>
                <View style={styles.invitationButtons}>
                  <TouchableOpacity
                    style={[styles.button, styles.acceptButton]}
                    onPress={() => handleAccept(invitation.id)}
                  >
                    <Text style={styles.buttonText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.declineButton]}
                    onPress={() => handleDecline(invitation.id)}
                  >
                    <Text style={styles.buttonText}>Decline</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text>No invitations available.</Text>
          )}
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
  notification: {
    backgroundColor: '#4CAF50',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  notificationText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  leaveButton: {
    marginTop: 15,
    backgroundColor: "#FF3B30",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  teamCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    margin: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    alignItems: 'flex-start',
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2D3D',
    marginBottom: 5,
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
    fontSize: 14,
    marginBottom: 5,
    paddingLeft: 10,
  },
  switchButton: {
    backgroundColor: '#007AFF',
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  leaveButton: {
    backgroundColor: '#FF3B30',
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default Dashboard;
