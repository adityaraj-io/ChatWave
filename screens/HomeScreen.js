import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Image, FlatList, Dimensions, ActivityIndicator } from 'react-native'
import Message from '../components/Message'
import ImageView from "react-native-image-viewing";
import { useNavigation } from '@react-navigation/native'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import database from '@react-native-firebase/database'
import auth from '@react-native-firebase/auth'
import MaterialTextInput from '../components/MaterialTextInput';
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
  const [query, setQuery] = useState('')
  const [filteredData, setFilteredData] = useState([]);

  const searchMessages = () => {
    const lowerCaseQuery = query.toLowerCase();
    const filteredMessages = data.filter(
      (item) =>
        item.username.toLowerCase().includes(lowerCaseQuery) ||
        item.lastMessage.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredData(filteredMessages);
  };

  function setUserData(uid=''){
   if(uid!==null||undefined){
    try {
      database()
    .ref(`/users/${uid}/chats`)
    .on('value', snapshot => {
      if(snapshot.val()!==null&&snapshot.val()!==undefined){
        setData(Object.values(snapshot.val()))
        console.log(Object.values(snapshot.val()));
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
    searchMessages();
    return subscriber; 
    
  },[]);

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
      <View style={styles.searchView}>
        <MaterialTextInput
          value={query}
          onChangeText={setQuery}
          placeholder={'Search with Email'}
          backgroundColor={'#444444'}
          width={'90%'}
          placeholderTextColor={'lightgray'}
          borderRadius={17}
          padding={5}
          onEndEditing={searchMessages}
        />
      </View>

      <FlatList
        style={{ width: '100%' }}
        data={query===''?data:filteredData}
          ListEmptyComponent={data.length > 0?<View style={styles.container}>
          <Text style={{color: 'lightgray'}}>No matches</Text>
      </View>:<View style={{height: Dimensions.get('screen').height-Dimensions.get('window').height/3.5, width: '100%', justifyContent: 'center', alignItems: 'center', }}>
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
            isBadgeShown={item.unreadMessages!==0&&item.unreadMessages!==undefined}
            badgeCount={item.unreadMessages===undefined? 0: item.unreadMessages}
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
    searchView: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: StatusBar.currentHeight
    },
})
