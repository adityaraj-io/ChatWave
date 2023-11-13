import React from 'react';
import { View, Modal, StyleSheet, Text, Image } from 'react-native';
import { TouchableOpacity } from 'react-native';

const DeleteModal = ({ visible, isMe=false, onRequesClose=()=>{}, deleteForMe=()=>{}, deleteForEveryone=()=>{} }) => {

  return (
    <Modal transparent={true} onRequestClose={onRequesClose} animationType="slide" visible={visible}>
      <TouchableOpacity activeOpacity={1} onPress={onRequesClose} style={styles.modalBackground}>
        <TouchableOpacity activeOpacity={1} style={styles.deleteView}>
            <View style={styles.imageView}>
            <Image style={styles.image} source={require('../assets/images/delete.png')} />
            </View>
            <Text style={styles.title}>Are you sure?</Text>
            <Text style={styles.subTitle}>This action cannot be undone. All values associated with this field will be lost</Text>

            <TouchableOpacity onPress={deleteForMe}  style={styles.delBtn}>
                <Text style={styles.btnText}>Delete For Me</Text>
            </TouchableOpacity>

            {isMe && <TouchableOpacity onPress={deleteForEveryone} style={styles.delBtn}>
                <Text style={styles.btnText}>Delete For Everyone</Text>
            </TouchableOpacity>}

            
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteView: {
    width: '90%',
    // height: 200,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  title: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold'
  },
  image: {
    width: 25,
    height: 25,
  },
  imageView: {
    padding:10,
    backgroundColor: 'lightgray',
    borderRadius: 30
  },
  subTitle: {
    color: 'gray',
    textAlign: 'center'
  },
  btnText: {
    color: 'white',
  },
  delBtn: {
    padding: 10,
    backgroundColor: '#FF5A66',
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginTop: 5
  },
});

export default DeleteModal;
