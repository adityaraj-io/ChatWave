import React, { useEffect, useRef, useState } from 'react'
import { View,StyleSheet, Dimensions, Text, KeyboardAvoidingView, ScrollView, ActivityIndicator, PermissionsAndroid, TouchableOpacity, Image, Platform } from 'react-native'
import Chat from '../components/Chat'
import EncryptMessage from '../components/EncryptMessage'
import MessageInput from '../components/MessageInput'
import ImageView from "react-native-image-viewing";
import MessageImage from '../components/MessageImage'
import { useNavigation } from '@react-navigation/native'
import database from '@react-native-firebase/database'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import LoadingModal from '../components/LoadingModal'
import storage from '@react-native-firebase/storage';
import { launchImageLibrary} from 'react-native-image-picker';
dayjs.extend(relativeTime)


const ChatScreen = ({route}) => {
  const navigation = useNavigation();
  const {username, uid, authid} = route.params;
  const [message, setMessage] = useState('')
  const scrollRef = useRef(null);
  const [errorData, setErrorData] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false)
  const [senderData, setSenderData] = useState({});
  const [recieverData, setRecieverData] = useState({});
  const [transferred, setTransferred] = useState('0%')
  const [isModal, setIsModal] = useState(false)
  const [images, setImages] = useState([])
  const [visible, setIsVisible] = useState(false);
  const [isPermission, setIsPermission] = useState(false);

  navigation.setOptions({
    headerTitle: () => <TouchableOpacity onPress={()=>navigation.navigate('SeeProfile', {username: username, image: recieverData.profileImage, about: recieverData.about, email: recieverData.email, interests: recieverData.interests})} style={{flex: 1}}>
      <Text style={{color: 'lightgray', fontSize: 18, fontWeight: 'bold'}}>{username}</Text>
    </TouchableOpacity>,
    headerRight: () => <View style={{flexDirection: 'row', width: 'auto'}}>
      <TouchableOpacity style={{backgroundColor: '#444444', padding: 10, borderRadius: 30, marginRight: 10}}>
        <Image style={{width: 15, height: 15, padding: 10, tintColor: 'white'}} source={require('../assets/images/call_chat.png')} />
      </TouchableOpacity>
      <TouchableOpacity style={{backgroundColor: '#444444', padding: 10, borderRadius: 30}}>
        <Image style={styles.callImage} source={require('../assets/images/video-camera.png')} />
      </TouchableOpacity>
      
    </View>
  })

  const checkStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'ChatWave Storage Permission',
          message:
            'ChatWave needs access to your storage ' +
            'so you can add profile picture and send images',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // console.log('You can use the camera');
        setIsPermission(true)
      } else {
        console.log('Storage permission denied');
        console.log(granted);
        setIsPermission(false)
      }
    } catch (err) {
      console.log(err);
      setIsPermission(false)
    }
  };

  useEffect(()=>{
    (async()=>{
      try {
        let reference = database().ref(`/users/${authid}/messages/${uid}/`);
        await reference.on('value', async(snapshot)=>{
          if(snapshot!=null){
              if(snapshot){
                let result = Object.keys(snapshot.val()).map((key) => ({
                  id: key,
                  ...snapshot.val()[key],
                }));
                console.log(result)
                await setData(result);
                // setLoading(false);

              }
              
              // setLoading(false);
          }
          // setLoading(false);

        })
      } catch (error) {
        setLoading(false);
        setErr(true);
      }
    })()
    getSenderData();
    getRecieverData();
    checkStoragePermission();
    if (scrollRef.current) {
      scrollRef.current.scrollToEnd({ animated: true });
    }

  }, [])

  const getSenderData = () => {
    try {
      database()
        .ref(`/users/${authid}`)
        .once('value', (snapshot) => {
          const userData = snapshot.val();
          if (userData) {
            // Assuming that "name" is a property in the userData object
            const senderName = userData.name;
            const senderProfile = userData.profileImage;
            console.log('Name Below - Sender');
            console.log(userData.name)
            console.log(userData.profileImage)
            console.log(userData.uid)
            setSenderData({
              uid: uid,
              name: senderName,
              profileImage: senderProfile,
            })
          } else {
            // Handle the case where userData is not available
          }
        })
        .catch((error) => {
          console.log(error.message);
        });
    } catch (error) {
      console.log(error.message);
    }
  };

  const getRecieverData = () => {
    try {
      database()
        .ref(`/users/${uid}`)
        .once('value', (snapshot) => {
          const userData = snapshot.val();
          if (userData) {
            // Assuming that "name" is a property in the userData object
            const recieverName = userData.name;
            const recieverProfile = userData.profileImage;
            console.log('Name Below - Reciever');
            console.log(userData.name)
            console.log(userData.uid)
            console.log(userData.profileImage)
            console.log('Receiver- Interests');
            console.log(userData.email)
            setRecieverData({
              name: recieverName,
              profileImage: recieverProfile,
              interests: userData.interests,
              email: userData.email,
              about: userData.about,
            })
          } else {
            // Handle the case where userData is not available
          }
        })
        .catch((error) => {
          console.log(error.message);
        });
    } catch (error) {
      console.log(error.message);
    }
  }

  const sendMessage = async() => {
    if(message===''){

    }else{
      let msg = message;
      try {
        const senderReference = database().ref(`/users/${authid}/messages/${uid}`)
        const senderChatReference = database().ref(`/users/${authid}/chats/${uid}`)
        const recieverChatReference = database().ref(`/users/${uid}/chats/${authid}`)
        const receiverReference = database().ref(`/users/${uid}/messages/${authid}`)
        setMessage('')

      await senderReference.push({
        id: authid,
        message: msg,
        time: new Date().toISOString(),
        type: 'text',
      });
      await receiverReference.push({
        id: authid,
        message: msg,
        time: new Date().toISOString(),
        type: 'text',
      })
      await senderChatReference.update({
        id: uid,
        profileImage: recieverData.profileImage,
        username: recieverData.name,
        lastMessage: msg,
        lastMessageTime: new Date().toISOString(),
      }).catch((err)=>{
        console.log(err.message)
      })

      await recieverChatReference.update({
        id: authid,
        profileImage: senderData.profileImage,
        username: senderData.name,
        lastMessage: msg,
        lastMessageTime: new Date().toISOString(),
      }).catch((err)=>{
        console.log(err.message)
      })

      } catch (error) {
        console.log(error.message)
        alert(error.message)
      }
      
      // .then(()=>{
      //   console.log('Success')
        
      // }).catch((err)=>{
      //   console.log(err)
      // })
    }
  }

  const handle_Select_Image = async() => {
    await launchImageLibrary({selectionLimit: 1, assetRepresentationMode: 'auto', quality: 1, mediaType: 'photo'}, async({assets, didCancel, errorCode, errorMessage})=>{
        if(didCancel){
            // setImageUri(DEFAULT_PROFILE_URI)
            console.log('cancelled');
        }else{
            if(errorCode==null){
                // log
                if(Platform.OS==='android'){
                  if(Platform.Version<=33){
                    sendImage(assets[0].originalPath, assets[0].fileName)
                  }

                }else{
                  if(isPermission){
                    sendImage(assets[0].originalPath, assets[0].fileName)
                  }else{
                    await checkStoragePermission();
                    if(isPermission){
                      sendImage(assets[0].originalPath, assets[0].fileName)
                    }else{
                      alert('Please Allow the storage permission by going in the app settings.')                    
                    }
                  }
                }
                
            }else{
                Alert.alert(
                    'Error',
                    errorMessage+ errorCode,
                    [
                           {text: 'OK'},
                    ],
                    {cancelable: false}
                )
                // setImageUri(DEFAULT_PROFILE_URI)
                console.log(errorCode)
            }
        }
    })
}

  const sendImage = async(path, fileName) => {
      setIsModal(true)
      const reference = storage().ref(`/chat-pics/${fileName}`)
      const task = reference.putFile(path)
      task.on('state_changed', taskSnapshot=>{
        // console.log(taskSnapshot.b)
        let transfer = taskSnapshot.bytesTransferred / taskSnapshot.totalBytes * 100
        transfer = (transfer).toFixed(1).toString()+'%'
        setTransferred(transfer)

      })
      task.then(async()=>{
        const url = await reference.getDownloadURL();
        // let msg = message;
      try {
        const senderReference = database().ref(`/users/${authid}/messages/${uid}`)
        const senderChatReference = database().ref(`/users/${authid}/chats/${uid}`)
        const recieverChatReference = database().ref(`/users/${uid}/chats/${authid}`)
        const receiverReference = database().ref(`/users/${uid}/messages/${authid}`)
        setMessage('')

      await senderReference.push({
        id: authid,
        imageSource: url,
        time: new Date().toISOString(),
        type: 'image',
      });
      await receiverReference.push({
        id: authid,
        imageSource: url,
        time: new Date().toISOString(),
        type: 'image',
      })
      await senderChatReference.update({
        id: uid,
        profileImage: recieverData.profileImage,
        username: recieverData.name,
        lastMessage: 'Photo',
        lastMessageTime: new Date().toISOString(),
      }).catch((err)=>{
        console.log(err.message)
      })

      await recieverChatReference.update({
        id: authid,
        profileImage: senderData.profileImage,
        username: senderData.name,
        lastMessage: 'Photo',
        lastMessageTime: new Date().toISOString(),
      }).catch((err)=>{
        console.log(err.message)
      })

      setIsModal(false)

      } catch (error) {
        console.log(error.message)
        alert(error.message)
        setIsModal(false)
      }
      })
    


  }
  if(loading||errorData){
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
    <KeyboardAvoidingView keyboardVerticalOffset={30} behavior={'padding'} style={styles.container}>
      <ScrollView ref={scrollRef} onLayout={() => scrollRef.current.scrollToEnd({ animated: true })}>
      <EncryptMessage />

      <View style={{paddingHorizontal: 10, paddingBottom: 10}}>
        {(data)
              .sort((a, b) => {
                // Parse the time strings and compare them
                const timeA = new Date(a.time);
                const timeB = new Date(b.time);
                return timeA - timeB;
              })
              .map((item) => (
                item.type === 'text' ? (
                  <Chat
                    message={item.message}
                    key={item.id} // Assuming "id" is unique and can be used as a key
                    isMe={item.id === authid}
                    time={dayjs(item.time).fromNow(false)}
                  />
                ) : item.type === 'image' ? (
                  <MessageImage
                    time={dayjs(item.time).fromNow()}
                    source={item.imageSource} // Assuming you have an "imageSource" property
                    isMe={item.id === authid}
                    onPress={async()=>{
                      await setImages([{uri: item.imageSource}]);
        
                      setIsVisible(true)
                    }}
                  />
                ) : null
              ))

        }
      </View>
      

      </ScrollView>
      
      <View style={{marginBottom: Dimensions.get('screen').height-Dimensions.get('window').height}}>
        <MessageInput onImagePress={handle_Select_Image} onSend={sendMessage} value={message} onChangeText={setMessage} />
      </View>
      <LoadingModal visible={isModal} progressWidth={transferred} isProgress />
      <ImageView
          images={images}
          imageIndex={0}
          visible={visible}
          onRequestClose={() => setIsVisible(false)}
      />
    </KeyboardAvoidingView>
  )
}

