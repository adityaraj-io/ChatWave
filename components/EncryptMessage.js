import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'

const EncryptMessage = () => {
  return (
    <View style={styles.encryptContainer}>
        
        <Text style={{textAlign: 'center', color: 'lightgray', letterSpacing: 0.5}}><Image style={styles.image} source={require('../assets/images/lock.png')} />Messages are end-to-end encrypted. No one outside of this chat, not even ChatWave, can read or listen to them.</Text>
      </View>
  )
}

export default EncryptMessage

const styles = StyleSheet.create({
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
      image: {
        width: 15,
        height: 15,
        tintColor: 'white'
      },
})