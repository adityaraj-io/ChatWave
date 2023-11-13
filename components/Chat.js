import React, {useState} from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Toast from 'react-native-simple-toast';
import OptionsMenu from './OptionsMenu'
import InfoModal from './InfoModal'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import database from '@react-native-firebase/database'
import DeleteModal from './DeleteModal';
dayjs.extend(relativeTime)

const Chat = ({ message = '', time = '', onPress = () => { }, isMe = false, sendBy='', timeid='', uid='', authid='' }) => {
  const [visible, setVisible] = useState(false)
  const [info, setInfo] = useState(false)
  const [delModal, setDelModal] = useState(false);
  const onDelete = async() => {
    setVisible(false)
    setDelModal(true)

  }
  const deleteForEveryone = async() => {
    setDelModal(false)
    try {
        Toast.show('Please Wait..');
        await database().ref(`/users/${authid}/messages/${uid}/${timeid}`).remove(async()=>{
          // Toast.show('Message Deleted');
          await database().ref(`/users/${uid}/messages/${authid}/${timeid}`).remove(()=>{
            Toast.show('Message Deleted');
          })
        })
      } catch (error) {
        alert(error.message)
      }
  
  }

  const deleteForMe = async() => {
    setDelModal(false)
    try {
        Toast.show('Please Wait..');
        await database().ref(`/users/${authid}/messages/${uid}/${timeid}`).remove(async()=>{
            Toast.show('Message Deleted');
        })
      } catch (error) {
        alert(error.message)
      }
  
  }
  
  return (
    <>
    <TouchableOpacity onLongPress={()=>setVisible(true)}  onPress={onPress} style={[styles.msgContainer, { alignSelf: isMe ? 'flex-end' : 'flex-start', backgroundColor: isMe ? '#FF5A66' : 'white', flexDirection: message.length <= 20 ? 'row' : 'column' }]}>
      <Text style={[styles.msgText, { color: isMe ? 'white' : '#101010' }]} >{message}</Text>
      <View style={styles.msgTimeContainer}>
        <Text style={[styles.msgTime, { color: isMe ? 'lightgray' : 'gray' }]}>{dayjs(time).fromNow()}</Text>
      </View>
    </TouchableOpacity>

    <OptionsMenu onDelete={onDelete} visible={visible} onInfo={()=>{
      setVisible(false)
      // console.log(timeid)
      setInfo(true)
    }} onRequestClose={()=>setVisible(false)} />
    <InfoModal message={message} time={time} isMe={isMe} visible={info} sendBy={sendBy} onRequestClose={()=>setInfo(false)} />
    <DeleteModal deleteForEveryone={deleteForEveryone} deleteForMe={deleteForMe} visible={delModal} onRequesClose={()=>setDelModal(false)} isMe={isMe}/>
    </>
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
  msgTime: {
    color: 'gray',
    fontSize: 12,
    marginHorizontal: 5
  },
  msgTimeContainer: {
    alignSelf: 'flex-end',
    marginTop: 5
  }
})