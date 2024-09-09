import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';

const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Function to handle login
    const handleLogin = () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password.');
            return;
        }

        // Mock API response
        const mockApiResponse = {
            success: email === 'testadmin@example.com' && password === 'admin123',
            message: 'You have successfully logged in.',
        };

        // Simulate network request with a delay
        setTimeout(() => {
            if (mockApiResponse.success) {
                Alert.alert('Success', mockApiResponse.message);
                navigation.navigate('Home'); // Navigate to Home on successful login
            } else {
                Alert.alert('Error', 'Invalid email or password.');
            }
        }, 1000);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Log In</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                value={email}
                onChangeText={(text) => setEmail(text)}
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={(text) => setPassword(text)}
            />

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginText}>Log In</Text>
            </TouchableOpacity>

            <View style={styles.signUpContainer}>
                <Text style={styles.signUpText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                    <Text style={styles.signUpLink}>Sign Up</Text>
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
    loginButton: {
        backgroundColor: '#4285F4',
        paddingVertical: 15,
        paddingHorizontal: 100,
        borderRadius: 8,
        marginVertical: 20,
    },
    loginText: {
        color: 'white',
        fontSize: 18,
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

export default Login;
