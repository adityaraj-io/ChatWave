import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const Chat = ({message='', time='',onPress=()=>{}, isMe=false}) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.msgContainer, {alignSelf: isMe? 'flex-end':'flex-start', backgroundColor: isMe?'#FF5A66':'white', flexDirection: message.length<=24?'row':'column'}]}>
        <Text style={[styles.msgText, {color: isMe?'white':'#101010'}]} >{message}</Text>
        <View style={styles.msgTimeContainer}>
            <Text style={[styles.msgTime, {color: isMe?'lightgray':'gray'}]}>{time}</Text>
        </View>
      </TouchableOpacity>
  )
}

export default Chat

const styles = StyleSheet.create({
    msgContainer: {
      padding: 7,
      borderRadius: 5,
      overflow: 'visible',
      marginVertical: 5,
      maxWidth: '90%'
      
    },
    msgText: {
      color: '#FF5A66',
      fontSize: 17,
      marginRight: 10,
    },
    msgTime:{
      color: 'gray',
      fontSize: 12,
      marginHorizontal: 5
    },
    msgTimeContainer:{
      alignSelf: 'flex-end',
      marginTop: 5
    }
})