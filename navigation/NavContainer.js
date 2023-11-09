import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StartScreen from '../screens/StartScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import TabContainer from './TabContainer';
import ChatScreen from '../screens/ChatScreen';
import ImageScreen from '../screens/ImageScreen';
import EditImage from '../screens/EditImage';
import EditProfile from '../screens/EditProfile';
import Conversation from '../screens/Conversation';
import SeeProfieScreen from '../screens/SeeProfieScreen';

const Stack = createNativeStackNavigator();
export default function NavContainer() {
  return (
    <NavigationContainer>
        <Stack.Navigator
            initialRouteName='Start'
            screenOptions={{
                headerShown: false,
                navigationBarColor: '#333333',
                
            }}
        >
            <Stack.Screen name='Start' component={StartScreen} />
            <Stack.Screen name='Login' component={LoginScreen} />
            <Stack.Screen name='Register' component={RegisterScreen} />
            <Stack.Screen name='Main'component={TabContainer} />
            <Stack.Screen name='EditImage'component={EditImage} options={{
              headerShown: true,
              headerStyle: {
                backgroundColor: "#333333",
              },
              // sha
              headerTintColor: "#fff",
              headerTitle: 'Set Profile Image'
              // headerShadowVisible: false,
            }} />
            <Stack.Screen name='Conversation'component={Conversation} options={{
              headerShown: true,
              headerStyle: {
                backgroundColor: "#333333",
              },
              // sha
              headerTintColor: "#fff",
              headerTitle: 'Search People'
              // headerShadowVisible: false,
            }} />
            <Stack.Screen name='EditProfile'component={EditProfile} options={{
              headerShown: true,
              headerStyle: {
                backgroundColor: "#333333",
              },
              // sha
              headerTintColor: "#fff",
              headerTitle: 'Edit Profile'
              // headerShadowVisible: false,
            }} />
            <Stack.Screen name='Chat'component={ChatScreen} options={{
              headerShown: true,
              headerStyle: {
                backgroundColor: "#333333",
              },
              // sha
              headerTintColor: "#fff",
              // headerShadowVisible: false,
            }} />

            <Stack.Screen name='SeeProfile'component={SeeProfieScreen} options={{
              headerShown: true,
              headerStyle: {
                backgroundColor: "#333333",
              },
              // sha
              headerTintColor: "#fff",
              // headerShadowVisible: false,
            }} />

            <Stack.Screen name='Image'component={ImageScreen} options={{
              headerShown: true,
              headerStyle: {
                backgroundColor: "#333333",
              },
              // sha
              headerTintColor: "#fff",
              headerTitle: 'View Image'
              // headerShadowVisible: false,
            }} />

        </Stack.Navigator>
    </NavigationContainer>
  );
}