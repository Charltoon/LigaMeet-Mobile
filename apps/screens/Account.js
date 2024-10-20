import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { getUserSession } from '../services/auth';
import { launchImageLibrary } from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const AccountScreen = () => {
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
        setUser((prevState) => ({
          ...prevState,
          ...session,
          dateOfBirth: session.dateOfBirth ? new Date(session.dateOfBirth) : new Date(),
        }));
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
      console.log(response);
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
    try {
      // Implement the logic to save user information and profile picture to your server
      // Example: await uploadProfileData(user);
      Alert.alert('Success', 'Your profile has been updated!');
    } catch (error) {
      Alert.alert('Error', 'There was an error updating your profile. Please try again later.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>My Account</Text>
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <>
          <TouchableOpacity onPress={handleChoosePhoto}>
            {user.profilePicture ? (
              <Image source={{ uri: user.profilePicture }} style={styles.profileImage} />
            ) : (
              <Image source={require('../../assets/vvbv.png')} style={styles.profileImage} />
            )}
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
                editable={false} // Prevent manual editing
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
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: 'center', backgroundColor: '#F6F8FB', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1F2D3D', marginBottom: 20 },
  profileImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 20 },
  loadingText: { fontSize: 18, color: '#AAB0B7' },
  fieldContainer: { width: '100%', marginBottom: 20 },
  label: { fontSize: 16, color: '#1F2D3D', marginBottom: 5 },
  input: { width: '100%', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#ddd', backgroundColor: 'white' },
  button: { backgroundColor: '#4285F4', paddingVertical: 15, paddingHorizontal: 100, borderRadius: 10, marginTop: 20 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});

export default AccountScreen;
