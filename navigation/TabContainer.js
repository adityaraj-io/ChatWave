import React, { useEffect, useState } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import CallScreen from '../screens/CallScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Image, StyleSheet, View, Text } from 'react-native'
import database from '@react-native-firebase/database'
import auth from '@react-native-firebase/auth'
import { ActivityIndicator } from 'react-native';
const Tab = createBottomTabNavigator();
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native';
import LoadingModal from '../components/LoadingModal';
import { AppState } from 'react-native';
import Conversation from '../screens/Conversation';


const TabContainer = () => {
  const [user, setUser] = useState();
  const [dataInitializing, setDataInitializing] = useState(true);
  const [errorData, setErrorData] = useState(false);
  const [data, setData] = useState({});
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false)
function setUserData(uid) {
    if (uid) {
      try {
        let reference = database().ref(`/users/${uid}`)
        reference.once('value', (snapshot) => {
          if (snapshot.val() !== null && snapshot.val() !== undefined) {
            setData({
                profileImage: snapshot.val().profileImage,
                name: snapshot.val().name,
                uid: snapshot.val().uid
            }); 
            console.log(data);
            setDataInitializing(false);
            
          } else {
            setDataInitializing(false);
          }
        });
      } catch (error) {
        console.log(error.message);
        setErrorData(true);
      }
    } else {
      setDataInitializing(false);
    }
  }

  const makeOffline = async(uid, then=()=>{}, error=()=>{}, loading=true) => {
    if(loading){
      setLoading(true)
    }
    try {
      database().ref(`/users/${uid}`).update({
        status: 'offline'
      }).then(()=>{
        
        then();
      }).catch((err)=>{
        if(loading){
          setLoading(false)
        }
        error();
      })
    } catch (err) {
      // setLoading(false)
      error();

    }
  }
  const makeOnline = async(uid, then=()=>{}, error=()=>{}, loading=false) => {
    if(loading){
      setLoading(true)
    }
    try {
      database().ref(`/users/${uid}`).update({
        status: 'online'
      }).then(()=>{
        
        then();
      }).catch((err)=>{
        if(loading){
          setLoading(false)
        }
        error();
      })
    } catch (err) {
      // setLoading(false)
      error();

    }
  }


const handleAppStateChange = async(newState) => {
  console.log('App state changed to:', newState);
  let uid = await AsyncStorage.getItem('uid');
  if(newState==='background'){
      makeOffline(uid, ()=>{
        console.log('maked offline');
      }, ()=>{
        alert('Some Error Occured')
      }, false)
  }
  else{
  
    makeOnline(uid, ()=>{
      console.log('maked online');
    }, ()=>{
      alert('Some Error Occured')
    }, false)
  }
};


  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(async(user) => {
      setUser(user);
      if (initializing) setInitializing(false);
      if (user) {
        console.log(user.uid);
        setUserData(user.uid);
      } else {
        setDataInitializing(false);
      }
    });

    AppState.addEventListener('change', handleAppStateChange)

    return () => {
      subscriber();
      // BackHandler.removeEventListener('hardwareBackPress',handleBackButton);
      if (AppState.removeEventListener) {
        AppState.removeEventListener('change', handleAppStateChange);
      }
    };
  }, [initializing]);
  
  
  

  if (initializing || dataInitializing || errorData || data === undefined) {
    if (errorData) {
      return (
        <View style={[styles.container, { justifyContent: 'center' }]}>
          <Text style={{color: 'lightgray'}}>Some Error Occurred</Text>
        </View>
      );
    }
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size={'large'} color={'#FF5A66'} />
      </View>
    );
  }
    return (
        <>
            <Tab.Navigator

                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        if (route.name === 'Messages') {
                            return focused ? <Image style={{ width: size, height: size }} tintColor={color} source={require(`../assets/images/conversation_checked.png`)} /> : <Image style={{ width: size, height: size }} tintColor={color} source={require(`../assets/images/conversation.png`)} />
                        } else if (route.name === 'Search') {
                            return <Image style={{ width: size, height: size }} tintColor={color} source={require(`../assets/images/search.png`)} />
                        } else if (route.name === 'You') {
                            return focused ? <Image style={{ width: size, backgroundColor: 'gray', height: size, borderRadius: 100, borderColor: '#FF5A66', borderWidth: StyleSheet.hairlineWidth + 1 }} source={{ uri: data.profileImage }} /> : <Image style={{ width: size, height: size, borderRadius: 100, borderColor: '#fff', borderWidth: StyleSheet.hairlineWidth, backgroundColor: 'gray' }} source={{ uri: data.profileImage }} />
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
                <Tab.Screen name='Messages' component={HomeScreen} />
                <Tab.Screen name='Search' component={Conversation} options={{
              headerShown: true,
              headerStyle: {
                backgroundColor: "#333333",
              },
              // sha
              headerTintColor: "#fff",
              headerTitle: 'Search People'
              // headerShadowVisible: false,
            }} />
                <Tab.Screen name='You' component={ProfileScreen} />

            </Tab.Navigator>
            <LoadingModal visible={loading} customText text='Saving Data..' />
        </>
    )
}

export default TabContainer
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1,
        backgroundColor: '#333333',
        justifyContent: 'center'
    }
})