import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Image, FlatList, Dimensions, ActivityIndicator } from 'react-native'
import Message from '../components/Message'
import ImageView from "react-native-image-viewing";
import { useNavigation } from '@react-navigation/native'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import database from '@react-native-firebase/database'
import auth from '@react-native-firebase/auth'
dayjs.extend(relativeTime)


const HomeScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState();
  const [initializing, setInitializing] = useState(true);
  const [dataInitializing, setDataInitializing] = useState(true);
  const [errorData, setErrorData] = useState(false);
  const [data, setData] = useState([]);
  const [images, setImages] = useState([])
  const [visible, setIsVisible] = useState(false);


  function setUserData(uid=''){
   if(uid!==null||undefined){
    try {
      database()
    .ref(`/users/${uid}/chats`)
    .on('value', snapshot => {
      if(snapshot.val()!==null&&snapshot.val()!==undefined){
        setData(Object.values(snapshot.val()))
      }
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
    return subscriber; 
    
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
    <View style={styles.container}>

      <TouchableOpacity onPress={()=>navigation.navigate('Conversation')} style={styles.searchContainer}>
        <Image style={styles.searchImage} source={require('../assets/images/search.png')} />
        <Text style={styles.searchText}>Search Here</Text>
      </TouchableOpacity>

        <FlatList 
          style={{width: '100%'}}
          data={data}
          ListEmptyComponent={<View style={{height: Dimensions.get('screen').height-Dimensions.get('window').height/3.5, width: '100%', justifyContent: 'center', alignItems: 'center', }}>
            <Text style={{fontSize: 16, color: 'lightgray'}}>No Messages to show</Text>
            <TouchableOpacity onPress={()=>navigation.navigate('Conversation')}>
            <Text style={{color:'#FF5A66', fontSize: 16}}>Start Conversation</Text>
            </TouchableOpacity>
          </View>}
          renderItem={({item, index})=>
          <Message 
            key={index}
            userName={item.username} 
            lastMessage={item.lastMessage}
            lastMessageTime={dayjs(item.lastMessageTime).fromNow()}
            profileImageUri={item.profileImage}
            onPress={()=>navigation.navigate('Chat', {username: item.username, uid: item.id, authid: user.uid})}
            onProfileImagePress={async()=>{
              await setImages([
                {uri: item.profileImage}
              ]);

              setIsVisible(true)
            }}
          />} 
          
        />
        <ImageView
          images={images}
          imageIndex={0}
          visible={visible}
          onRequestClose={() => setIsVisible(false)}
        />

    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        flex: 1,
        backgroundColor: '#333333',
        marginTop: StatusBar.currentHeight-10
    },
    searchImage: {
      width: 20,
      tintColor: '#888888',
      height: 20,
      marginRight: 10,
    },
    searchContainer: {
      elevation: 3,
      flexDirection: 'row',
      width: '95%',
      marginVertical: 10,
      padding: 15,
      backgroundColor: '#555555',
      borderRadius: 10,

    },
    searchText: {
      color: '#888888'
    }
})
