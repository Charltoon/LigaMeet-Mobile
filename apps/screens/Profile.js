import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { getUserSession, logoutUser } from '../services/auth';
import { launchImageLibrary } from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';  // Ensure this is imported

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    middleName: '',
    dateOfBirth: new Date(),
    gender: '',
    address: '',
    phone: '',
    profilePicture: '',
  });

  const [loading, setLoading] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const session = await getUserSession();
      if (session) {
        try {
          const response = await fetch(`http://192.168.1.8:8000/api/account/fetch/?user_id=${session.user_id}`);
          const data = await response.json();

          if (response.ok) {
            setUser({
              username: data.account_details.username,
              email: data.account_details.email,
              firstName: data.account_details.first_name,
              lastName: data.account_details.last_name,
              middleName: data.account_details.middle_name,
              dateOfBirth: data.account_details.date_of_birth ? new Date(data.account_details.date_of_birth) : new Date(),
              gender: data.account_details.gender,
              address: data.account_details.address,
              phone: data.account_details.phone,
              profilePicture: data.account_details.image_url || '',
            });
          } else {
            console.error('Error fetching user details:', data.error);
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleInputChange = (field, value) => {
    setUser({ ...user, [field]: value });
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || user.dateOfBirth;
    setShowDatePicker(false);
    setUser({ ...user, dateOfBirth: currentDate });
  };

  const handleChoosePhoto = () => {
    const options = { mediaType: 'photo', quality: 1 };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const source = { uri: response.assets[0].uri };
        setUser({ ...user, profilePicture: source.uri });
      }
    });
  };

  const handleSave = async () => {
    console.log("Save button clicked");
    Alert.alert('Button Pressed', 'Save button clicked');
    
    try {
        // Retrieve the session from AsyncStorage
        const session = await AsyncStorage.getItem('userSession');
        
        if (!session) {
            console.error('User session not found');
            Alert.alert('Error', 'User session not found. Please log in again.');
            return;
        }

        // Log the session to ensure it contains user_id
        const parsedSession = JSON.parse(session);
        console.log('Retrieved session:', parsedSession);

        const userId = parsedSession?.user_id;  // Safely access user_id using optional chaining
        
        console.log('Retrieved user_id:', userId);

        if (!userId) {
            console.error('User ID not found in session');
            Alert.alert('Error', 'User ID is required');
            return;
        }

        // Prepare the payload with the necessary user information
        const payload = {
            user_id: userId,
            username: user.username,
            email: user.email,
            first_name: user.firstName,
            last_name: user.lastName,
            middle_name: user.middleName,
            date_of_birth: user.dateOfBirth.toISOString(),
            gender: user.gender,
            address: user.address,
            phone: user.phone,
            profile_picture: user.profilePicture || "",  // Handle the profile picture
        };

        console.log('Sending payload:', payload);

        // Send the PUT request to the backend
        const response = await fetch('http://192.168.1.8:8000/api/account/update/', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        console.log('Server response:', data);

        // Check if the response was successful
        if (response.ok) {
            Alert.alert('Success', 'Your profile has been updated!');
        } else {
            Alert.alert('Error', data.message || 'Failed to update profile');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        Alert.alert('Error', 'There was an error updating your profile. Please try again later.');
    }
};

  const handleLogout = async () => {
    try {
      await logoutUser();
      Alert.alert('Logged out', 'You have been logged out successfully.', [
        { text: 'OK', onPress: () => navigation.navigate('LandingPage') }
      ]);
    } catch (error) {
      Alert.alert('Error', 'There was an error logging you out. Please try again later.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>My Profile</Text>
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <>
          <TouchableOpacity onPress={handleChoosePhoto} style={styles.profileImageContainer}>
            {user.profilePicture ? (
              <Image source={{ uri: user.profilePicture }} style={styles.profileImage} />
            ) : (
              <Image source={require('../../assets/vvbv.png')} style={styles.profileImage} />
            )}
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={user.username}
              onChangeText={(value) => handleInputChange('username', value)}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={user.email}
              onChangeText={(value) => handleInputChange('email', value)}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              placeholder="First Name"
              value={user.firstName}
              onChangeText={(value) => handleInputChange('firstName', value)}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              value={user.lastName}
              onChangeText={(value) => handleInputChange('lastName', value)}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Middle Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Middle Name"
              value={user.middleName}
              onChangeText={(value) => handleInputChange('middleName', value)}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Date of Birth</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <TextInput
                style={styles.input}
                placeholder="Date of Birth"
                value={user.dateOfBirth.toDateString()}
                editable={false}
              />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={user.dateOfBirth}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Gender</Text>
            <TextInput
              style={styles.input}
              placeholder="Gender"
              value={user.gender}
              onChangeText={(value) => handleInputChange('gender', value)}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Address"
              value={user.address}
              onChangeText={(value) => handleInputChange('address', value)}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              placeholder="Phone"
              value={user.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
            />
          </View>

          {/* Buttons Side by Side */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#F6F8FB',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#1F2D3D',
    marginBottom: 25,
    marginVertical: 35,
    fontFamily: 'Roboto',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  changePhotoText: {
    color: '#4285F4',
    fontWeight: '500',
  },
  loadingText: {
    fontSize: 18,
    color: '#AAB0B7',
  },
  fieldContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#1F2D3D',
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#FFFFFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  logoutButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;

// TODO Dashboard dynamic (NAME)  done
// ACCEPT/DECLINE INVITAION
// DISPLAY TEAMS  done
// JOIN/LEAVE TEAM
// SPORTS