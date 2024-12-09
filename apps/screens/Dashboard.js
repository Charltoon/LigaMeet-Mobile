import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('teams');
  const [invitations, setInvitations] = useState([]);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [team, setTeam] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const session = await AsyncStorage.getItem('userSession');
        if (!session) throw new Error('User session not found');
  
        const { user_id: userId } = JSON.parse(session);
        if (!userId) throw new Error('User ID not found in session');
  
        const response = await fetch(`http://192.168.1.8:8000/api/account/fetch/?user_id=${userId}`);
        if (!response.ok) throw new Error(`Error fetching user details: ${response.statusText}`);
  
        const data = await response.json();
        setUser({
          id: userId,
          username: data.account_details.username,
          sports: data.account_details.sports || [],
          gamesPlayed: data.account_details.games_played || 0,
          points: data.account_details.points || 0,
          assists: data.account_details.assists || 0,
        });
  
        // Fetch team data
        const teamResponse = await fetch(
          `http://192.168.1.8:8000/api/fetch/teams/?user_id=${userId}`
        );
        const teamData = await teamResponse.json();
        
  
        if (teamResponse.ok && teamData.teams.length > 0) {
          // Ensure the user is a member of the returned team
          const userTeam = teamData.teams.find((team) =>
            team.members?.some((member) => member.id === userId)
          );
  
          if (userTeam) {
            setTeam({
              ...userTeam,
              members: userTeam.members || [], // Default to empty array if undefined
            });
          } else {
            setTeam(null); // User not assigned to any team
          }
        } else {
          setTeam(null); // No team data available
        }
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserData();
  }, []);
  

  useEffect(() => {
    if (user) {
      console.log(`Fetching invitations for user ID: ${user.id}`);
      fetch(`http://192.168.1.8:8000/api/invitations/${user.id}/`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log('Fetched invitations:', data);
          const pendingInvitations = data.filter(
            (invitation) => invitation.status === 'Pending'
          );
          setInvitations(pendingInvitations);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching invitations:', error);
          setLoading(false);
        });
    }
  }, [user]); // Add user as a dependency
   // Add user as a dependency

  const handleNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000); // Clear notification after 3 seconds
  };

  const handleAccept = (invitationId) => {
    fetch(`http://192.168.1.8:8000/api/invitations/update/`, {
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
          setTeam({
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
    fetch(`http://192.168.1.8:8000/api/invitations/update/`, {
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
      <ScrollView>
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
          <Text style={styles.sectionTitle}>
            My Team: {team ? team.name : 'No team assigned'}
          </Text>
          {team ? (
            <>  
              <Text style={styles.coachText}>Coach: {team.coach}</Text>
              <Text style={styles.membersText}>Members:</Text>
              {team.members.map((member, index) => (
                <Text key={index} style={styles.memberItem}>
                  {member.name} {/* Assuming member has a 'username' property */}
                </Text>
              ))}
            </>
          ) : (
            <Text style={styles.placeholderText}>You are not currently part of any team.</Text>
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
});

export default Dashboard;
