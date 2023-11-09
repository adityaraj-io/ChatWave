import React, { useEffect, useState } from 'react'
import { Alert, Image, StyleSheet, TouchableOpacity, View, Text, PermissionsAndroid, ActivityIndicator } from 'react-native'
import { DEFAULT_PROFILE_URI, DEFAULT_URI_PIC, THEME_COLOR } from '../constants'
import { launchImageLibrary} from 'react-native-image-picker';
import MaterialButton from '../components/MaterialButton';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import LoadingModal from '../components/LoadingModal';
import database from '@react-native-firebase/database';
import { CommonActions, useNavigation } from '@react-navigation/native';


const EditImage = ({route}) => {
  const navigation = useNavigation();
    const { register } = route.params || false;
    const [user, setUser] = useState();
    const [initializing, setInitializing] = useState(true);
    const [loading, setLoading] = useState(false)
    const [transferred, setTransferred] = useState('0%')
    const [imageUri, setImageUri] = useState(DEFAULT_PROFILE_URI)
    const [path, setPath] = useState(null)
    const [filename, setFilename] = useState(null)
    const [load, setLoad] = useState(false);
    const [isPermission, setIsPermission] = useState(false)

    const checkStoragePermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'ChatWave Storage Permission',
            message:
              'ChatWave needs access to your storage ' +
              'so you can add profile picture',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // console.log('You can use the camera');
          setIsPermission(true)
        } else {
          console.log('Camera permission denied');
          setIsPermission(true)
        }
      } catch (err) {
        // console.warn(err);
        setIsPermission(true)

      }
    };

    const skipProfileImage = () => {
      setLoad(true)
      database().ref(`/users/${user.uid}`).update({
        profileImage: DEFAULT_URI_PIC,
      }).then(()=>{
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Main' }],
          })
        );
        setLoad(false)
      }).catch((error)=>{
        alert('Please Chheck your network connection and try again.')
        setLoad(false)
      })
    }
    function onAuthStateChanged(user) {
        setUser(user);
        if (initializing) setInitializing(false);
    }
    
    const uploadAndUpdateData = async() => {
        if(isPermission){
            const reference = storage().ref(`/profile-pics/${user.uid}/${filename}`);
            setLoading(true)
            const task = reference.putFile(path)
            task.on('state_changed', taskSnapshot=>{
                // console.log(taskSnapshot.b)
                let transfer = taskSnapshot.bytesTransferred / taskSnapshot.totalBytes * 100
                transfer = (transfer).toFixed(1).toString()+'%'
                setTransferred(transfer)
            })
        // task.error
            task.then(async()=>{
                
                const url = await reference.getDownloadURL();
                  database().ref(`/users/${user.uid}`).update({
                    profileImage: url,
                  }).then(()=>{
                    try {
                        setLoading(false)
                        if(register){
                          navigation.dispatch(
                            CommonActions.reset({
                              index: 0,
                              routes: [{ name: 'Main' }],
                            })
                          );
                        }else{
                          Alert.alert(
                            'Success',
                            'Profile Image Set Successfully',
                            [
                                  {text: 'OK'},
                            ],
                            {cancelable: false})
                        }
                    } catch (error) {
                      console.log(err)
                      setLoading(false)
                      if(register){
                        navigation.dispatch(
                          CommonActions.reset({
                            index: 0,
                            routes: [{ name: 'Main' }],
                          })
                        );
                      }else{
                        Alert.alert(
                          'Success',
                          'Profile Image Set Successfully',
                          [
                                {text: 'OK'},
                          ],
                          {cancelable: false})
                      }
                    }
                  }).catch((error)=>{
                    Alert.alert(
                      'Failed',
                      'Profile Image not set. Try Again',
                      [
                            {text: 'OK'},
                      ],
                      {cancelable: false}
                  )
                  setLoading(false)

                  })
            }).catch((error)=>{
              Alert.alert(
                  'Error',
                  error.message,
                  [
                        {text: 'OK'},
                  ],
                  {cancelable: false}
              )
              setLoading(false)

          })

        }
        else{
            Alert.alert(
                'Error',
                'Please Allow Storage Permission.',
                [
                       {text: 'OK'},
                ],
                {cancelable: false}
            )
        }
        
        
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        console.disableRedBox = true;
        checkStoragePermission();
        return subscriber; // unsubscribe on unmount
    }, []);

    

    const handle_Select_Image = async() => {
        await launchImageLibrary({selectionLimit: 1, assetRepresentationMode: 'auto', quality: 1, mediaType: 'photo'}, ({assets, didCancel, errorCode, errorMessage})=>{
            if(didCancel){
                setImageUri(DEFAULT_PROFILE_URI)
            }else{
                if(errorCode==null){
                    setImageUri(assets[0].uri)
                    setPath(assets[0].originalPath)
                    setFilename(assets[0].fileName);

                    // console.log(assets)
                }else{
                    Alert.alert(
                        'Error',
                        errorMessage+ errorCode,
                        [
                               {text: 'OK'},
                        ],
                        {cancelable: false}
                    )
                    setImageUri(DEFAULT_PROFILE_URI)
                    console.log(errorCode)
                }
            }
        })
    }

    if(initializing){
      return <View style={[styles.container, {justifyContent: 'center'}]}>
      <ActivityIndicator size={'large'} color={'#FF5A66'} />
  </View>
    }
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handle_Select_Image} >
        <Image style={styles.image} source={{uri: imageUri}} />
        <Text style={styles.text}>Set Profile Image</Text>
      </TouchableOpacity>
      <View style={{width: '100%', alignItems: 'center', justifyContent: 'center', height: 200}}>
        <MaterialButton onPress={uploadAndUpdateData} text={'Save Changes'} width={'70%'} disabled={imageUri===DEFAULT_PROFILE_URI} backgroundColor={THEME_COLOR} isLoading={false||load} />
        {register && <View style={{width: '100%', alignItems: 'center', justifyContent: 'center', marginVertical: 10}}>
        <MaterialButton indicatorColor={'#fff'} disabled={load} onPress={skipProfileImage}  text={'Skip'} width={'70%'}backgroundColor={THEME_COLOR} isLoading={load} />

        </View>}
      </View>
      
      <LoadingModal visible={loading} isProgress progressWidth={transferred} />
      {/* <LoadingModal visible={false} /> */}
    </View>
  )
}

export default EditImage

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#333333',
        // minHeight: Dimensions.get('screen').height-90
      },
      image: {
        width: 250,
        height: 250,
        borderRadius: 500,
        borderColor: '#FF5A66',
        borderWidth: 5,
        marginTop: 20
      },
      text: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#fff'
      }
})