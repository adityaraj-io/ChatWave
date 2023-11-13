import React from 'react'
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native'
const Message = ({onPress=()=>{}, userName='User Name Here', profileImageUri='', lastMessage, isBadgeShown=false, badgeCount, lastMessageTime='', borderShown=true, onProfileImagePress=()=>{}}) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, {borderBottomWidth: borderShown? StyleSheet.hairlineWidth:null}]}>
      <TouchableOpacity onPress={onProfileImagePress}>
        <Image style={styles.image} source={{uri: profileImageUri||'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/user.png'}} />
      </TouchableOpacity>
      <View style={styles.info}>
        <View style={styles.textContainer}>
            <Text style={styles.profileText}>{userName}</Text>
            <Text style={{color: '#777777'}}>{lastMessage}</Text>
        </View>
        <View style={styles.timeContainer}>
            <Text style={{color: 'lightgray', fontSize: 12}} >{lastMessageTime}</Text>
            {isBadgeShown && <Text style={styles.badge}>{badgeCount}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default Message

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,
        flexDirection: 'row',
        padding: 10,
        marginVertical: 2,       
        borderBottomColor: 'gray',
    },
    profileText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'lightgray'
    },
    info:{
        flex: 1,
        flexDirection: 'row',
        marginLeft: 10,
    },
    textContainer: {
        flex: 1
    },
    image: {
        width: 70,
        height: 70,
        backgroundColor: 'lightgray',
        borderRadius: 400,
        padding: 10
    },
    timeContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    badge: {
      backgroundColor: '#FF5A66',
      paddingHorizontal: 7,
      borderRadius: 50,
      color: 'white'
    }
})