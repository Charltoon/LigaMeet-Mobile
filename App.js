import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from './apps/screens/HomeScreen';
import FindMatchScreen from './apps/screens/FindMatch';
import FindTeamScreen from './apps/screens/FindTeam';
import AccountScreen from './apps/screens/Account';

const Tab = createBottomTabNavigator();

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Find Match') {
              iconName = focused ? 'search' : 'search-outline';
            } else if (route.name === 'Find Team') {
              iconName = focused ? 'people' : 'people-outline';
            } else if (route.name === 'Account') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#4285F4',
          tabBarInactiveTintColor: 'gray',
          headerShown: false, 
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Find Match" component={FindMatchScreen} />
        <Tab.Screen name="Find Team" component={FindTeamScreen} />
        <Tab.Screen name="Account" component={AccountScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
