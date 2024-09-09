import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';

const SignUp = ({ navigation }) => {
    // State to manage form data
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Function to validate email format
    const validateEmail = (email) => {
        const emailPattern = /\S+@\S+\.\S+/;
        return emailPattern.test(email);
    };

    // Function to handle sign-up
    const handleSignUp = () => {
        // Form validation
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill out all fields.');
            return;
        }
        if (!validateEmail(email)) {
            Alert.alert('Error', 'Please enter a valid email address.');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }

        // Simulate successful sign-up (In a real app, you would send data to your backend here)
        Alert.alert('Success', `Welcome, ${name}! Your account has been created.`);
        navigation.navigate('Login'); // Navigate to Login page after successful sign-up
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Your Account</Text>

            <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />

            <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
                <Text style={styles.signUpText}>Sign Up</Text>
            </TouchableOpacity>


            <View style={styles.signUpContainer}>
                <Text style={styles.signUpTextaccount}>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.signUpLink}>Log In</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F6F8FB',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#1F2D3D',
    },
    input: {
        width: '100%',
        padding: 15,
        marginVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: 'white',
    },
    signUpButton: {
        backgroundColor: '#4285F4',
        paddingVertical: 15,
        paddingHorizontal: 100,
        borderRadius: 8,
        marginVertical: 20,
    },
    signUpText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    signUpTextaccount: {
        fontSize: 16,
        color: '#AAB0B7',
    },
    signUpContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    signUpLink: {
        fontSize: 16,
        color: '#4285F4',
    },
});

export default SignUp;
