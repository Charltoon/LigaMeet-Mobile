import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { registerUser } from '../services/auth';

const SignUp = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const validateEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
      };
      

    const handleSignUp = async () => {
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
        setLoading(true);
        try {
            await registerUser(email, password);
            setMessage(`Welcome, ${name}! Your account has been created.`);
            navigation.navigate('Login');
        } catch (error) {
            setMessage('Registration failed');
        } finally {
            setLoading(false);
        }
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
                <Text style={styles.signUpButtonText}>Sign Up</Text>
            </TouchableOpacity>
            {loading && <ActivityIndicator style={styles.loading} />}
            {message ? <Text style={styles.message}>{message}</Text> : null}
            <View style={styles.signUpContainer}>
                <Text style={styles.signUpText}>Already have an account? </Text>
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
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: 'white',
    },
    signUpButton: {
        backgroundColor: '#4285F4',
        paddingVertical: 15,
        paddingHorizontal: 100,
        borderRadius: 10,
        marginVertical: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    signUpButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loading: {
        marginVertical: 20,
    },
    message: {
        marginVertical: 10,
        color: 'green',
        fontWeight: 'bold',
    },
    signUpContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    signUpText: {
        fontSize: 16,
        color: '#AAB0B7',
    },
    signUpLink: {
        fontSize: 16,
        color: '#4285F4',
    },
});

export default SignUp;
