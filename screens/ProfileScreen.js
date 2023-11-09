import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, StatusBar, Image, TouchableOpacity, Dimensions, ViewBase, ActivityIndicator } from 'react-native'
import MaterialButton from '../components/MaterialButton'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useNavigation } from '@react-navigation/native'
import auth from '@react-native-firebase/auth'
import database from '@react-native-firebase/database';
import LoadingModal from '../components/LoadingModal'


const ProfileScreen = () => {
  const [user, setUser] = useState();
  const [initializing, setInitializing] = useState(true);
  const [dataInitializing, setDataInitializing] = useState(true);
  const [errorData, setErrorData] = useState(false);
  const [data, setData] = useState();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false)
  const signOut = async() => {
    setLoading(true)
    try {
      auth().signOut().then(()=>{
        setLoading(false)
        navigation.replace('Start')
      }).catch((error)=>{
        alert('Some Error Occured, please Try again Later')
        setLoading(false)
      })

    } catch (error) {
      alert('Some Error Occured, please Try again Later')
      setLoading(false)
    }
  }
  function setUserData(uid=''){
    // console.log(user.uid)
   if(uid!==null||undefined){
    try {
      database()
    .ref(`/users/${uid}`)
    .on('value', snapshot => {
      // console.log('User data: ', snapshot.val());
      setData(snapshot.val())
      // console.log(snapshot)
      setDataInitializing(false)
  })
    } catch (error) {
      console.log(error.message)
      setErrorData(true)
    }
   }
  }
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
    if(user){
      setUserData(user.uid);
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubs
    
  }, []);

  if(initializing||dataInitializing||errorData||data===undefined){
    if(errorData){
      return <View style={[styles.container, {justifyContent: 'center'}]}>
        <Text>Some Error Occured</Text>
      </View>
    }
    return <View style={[styles.container, {justifyContent: 'center'}]}>
    <ActivityIndicator size={'large'} color={'#FF5A66'} />
</View>
  }

  return (
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <View style={styles.blob}>
          <Image source={{uri: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/images/1.jpg'}} style={{width: '100%', height: '100%', borderTopRightRadius: 15, borderTopLeftRadius: 15}} />
        </View>
        <TouchableOpacity onPress={()=>navigation.navigate("EditImage")}>
        <Image
        source={{uri: data.profileImage}} // Replace with the path to your profile picture
        style={styles.profileImage}
      />
        </TouchableOpacity>
      
      <Text style={styles.username}>{data.name}</Text>
      <Text style={styles.email}>{user.email}</Text>
      {/* <Text style={styles.status}>Online</Text> */}

      <View style={{width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', padding: 10}}>
        <View style={{width: '45%', marginRight: 2.5}}>
          <MaterialButton onPress={()=>navigation.navigate('EditProfile')} text={'Edit Profile'} borderRadius={5} width={'100%'} backgroundColor={'#FF5A66'} />
        </View>
        <View style={{width: '45%', marginLeft: 2.5}}>
          <MaterialButton onPress={signOut} text={'Sign Out'} borderRadius={5} width={'100%'} backgroundColor={'#FF5A66'} />
        </View>
      </View>
      {/* Bio */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>About Me</Text>
        <Text style={styles.bio}>{data.about}</Text>
      </View>

      {/* Contact Information */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Contact Information</Text>
        <Text style={styles.contactInfo}>Email: {user.email}</Text>
        {/* <Text style={styles.contactInfo}>Phone: (123) 456-7890</Text> */}
      </View>

      {/* Custom Sections */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Interests</Text>
        <Text style={styles.customValue}>{data.interests}</Text>
      </View>
      <LoadingModal visible={loading} />
    </View>
    </KeyboardAwareScrollView>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333333',
    marginTop: StatusBar.currentHeight-10,
    minHeight: Dimensions.get('screen').height-90
  },
  email: {
    fontSize: 11,
    color: 'lightgray'
    // marginTop:1 
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
    marginTop: -100,
    borderWidth: 5,
    borderColor: '#333333',
    backgroundColor: 'lightgray'
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: -5,
    color: '#fff'
  },
  status: {
    fontSize: 16,
    color: 'green',
    marginBottom: 15,
  },
  section: {
    backgroundColor: '#444444',
    padding: 20,
    margin: 10,
    borderRadius: 10,
    width: '87%',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff'
  },
  bio: {
    fontSize: 16,
    color: 'lightgray'
  },
  contactInfo: {
    fontSize: 16,
    marginBottom: 5,
    color: 'lightgray'
  },
  customValue: {
    fontSize: 16,
    color: 'lightgray'
  },
  blob: {
    height: 150,
    // marginHorizontal: 20,
    // marginRight: 50,
    backgroundColor: '#FF5A66',
    width: '90%',
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    borderColor: '#ff5a66',
    borderWidth: 2
  }
});

