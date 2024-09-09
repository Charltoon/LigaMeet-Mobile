import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const LandingPage = ({ navigation }) => {
    return (
        <View style={styles.container}>
            {/* Logo Section */}
            <Image 
                source={require('../../assets/vvbv.png')} 
                style={styles.logo} 
            />

            {/* Title and Subtitle */}
            <Text style={styles.title}>LigaMeet</Text>
            <Text style={styles.subtitle}>Discover upcoming events near you</Text>

            {/* Sign Up Button */}
            <TouchableOpacity 
                style={styles.signUpButton}
                onPress={() => navigation.navigate('SignUp')}
            >
                <Text style={styles.signUpText}>Sign Up</Text>
            </TouchableOpacity>

            {/* Log in Button */}
            <TouchableOpacity 
                style={styles.loginButton}
                onPress={() => navigation.navigate('Login')}  // Navigate to Login screen
            >
                <Text style={styles.loginText}>Log in</Text>
            </TouchableOpacity>

            {/* Skip for Now */}
            <TouchableOpacity>
                <Text style={styles.skipText}>Skip for now</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F6F8FB',
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1F2D3D',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#AAB0B7',
        marginBottom: 40,
    },
    signUpButton: {
        backgroundColor: '#4285F4',
        paddingVertical: 15,
        paddingHorizontal: 100,
        borderRadius: 8,
        marginBottom: 20,
    },
    signUpText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loginButton: {
        borderColor: '#4285F4',
        borderWidth: 2,
        paddingVertical: 15,
        paddingHorizontal: 100,
        borderRadius: 8,
        marginBottom: 20,
    },
    loginText: {
        color: '#4285F4',
        fontSize: 18,
        fontWeight: 'bold',
    },
    skipText: {
        color: '#4285F4',
        fontSize: 16,
        marginTop: 20,
    }
});

export default LandingPage;
