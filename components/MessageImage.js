import React, {useState} from 'react'
import { TouchableOpacity, StyleSheet, Image, View, Text,  } from 'react-native'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import OptionsMenu from './OptionsMenu'
import ImageInfo from './ImageInfo'
import database from '@react-native-firebase/database'
import Toast from 'react-native-simple-toast';
import DeleteModal from './DeleteModal'
dayjs.extend(relativeTime)


const MessageImage = ({source='', isMe=false, onPress=()=>{}, time='', sendBy='', timeid='', authid='', uid=''}) => {
  const [visible, setVisible] = useState(false)
  const [info, setInfo] = useState(false)
  const [delModal, setDelModal] = useState(false)
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
    <View  style={{alignItems: isMe?'flex-end':'flex-start', marginBottom: 10}}>
     {!isMe && <Text style={{textAlign: 'right',fontSize: 12, backgroundColor: 'white' , color: 'gray', borderTopLeftRadius: 15, borderTopRightRadius: 15, padding: 5, }}>{dayjs(time).fromNow()}</Text>}
    <TouchableOpacity onLongPress={()=>setVisible(true)} onPress={onPress} style={[styles.imageContainer, {borderTopLeftRadius: isMe? 15: 0, borderBottomRightRadius: isMe? 0: 15, backgroundColor: isMe?'#FF5A66':'white', borderBottomLeftRadius: 15, borderTopRightRadius: 15}]}>
    <Image style={styles.image} source={{uri: source}} />
  </TouchableOpacity>
 {isMe && <Text style={{textAlign: 'right',fontSize: 12, backgroundColor: '#FF5A66', color: 'lightgray', borderBottomLeftRadius: 15, borderBottomRightRadius: 15, padding: 5}}>{dayjs(time).fromNow()}</Text>}
 
  </View>
   <OptionsMenu visible={visible} onDelete={onDelete} onInfo={()=>{
    setVisible(false)
    setInfo(true)
  }} onRequestClose={()=>setVisible(false)} />

  <ImageInfo  visible={info} isMe={isMe} onRequestClose={()=>setInfo(false)} source={source} time={time} sendBy={sendBy} />
  <DeleteModal visible={delModal} isMe={isMe} onRequesClose={()=>setDelModal(false)} deleteForEveryone={deleteForEveryone} deleteForMe={deleteForMe} />
  </>
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