export default ChatScreen

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-start',
        flex: 1,
        backgroundColor: '#333333',
        minHeight: Dimensions.get('screen').height-Dimensions.get('screen').height/10,
        borderTopColor: 'gray',
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    image: {
      width: 15,
      height: 15,
      tintColor: 'white'
    },
    encryptContainer: {
      marginTop: 5,
      alignItems: 'center',
      justifyContent: 'center',
      maxWidth: '98%',
      backgroundColor: '#555555',
      alignSelf: 'center',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 10,
      marginBottom: 15,
    },
    inputContainer: {
      // position: 'absolute',
      backgroundColor: '#444444',
      flexDirection: 'row',
      padding: 5,
      alignSelf: 'flex-end',
      // paddingTop: 100
      // bottom: 0,
    },
    inputData: {
      // height: '100%',
      alignItems: 'flex-start',
      justifyContent: 'center',
      backgroundColor: '#333333',
      padding: 0,
      flex: 1,
      borderRadius: 10,
    },
    send: {
      width: 17,
      height: 17,
      tintColor: 'white'
    },
    imgView: {
      alignItems: 'center',
      justifyContent:'center',
      marginLeft: 7,
    },
    imgContainer: {
      backgroundColor: '#FF5A66',
      padding: 12,
      borderRadius: 100,
    },
    callImage :{
      width: 15,
      height: 15,
      tintColor: 'white',
      padding: 10
    }
})
