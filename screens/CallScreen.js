import React from 'react'
import { View, StyleSheet, Text, StatusBar, FlatList, TouchableOpacity, Image } from 'react-native'
import CallLog from '../components/CallLog'
import chats from '../data/chats.json'
const CallScreen = () => {
  const callLogs = chats.callLogs;
  return (
    <View style={styles.container}>
      {/* <Text>Call Screen</Text> */}
      <TouchableOpacity style={styles.searchContainer}>
        <Image style={styles.searchImage} source={require('../assets/images/search.png')} />
        <Text style={styles.searchText}>Search Call Logs</Text>
      </TouchableOpacity>
      <FlatList
       data={callLogs}
       style={{width: '100%'}}
       renderItem={({item, index})=><CallLog 
          userName={item.username}
          inComing={item.incoming}
          profileImageUri={item.profileImage}
          duration={item.duration}
          time={item.time}
       />}
      />
    </View>
  )
}

export default CallScreen

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        flex: 1,
        backgroundColor: '#333333',
        paddingTop: StatusBar.currentHeight
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
      // width: 100
      color: '#888888'
    }
})
