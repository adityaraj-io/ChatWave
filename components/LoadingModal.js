import React from 'react';
import { View, Modal, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { THEME_COLOR } from '../constants';

const LoadingModal = ({ visible, isProgress=false, progressWidth, text='', customText=false }) => {
  return (
    <Modal transparent={true} animationType="slide" visible={visible}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator animating={visible} size="large" color={THEME_COLOR} />
          

          {isProgress && <View style={styles.progress}>
            <View style={[styles.progresIndicator, {width: progressWidth, justifyContent: 'center', alignItems: 'center'}]} />
          </View>}
          {isProgress && <Text style={{color: 'black', textAlign: 'center', marginTop: isProgress?0: 0}}>{progressWidth}</Text>}
          <Text style={{color: 'black', marginTop: isProgress?0: 20}}>Please Wait</Text>
          {customText && <Text style={{color: 'black', marginTop: 5}}>{text}</Text>}
        </View>
      </View>
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
  activityIndicatorWrapper: {
    backgroundColor: 'white',
    height: 200,
    width: 200,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progress: {
    height: 20,
    marginVertical: 10,
    width: '60%',
    borderColor: THEME_COLOR,
    borderWidth: 2,
    alignItems: 'flex-start',
  },
  progresIndicator: {
    backgroundColor: '#FF5A66',
    height: '100%',

  }
});

export default LoadingModal;
