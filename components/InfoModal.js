import React from 'react';
import { View, Modal, StyleSheet, Text, TouchableOpacity } from 'react-native';
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

const InfoModal = ({ visible, onRequestClose = () => { }, sendBy = '', message = '', time = '', isMe = false }) => {
  const formattedTime = formatTime(time);

  return (
    <Modal transparent={true} animationType="slide" onRequestClose={onRequestClose} visible={visible}>
      <TouchableOpacity activeOpacity={1} onPress={onRequestClose} style={styles.modalBackground}>
        <View style={styles.ModalView}>
          <TouchableOpacity style={[styles.msgContainer, { alignSelf: 'flex-start', backgroundColor: isMe ? '#FF5A66' : 'white', flexDirection: message.length <= 20 ? 'row' : 'column' }]}>
            <Text style={[styles.msgText, { color: isMe ? 'white' : '#101010' }]}>{message}</Text>
            <View style={styles.msgTimeContainer}>
              <Text style={[styles.msgTime, { color: isMe ? 'lightgray' : 'gray' }]}>{dayjs(time).fromNow()}</Text>
            </View>
          </TouchableOpacity>
          <Text style={[styles.text, {color: 'gray'}]}>Send by {sendBy}</Text>
          <Text style={styles.text}>on {formattedTime}</Text>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };
  const formatter = new Intl.DateTimeFormat('en-US', options);
  return formatter.format(date);
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0)',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
    },
    ModalView: {
        width: '100%',
        // height: 200,
        backgroundColor: 'lightgray',
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        padding: 20

    },
    text: {
        color: 'black',
        fontSize: 15,
        // flex: 1
        // fontWeight: 'bold',
        textAlign: 'left'
    },
    image: {
        width: 20,
        height: 20,
        marginRight: 10
    },
    msgContainer: {
        padding: 7,
        borderRadius: 5,
        overflow: 'visible',
        marginVertical: 5,
        // maxWidth: '90%'

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
});

export default InfoModal;
