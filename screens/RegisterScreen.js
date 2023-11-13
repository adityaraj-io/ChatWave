import React, { useState } from 'react'
import { View, StyleSheet, Text, Image, Dimensions, TouchableOpacity, Alert } from 'react-native'
import MaterialButton from '../components/MaterialButton'
import { CommonActions, useNavigation } from '@react-navigation/native'
import MaterialTextInput from '../components/MaterialTextInput'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { DEFAULT_PROFILE_URI } from '../constants'

const RegisterScreen = () => {
  const [loading, setLoading] = useState(false)
  const navigation = useNavigation();
  const [name, setName] = useState('')
  const [about, setAbout] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [interests, setInterests] = useState('')


  const handleRegister = () => {
    if(email===''||password===''||about===''||name===''||interests===''){
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
          .createUserWithEmailAndPassword(email.toString().trim(), password.trim())
          .then((userCredentials) => {
            database()
              .ref(`/users/${userCredentials.user.uid}`)
              .set({
                name: name.trim(),
                email: email.trim(),
                about: about.trim(),
                uid: userCredentials.user.uid,
                interests: interests,
                profileImage: DEFAULT_PROFILE_URI,
                status: 'online'
              }).then(()=>{
               AsyncStorage.setItem('uid', userCredentials.user.uid).then(()=>{
                navigation.navigate('EditImage', {
                  register: true,
                })
                setLoading(false)
               }).catch((error)=>{
                alert('Something Went Wrong, Please Login.')
                console.log(error.message);
                setLoading(false)
               })
                
              }).catch((error)=>{
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                  })
                );
                setLoading(false)
                alert("Your Data Isn't Saved!")
              })
            

          })
          .catch(error => {
            setLoading(false)
            if (error.code === 'auth/email-already-in-use') {
              console.log('That email address is already in use!');
            }

            else if (error.code === 'auth/invalid-email') {
              console.log('That email address is invalid!');
            }

            else{
              Alert.alert(
                'Error',
                error.message,
                [
                       {text: 'OK', onPress: () => console.log('OK Pressed')},
                ],
                {cancelable: false}
            )
            }
            
          });
    }
  }

  return (
    <KeyboardAwareScrollView
      extraScrollHeight={50}
      enableOnAndroid={true}
      scrollEnabled={true}
      enableAutomaticScroll={true}
      // contentContainerStyle={{flex: 1}}
      keyboardShouldPersistTaps='handled'
    >
      <View style={styles.container}>
        <View>
          <View style={styles.imgContainer}>
            <Image style={styles.image} source={require('../assets/images/verify.png')} />
          </View>
          <Text style={styles.text}>Let's Register</Text>
          <Text style={styles.subTitle}>Let's get you connected</Text>
        </View>
        <View style={styles.infoContainer}>

            <MaterialTextInput value={name} onChangeText={setName} placeholder={'Name'} placeholderTextColor={'lightgray'} backgroundColor={'#474747'} borderRadius={15} width={'70%'} />

            <MaterialTextInput value={email} onChangeText={setEmail} placeholder={'Email'} placeholderTextColor={'lightgray'} backgroundColor={'#474747'} borderRadius={15} width={'70%'} />

            <MaterialTextInput value={password} onChangeText={setPassword} placeholder={'Password'} secureTextEntry={true} placeholderTextColor={'lightgray'} backgroundColor={'#474747'} borderRadius={15} width={'70%'} />

            <MaterialTextInput value={about} onChangeText={setAbout} placeholder={'Tell us something about yourself!'} multiline={true} placeholderTextColor={'lightgray'} backgroundColor={'#474747'} borderRadius={15} width={'70%'} />

            <MaterialTextInput value={interests} onChangeText={setInterests} placeholder={'Tell us your interests'} multiline={true} placeholderTextColor={'lightgray'} backgroundColor={'#474747'} borderRadius={15} width={'70%'} />


          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={{ color: 'lightgray', textAlign: 'center', marginBottom: 10, marginTop: -10 }}>Already have an account? Login</Text>
          </TouchableOpacity>
          <View style={styles.alignCenter} >
            <MaterialButton height={50} onPress={handleRegister}  isLoading={loading} fontSize={16} text={'Register'} textColor={'#333333'} backgroundColor={'#FF5A66'} borderRadius={20} width={'70%'} />
          </View>
        </View>

      </View>
    </KeyboardAwareScrollView>
  )
}

export default RegisterScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333333',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    minHeight: Dimensions.get('window').height,
    marginBottom: Dimensions.get('screen').height-Dimensions.get('window').height
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
