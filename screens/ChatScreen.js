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
  const [isLoading, setIsLoading] = useState(true)
  const [badge, setBadge] = useState(0)

  navigation.setOptions({
    headerTitle: () => <TouchableOpacity onPress={()=>navigation.navigate('SeeProfile', {username: username, image: recieverData.profileImage, about: recieverData.about, email: recieverData.email, interests: recieverData.interests, status: recieverData.status})} style={{flex: 1, backgroundColor: '#333333'}}>
      <Text style={{color: 'lightgray', fontSize: 18, fontWeight: 'bold'}}>{username}</Text>
      {recieverData.status && <Text style={{color: 'lightgray', fontSize: 12}}>{recieverData.status}</Text>}
    </TouchableOpacity>,
    
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
                scrollRef.current.scrollToEnd({ animated: true })
              }
              
          }

        })
      } catch (error) {
        setLoading(false);
        setErr(true);
      }
    })();
    (async()=>{
      await getSenderData();
      await getRecieverData();
      await checkStoragePermission();
      await updateSenderData();
      await getRecieverBadge();
      setIsLoading(false)
      if (scrollRef.current) {
        scrollRef.current.scrollToEnd({ animated: true });
      }
    })();




  }, [])

  const getSenderData = () => {
    try {
      database()
        .ref(`/users/${authid}`)
        .on('value', (snapshot) => {
          const userData = snapshot.val();
          if (userData) {
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
            console.log('Err');
          }
        })
        
    } catch (error) {
      console.log(error.message);
    }
  };


  const getRecieverData = () => {
    try {
      database()
        .ref(`/users/${uid}`)
        .on('value', (snapshot) => {
          const userData = snapshot.val();
          if (userData) {
            const recieverName = userData.name;
            const recieverProfile = userData.profileImage;
            setRecieverData({
              name: recieverName,
              profileImage: recieverProfile,
              interests: userData.interests,
              email: userData.email,
              about: userData.about,
              status: userData.status,
            })
          } else {
            
          }
        })
        
    } catch (error) {
      console.log(error.message);
    }
  }

  const updateSenderData = async () => {
    try {
      const reference = database().ref(`/users/${authid}/chats/${uid}`);
      const snapshot = await reference.once('value');
      
      if (snapshot.exists()) {
        console.log("Snapshot value:", snapshot.val());
  
        if (snapshot.val().unreadMessages !== undefined) {
          await reference.update({
            unreadMessages: 0,
          });
          console.log("Unread messages updated to 0");
        } else {
          console.log("unreadMessages exists but is undefined");
          await reference.update({
            unreadMessages: 0,
          });
          console.log("Unread messages updated to 0");
        }
      } else {
        console.log("Chat node doesn't exist");
      }
    } catch (error) {
      console.error("Error updating sender data:", error);
    }
  };

  const getRecieverBadge = async () => {
    try {
      const reference = database().ref(`/users/${uid}/chats/${authid}`);
      const snapshot = await reference.once('value');
      
      if (snapshot.exists()) {
        console.log("Snapshot value:", snapshot.val());
  
        if (snapshot.val().unreadMessages !== undefined) {
          setBadge(snapshot.val().unreadMessages);
          console.log("Badge gotten");
        } else {
          setBadge(0);
          console.log("unreadMessages doesn't exist");
          console.log("Badge set to 0");
        }
      } else {
        console.log("Chat node doesn't exist");
      }
    } catch (error) {
      console.error("Error getting receiver badge:", error);
    }
  };


  const sendMessage = async() => {
   try {
    if(message.trim()===''){

    }else{
      let msg = message.length>10?message.trim().slice(0,5)+'...':message.trim();
      try {
        const timeid = new Date().getTime();
        const senderReference = database().ref(`/users/${authid}/messages/${uid}/${timeid}`)
        const senderChatReference = database().ref(`/users/${authid}/chats/${uid}`)
        const recieverChatReference = database().ref(`/users/${uid}/chats/${authid}`)
        const receiverReference = database().ref(`/users/${uid}/messages/${authid}/${timeid}`)
        setMessage('')

        await senderReference.set({
          id: authid,
          message: message.trim(),
          time: new Date().toISOString(),
          type: 'text',
          timeid: timeid,
        });
    
        await receiverReference.set({
          id: authid,
          message: message.trim(),
          time: new Date().toISOString(),
          type: 'text',
          timeid: timeid,
        });


      await senderChatReference.update({
        id: uid,
        profileImage: recieverData.profileImage,
        username: recieverData.name,
        lastMessage: 'You - '+msg,
        lastMessageTime: new Date().toISOString(),
      }).catch((err)=>{
        console.log(err.message)
      })

      if(recieverData.status==='offline'){
        await recieverChatReference.update({
          id: authid,
          profileImage: senderData.profileImage,
          username: senderData.name,
          lastMessage: msg,
          lastMessageTime: new Date().toISOString(),
          unreadMessages: badge+1,
        }).catch((err)=>{
          console.log(err.message)
        }).then(()=>{
          console.log('Updated Value of unread messsages');
          setBadge(badge+1)
        })
      }else{
        await recieverChatReference.update({
          id: authid,
          profileImage: senderData.profileImage,
          username: senderData.name,
          lastMessage: msg,
          lastMessageTime: new Date().toISOString(),
        }).catch((err)=>{
          console.log(err.message)
        }).then(()=>{
          console.log('Done');
        })
      }

      } catch (error) {
        console.log(error.message)
        alert(error.message)
      }
      
    }
   } catch (error) {
    console.error("Error sending message:", error);

   }
  }


  const handle_Select_Image = async() => {
    await launchImageLibrary({selectionLimit: 1, assetRepresentationMode: 'auto', quality: 1, mediaType: 'photo'}, async({assets, didCancel, errorCode, errorMessage})=>{
        if(didCancel){
            console.log('cancelled');
        }else{
            if(errorCode==null){
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
                console.log(errorCode)
            }
        }
    })
}

