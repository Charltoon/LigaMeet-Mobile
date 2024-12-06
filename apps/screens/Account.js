import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ScrollView, Alert, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const AccountScreen = ({ navigation }) => {
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
      try {
        const userId = await AsyncStorage.getItem('user_id');
        const response = await fetch(`http://192.168.1.2:8000/api/account/fetch/?user_id=${userId}`);
        const data = await response.json();

        if (response.status === 200) {
          setUser({
            ...data.account_details,
            dateOfBirth: data.account_details.dateOfBirth ? new Date(data.account_details.dateOfBirth) : new Date(),
          });
        } else {
          Alert.alert('Error', 'Failed to fetch account details.');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        Alert.alert('Error', 'An error occurred while fetching account details.');
      } finally {
        setLoading(false);
      }
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
    
    try {
      const userId = await AsyncStorage.getItem('user_id');
      console.log('Retrieved user_id:', userId);
      
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
      };
  
      console.log('Sending payload:', payload);
  
      const response = await fetch('http://192.168.1.2:8000/api/account/update/', {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
      console.log('Server response:', data);
  
      if (response.ok) {
        Alert.alert('Success', 'Profile updated successfully');
      } else {
        Alert.alert('Error', data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'There was an error updating your profile');
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user_id');
      Alert.alert('Logged out', 'You have been logged out successfully.', [
        { text: 'OK', onPress: () => navigation.navigate('LandingPage') },
      ]);
    } catch (error) {
      Alert.alert('Error', 'There was an error logging you out. Please try again later.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>My Account</Text>
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
            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={() => {
              Alert.alert('Button Pressed', 'Save button clicked');
              console.log('Save button clicked (direct check)');
              handleSave();
            }}>
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
    marginVertical: 5,
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
    fontSize: 16,
    color: '#007bff',
    textDecorationLine: 'underline',
  },
  fieldContainer: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  button: {
    width: '48%',
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  logoutButton: {
    backgroundColor: '#FF5733',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#555',
  },
});

export default AccountScreen;
