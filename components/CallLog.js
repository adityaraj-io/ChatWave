import React from 'react'
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native'
const CallLog = ({userName='User Name Here', inComing=true, profileImageUri='', time='', borderShown=true, onProfileImagePress=()=>{}, duration=''}) => {
  return (
    <TouchableOpacity style={[styles.container, {borderBottomWidth: borderShown? StyleSheet.hairlineWidth:null}]}>
      <TouchableOpacity onPress={onProfileImagePress}>
        <Image style={styles.image} source={{uri: profileImageUri||'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/user.png'}} />
      </TouchableOpacity>
      <View style={styles.info}>
        <View style={styles.textContainer}>
            <Text style={styles.profileText}>{userName}</Text>
            <Text style={{color: '#777777'}}>{inComing? <Image source={require('../assets/images/incoming-call.png')} style={styles.callStatus}/>:<Image source={require('../assets/images/outgoing-call.png')} style={styles.callStatus} />} {time}</Text>
        </View>
       
        <View style={styles.timeContainer}>
            <Text style={{fontSize: 11, color: 'lightgray'}} >Call Ended in {duration||'0'+ ' seconds'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default CallLog

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
        fontSize: 17,
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
        width: 60,
        height: 60,
        backgroundColor: 'lightgray',
        borderRadius: 400,
        padding: 10
    },
    timeContainer: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    callStatus: {
        width: 15,
        height: 15,
    }
})