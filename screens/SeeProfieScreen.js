import React, { useState } from 'react'
import { StyleSheet, Text, View, Image, Dimensions, StatusBar } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import LoadingModal from '../components/LoadingModal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ImageView from "react-native-image-viewing";
import { TouchableOpacity } from 'react-native';

const SeeProfieScreen = ({route}) => {
    const navigation = useNavigation();
    const {username, email, about, interests, image, status} = route.params;
    const [loading, setLoading] = useState(false)
    const [images, setImages] = useState([])
    const [visible, setIsVisible] = useState(false);
    navigation.setOptions({
        headerTitle: username,
        
      })
  return (
    <KeyboardAwareScrollView>
    <View style={styles.container}>
      <View style={styles.blob}>
        <Image source={{uri: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/images/1.jpg'}} style={{width: '100%', height: '100%', borderTopRightRadius: 15, borderTopLeftRadius: 15}} />
      </View>
      <TouchableOpacity onPress={async()=>{
          await setImages([{uri: image}]);
        
                      setIsVisible(true)
                    }}>

      <Image
      source={{uri: image}} // Replace with the path to your profile picture
      style={styles.profileImage}
    />
          </TouchableOpacity>

    <Text style={{color: status==='online'?'lightgreen':'lightgray'}}>{status}</Text>
    <Text style={styles.username}>{username}</Text>
    <Text style={styles.email}>{email}</Text>
    {/* <Text style={styles.status}>Online</Text> */}

    
    {/* Bio */}
    <View style={styles.section}>
      <Text style={styles.sectionHeader}>About Me</Text>
      <Text style={styles.bio}>{about}</Text>
    </View>

    {/* Contact Information */}
    <View style={styles.section}>
      <Text style={styles.sectionHeader}>Contact Information</Text>
      <Text style={styles.contactInfo}>Email: {email}</Text>
      {/* <Text style={styles.contactInfo}>Phone: (123) 456-7890</Text> */}
    </View>

    {/* Custom Sections */}
    <View style={styles.section}>
      <Text style={styles.sectionHeader}>Interests</Text>
      <Text style={styles.customValue}>{interests}</Text>
    </View>
    <LoadingModal visible={loading} />
    <ImageView
          images={images}
          imageIndex={0}
          visible={visible}
          onRequestClose={() => setIsVisible(false)}
    />
  </View>
  </KeyboardAwareScrollView>
  )
}

export default SeeProfieScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-start',
      backgroundColor: '#333333',
      paddingTop: StatusBar.currentHeight,
      minHeight: Dimensions.get('screen').height-90
    },
    email: {
      fontSize: 11,
      color: 'lightgray'
      // marginTop:1 
    },
    profileImage: {
      width: 150,
      height: 150,
      borderRadius: 75,
      marginBottom: 10,
      marginTop: -100,
      borderWidth: 5,
      borderColor: '#333333',
      backgroundColor: 'lightgray'
    },
    username: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: -5,
      color: '#fff'
    },
    status: {
      fontSize: 16,
      color: 'green',
      marginBottom: 15,
    },
    section: {
      backgroundColor: '#444444',
      padding: 20,
      margin: 10,
      borderRadius: 10,
      width: '87%',
    },
    sectionHeader: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#fff'
    },
    bio: {
      fontSize: 16,
      color: 'lightgray'
    },
    contactInfo: {
      fontSize: 16,
      marginBottom: 5,
      color: 'lightgray'
    },
    customValue: {
      fontSize: 16,
      color: 'lightgray'
    },
    blob: {
      height: 150,
      // marginHorizontal: 20,
      // marginRight: 50,
      backgroundColor: '#FF5A66',
      width: '90%',
      borderTopRightRadius: 15,
      borderTopLeftRadius: 15,
      borderColor: '#ff5a66',
      borderWidth: 2
    }
  });