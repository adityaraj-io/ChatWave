import React from 'react';
import { View, Modal, StyleSheet, Image, Text } from 'react-native';

const NetworkModal = ({visible}) => {
  return (
    <Modal transparent={true} visible={visible} animationType="slide">
      <View style={styles.modalBackground}>
        <View style={styles.container} >
            <View style={styles.imgContainer}>
            <Image style={styles.image} source={require('../assets/images/embarrassed.png')} />
            </View>
            <Text style={styles.title}>Whoops!!</Text>
            <Text style={{color: 'lightgray'}}>No Internet Connection found</Text>
            <Text style={{color: 'lightgray'}}>Check your connection</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    backgroundColor: 'white',
    height: 350,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    backgroundColor: '#333333',
    alignItems: 'center',
    justifyContent: 'center'
  },
  image :{
    width: 100,
    height: 100,
  },
  imgContainer: {
    backgroundColor: 'gray',
    padding:15,
    borderRadius: 400
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color:'white',
    marginTop: 10
  }
});

export default NetworkModal;
