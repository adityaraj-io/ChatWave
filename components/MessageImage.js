import React from 'react'
import { TouchableOpacity, StyleSheet, Image, View, Text } from 'react-native'

const MessageImage = ({source='', isMe=false, onPress=()=>{}, time=''}) => {
  return (
    <View style={{alignItems: isMe?'flex-end':'flex-start', marginBottom: 10}}>
     {!isMe && <Text style={{textAlign: 'right',fontSize: 12, backgroundColor: 'white' , color: 'gray', borderTopLeftRadius: 15, borderTopRightRadius: 15, padding: 5, }}>{time}</Text>}
    <TouchableOpacity onPress={onPress} style={[styles.imageContainer, {borderTopLeftRadius: isMe? 15: 0, borderBottomRightRadius: isMe? 0: 15, backgroundColor: isMe?'#FF5A66':'white', borderBottomLeftRadius: 15, borderTopRightRadius: 15}]}>
    <Image style={styles.image} source={{uri: source}} />
  </TouchableOpacity>
 {isMe && <Text style={{textAlign: 'right',fontSize: 12, backgroundColor: '#FF5A66', color: 'lightgray', borderBottomLeftRadius: 15, borderBottomRightRadius: 15, padding: 5}}>{time}</Text>}
 
  </View>
  )
}

export default MessageImage

const styles = StyleSheet.create({
    
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        // flex: 1,
        width: '70%',
        height: 250,
        padding: 5,
        padding: 4,
        // borderRadius: 15
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 15,
        backgroundColor: '#444444'
    }
})