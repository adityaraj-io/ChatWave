import React, { useState } from 'react'
import { View, StyleSheet, Text, Image, Dimensions, Alert } from 'react-native'
import MaterialButton from '../components/MaterialButton'
import { CommonActions, useNavigation } from '@react-navigation/native'
import MaterialTextInput from '../components/MaterialTextInput'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { TouchableOpacity } from 'react-native'
import auth from '@react-native-firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import database from '@react-native-firebase/database'

const LoginScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    if(email===''||password===''){
      Alert.alert(
        'Error',
        'All Fields are mandatory',
        [
               {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        {cancelable: false}
    )
    }else{
      setLoading(true)
      auth()
      .signInWithEmailAndPassword(email.trim(), password.trim())
      .then(async(userCredentials)=>{
        // await AsyncStorage.clear();
        console.log('usercred - ',userCredentials.user.uid);
        let uid = userCredentials.user.uid
        await database().ref(`/users/${uid}`).update({status: 'online'}).catch((err)=>alert(err.message))
        AsyncStorage.setItem('uid', uid).then((value)=>{
          console.log('Item set - ',value)
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Main' }],
            })
          );
          setLoading(false)
        }).catch((error)=>{
          alert('Please Try Again. Something Went Wrong');
          console.log(error.message);
          setLoading(false)
        })
      }).catch((error)=>{
        setLoading(false)
        if (error.code === 'auth/email-already-in-use') {
          alert('That email address is already in use!');
        }
    
        else if (error.code === 'auth/invalid-email') {
          alert('That email address is invalid!');
        }
        else if (error.code === 'auth/invalid-login') {
          alert('Invalid Credentials!');
        }
      })
    }
  }

  return (
    <KeyboardAwareScrollView
    extraScrollHeight={100}
    enableOnAndroid={true}
    scrollEnabled={true}
    enableAutomaticScroll={true}
    >
    <View style={styles.container}>
      <View>
        <View style={styles.imgContainer}>
        <Image style={styles.image} source={require('../assets/images/login.png')} />
        </View>
        <Text style={styles.text}>Welcome Back</Text>
        <Text style={styles.subTitle}>Let's get you signed in</Text>
      </View>
      <View style={styles.infoContainer}>
        <MaterialTextInput value={email} onChangeText={setEmail} placeholder={'Email'} placeholderTextColor={'lightgray'} backgroundColor={'#474747'} borderRadius={15} width={'70%'} />
        <MaterialTextInput value={password} onChangeText={setPassword} placeholder={'Password'} secureTextEntry={true} placeholderTextColor={'lightgray'} backgroundColor={'#474747'} borderRadius={15} width={'70%'} />
        <TouchableOpacity onPress={()=>navigation.navigate('Register')}>
          <Text style={{color: 'lightgray',textAlign: 'center', marginBottom: 10, marginTop: -10}}>Don't have an account? Register</Text>
          </TouchableOpacity>
        <View style={styles.alignCenter} >
          
          <MaterialButton  height={50} isLoading={loading} fontSize={16} text={'Login'} textColor={'#333333'} backgroundColor={'#FF5A66'} onPress={handleLogin} borderRadius={20} width={'70%'} />
        </View>
      </View>
      
    </View>
    </KeyboardAwareScrollView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333333',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    height: Dimensions.get('window').height
  },
  image: {
    width: 250,
    height: 250,
  },
  infoContainer: {
    width: '100%',
    justifyContent: 'center'
  },
  alignCenter: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20
  },
  text: {
   color: 'white',
   textAlign: 'center',
   fontSize: 30,
   fontWeight: '500',
  },
  subTitle: {
    color: 'lightgray',
    textAlign: 'center'
  },
  imgContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  
});