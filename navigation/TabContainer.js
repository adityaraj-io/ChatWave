import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import CallScreen from '../screens/CallScreen';
import ProfileScreen from '../screens/ProfileScreen';
import {Image, StyleSheet} from 'react-native'
const Tab = createBottomTabNavigator();

const TabContainer = () => {
  return (
    <Tab.Navigator
        screenOptions={({route})=>({
            tabBarIcon: ({focused, color, size}) => {
                if(route.name==='Messages'){
                    return focused?<Image style={{width: size, height: size}} tintColor={color} source={require(`../assets/images/conversation_checked.png`)} /> : <Image style={{width: size, height: size}} tintColor={color} source={require(`../assets/images/conversation.png`)} />
                }else if(route.name==='Call'){
                    return focused?<Image style={{width: size, height: size}} tintColor={color} source={require(`../assets/images/call.png`)} /> : <Image style={{width: size, height: size}} tintColor={color} source={require(`../assets/images/call_checked.png`)} />
                }else if(route.name==='You'){
                    return focused?<Image style={{width: size, height: size, borderRadius: 100, borderColor: '#FF5A66', borderWidth: StyleSheet.hairlineWidth+1}} source={require(`../assets/images/avatar.png`)} /> : <Image style={{width: size, height: size, borderRadius: 100}} source={require(`../assets/images/avatar.png`)} />
                }

            },
            tabBarActiveTintColor: '#FF5A66',
            tabBarInactiveTintColor: 'white',
            headerShown: false,
            tabBarStyle: {
                backgroundColor: '#333333',
                marginBottom: 10,
                marginTop: 0,
            }
        })}
    >
        <Tab.Screen name='Messages' component={HomeScreen}  />
        <Tab.Screen name='Call' component={CallScreen} />
        <Tab.Screen name='You'  component={ProfileScreen} />
    </Tab.Navigator>
  )
}

export default TabContainer

// options={{headerShown: true, headerStyle: {backgroundColor: '#333333'}, headerTintColor: 'white', headerTitleAlign: 'left', headerTitle:'Your Profile', headerShadowVisible: false}}