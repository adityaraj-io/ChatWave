import React from 'react';
import { View, Modal, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

const ImageInfo = ({ visible, onRequestClose = () => { }, sendBy = '', source = '', isMe = false, time = '' }) => {
    const formattedTime = formatTime(time);

    return (
        <Modal transparent={true} animationType="slide" onRequestClose={onRequestClose} visible={visible}>
            <TouchableOpacity activeOpacity={1} onPress={onRequestClose} style={styles.modalBackground}>
                <View style={styles.ModalView}>
                    <View style={{ alignItems: 'flex-start', marginBottom: 10 }}>
                        
                        <TouchableOpacity  style={[styles.imageContainer, { borderTopLeftRadius:15, borderBottomRightRadius: 15, backgroundColor: isMe ? '#FF5A66' : 'white', borderBottomLeftRadius: 0, borderTopRightRadius: 15 }]}>
                            <Image style={styles.image} source={{ uri: source }} />
                        </TouchableOpacity>
                        <Text style={{ textAlign: 'right', fontSize: 12, backgroundColor: isMe?'#FF5A66': '#fff', color: isMe?'lightgray':'gray', borderBottomLeftRadius: 15, borderBottomRightRadius: 15, padding: 5 }}>{dayjs(time).fromNow()}</Text>

                    </View>
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
});

export default ImageInfo;
