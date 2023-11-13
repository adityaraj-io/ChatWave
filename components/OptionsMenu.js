import React from 'react';
import { View, Modal, StyleSheet, Text, Touchable, Image } from 'react-native';
import { TouchableOpacity } from 'react-native';

const OptionsMenu = ({ visible, onRequestClose=()=>{}, onDelete=()=>{}, onInfo=()=>{} }) => {
    
  return (
    <Modal transparent={true} animationType="slide" onRequestClose={onRequestClose} visible={visible}>
      <TouchableOpacity activeOpacity={1} onPress={onRequestClose}  style={styles.modalBackground}>
        <View style={styles.ModalView}>
            <TouchableOpacity onPress={onDelete} style={[styles.modalOption,{borderBottomColor: 'lightgray',borderTopRightRadius: 15,
            borderTopLeftRadius: 15, borderBottomWidth: StyleSheet.hairlineWidth}]}>
            <Image style={styles.image} source={require('../assets/images/delete.png')} />
            <Text style={styles.text}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onInfo} style={[styles.modalOption]}>
            <Image style={styles.image} source={require('../assets/images/info.png')} />
            <Text style={styles.text}>Info</Text>
            </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  ModalView:{
    width: '100%',
    // height: 200,
    backgroundColor: 'lightgray',
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15

  },
  modalOption: {
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'center',
    // height: 50,
    padding: 20,
    backgroundColor: '#fff',
    flexDirection: 'row'
  },
  text: {
    color: 'black',
    fontSize: 15,
    flex: 1
  },
  image: {
    width: 20,
    height: 20,
    marginRight: 10
  }
});

export default OptionsMenu;