const sendImage = async (path, fileName) => {
  // const timeid = new Date().getTime();
  try {
    setIsModal(true);

    const reference = storage().ref(`/chat-pics/${fileName}`);
    const task = reference.putFile(path);

    task.on('state_changed', (taskSnapshot) => {
      const transfer = ((taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100).toFixed(1).toString() + '%';
      setTransferred(transfer);
    });

    await task;

    const url = await reference.getDownloadURL();
    const timeid = new Date().getTime();
    const senderReference = database().ref(`/users/${authid}/messages/${uid}/${timeid}`);
    const senderChatReference = database().ref(`/users/${authid}/chats/${uid}`);
    const receiverReference = database().ref(`/users/${uid}/messages/${authid}/${timeid}`);
    const receiverChatReference = database().ref(`/users/${uid}/chats/${authid}`);
    setMessage('');

    // Send image message
    await senderReference.set({
      id: authid,
      imageSource: url,
      time: new Date().toISOString(),
      type: 'image',
      timeid: timeid,
    });

    await receiverReference.set({
      id: authid,
      imageSource: url,
      time: new Date().toISOString(),
      type: 'image',
      timeid: timeid,
    });

    // Update chat data
    await senderChatReference.update({
      id: uid,
      profileImage: recieverData.profileImage,
      username: recieverData.name,
      lastMessage: 'You sent a photo',
      lastMessageTime: new Date().toISOString(),
    });

    await receiverChatReference.update({
      id: authid,
      profileImage: senderData.profileImage,
      username: senderData.name,
      lastMessage: 'Photo',
      lastMessageTime: new Date().toISOString(),
      unreadMessages: badge + 1,
    });

    setBadge(badge + 1);
    setIsModal(false);

  } catch (error) {
    console.error("Error sending image:", error);
    alert("Error sending image. Please try again.");
    setIsModal(false);
  }
};


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
    <KeyboardAvoidingView keyboardVerticalOffset={60} behavior={'padding'} style={styles.container}>
      <ScrollView ref={scrollRef} onLayout={() => scrollRef.current.scrollToEnd({ animated: true })}>
      <EncryptMessage />
      {isLoading && <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: Dimensions.get('window').height-Dimensions.get('window').width}}>
      <ActivityIndicator size={'large'} color={'#FF5A66'} />

      </View>}
      <View style={{paddingHorizontal: 10, paddingBottom: 10}}>
        {(data)
              .sort((a, b) => {
                // Parse the time strings and compare them
                const timeA = new Date(a.time);
                const timeB = new Date(b.time);
                return timeA - timeB;
              })
              .map((item, index) => (
                item.type === 'text' ? (
                  <Chat
                    message={item.message}
                    key={index} // Assuming "id" is unique and can be used as a key
                    isMe={item.id === authid}
                    time={item.time}
                    sendBy={item.id === authid?'You': username.toString()}
                    timeid={item.timeid}
                    uid={uid}
                    authid={authid}
                  />
                ) : item.type === 'image' ? (
                  <MessageImage
                    time={item.time}
                    source={item.imageSource} // Assuming you have an "imageSource" property
                    isMe={item.id === authid}
                    sendBy={item.id === authid?'You': username.toString()}
                    timeid={item.timeid}
                    uid={uid}
                    authid={authid}
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
