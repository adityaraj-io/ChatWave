import React from 'react'
import { StyleSheet, View, TextInput, Image, TouchableOpacity } from 'react-native'

const MessageInput = ({value, onChangeText, onSend=()=>{}, disabledSend=false, onImagePress=()=>{}}) => {
  return (
    <View style={[styles.inputContainer]}>
      <View style={styles.inputData}>
        <TouchableOpacity onPress={onImagePress} style={styles.cameraContainer}>
        <Image style={styles.camera} source={require('../assets/images/image.png')}/>
        </TouchableOpacity>
        <TextInput placeholderTextColor={'lightgray'} value={value||null} onChangeText={onChangeText||null} style={{paddingStart: 10, color: 'lightgray', width:'85%', marginRight: 50}} placeholder='Type Some Message'  />
      </View>
      <View style={styles.imgView}>
      <TouchableOpacity disabled={disabledSend} onPress={onSend} style={[styles.imgContainer,{backgroundColor: disabledSend?'lightgray':'#FF5A66'}]}>
        <Image style={styles.send} source={require('../assets/images/send.png')} />
      </TouchableOpacity>
      </View>
    </View>
  )
}

export default MessageInput

const styles = StyleSheet.create({
    inputContainer: {
        backgroundColor: '#444444',
        flexDirection: 'row',
        padding: 10,
        alignSelf: 'flex-end',
      },
      inputData: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#333333',
        padding: 0,
        flex: 1,
        flexDirection: 'row',
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
        padding: 12,
        borderRadius: 100,
      },
      camera: {
        width: 15,
        height: 15,
        tintColor: 'white',
      },
      cameraContainer: {
        padding: 7,
        marginLeft: 45,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#555555',
        borderRadius: 40
      }
})
