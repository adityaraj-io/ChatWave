import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import MaterialTextInput from '../components/MaterialTextInput'
import MaterialButton from '../components/MaterialButton'
import auth from '@react-native-firebase/auth'
import database from '@react-native-firebase/database';

const EditProfile = () => {
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState();
    const [initializing, setInitializing] = useState(true);
    const [dataInitializing, setDataInitializing] = useState(true);
    const [errorData, setErrorData] = useState(false);
    const [data, setData] = useState();
    const [name, setName] = useState('')
    const [about, setAbout] = useState('')
    const [interests, setInterests] = useState('')

    const updateData = () => {
        if(name===''||about===''||interests===''){
            alert('All Fields are mandatory!')
        }else{
            setLoading(true)
            database().ref(`/users/${user.uid}`).update({
                name: name,
                about: about,
                interests: interests,
            }).then(()=>{
                setLoading(false)
                alert('Data Saved Successfully')
            }).catch((error)=>{
                alert('Some Error Occured. PLease Try Again Later.')
                setLoading(false)
            })
        }
       
    }
    function onAuthStateChanged(user) {
        setUser(user);
        if (initializing) setInitializing(false);
        setUserData(user.uid);
    }

    function setUserData(uid=''){
        // console.log(user.uid)
        try {
          database()
        .ref(`/users/${uid}`)
        .on('value', (snapshot) => {
        //   console.log('User data: ', snapshot.val());
          setData(snapshot.val())
          
          // console.log(snapshot)
          setDataInitializing(false)
      })
        } catch (error) {
          console.log(error.message)
          setErrorData(true)
        }
      }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubs
        
    }, []);

    if(initializing||dataInitializing||errorData||data===undefined){
        if(errorData){
          return <View style={[styles.container, {justifyContent: 'center'}]}>
            <Text>Some Error Occured</Text>
          </View>
        }
        return <View style={[styles.container, {justifyContent: 'center'}]}>
        <ActivityIndicator size={'large'} color={'#FF5A66'} />
    </View>
      }

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Edit Profile Details</Text>
        <View style={styles.containerView}>
            <MaterialTextInput placeholder={'Set Name'}  value={name} onChangeText={setName} borderRadius={15} backgroundColor={'#444444'} width={'70%'} />
            <TouchableOpacity style={styles.disabled} disabled>
                <Text style={{color: 'gray'}}>{data.email} - Cannot be updated</Text>
            </TouchableOpacity>
            <MaterialTextInput placeholder={'Set About'} value={about} onChangeText={setAbout} borderRadius={15} backgroundColor={'#444444'} multiline={true} width={'70%'} />
            <MaterialTextInput placeholder={'Set Interests'} multiline={true} onChangeText={setInterests} value={interests} borderRadius={15} backgroundColor={'#444444'} width={'70%'} />
        </View>
        <View style={styles.containerView}>
            <MaterialButton onPress={updateData} backgroundColor={'#ff5a66'} width={'70%'} text={'Save Changes'} isLoading={loading} indicatorColor={'#fff'} />
        </View>
        </View>
    )
}

export default EditProfile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#333333',
    },
    title: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
        marginTop: 30,
        borderBottomWidth: 5,
        borderColor: 'gray',
        paddingBottom: 10
    },
    containerView: {
        width: '100%',
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center'

    },
    disabled: {
        width: '70%',
        padding: 20,
        borderRadius: 15,
        backgroundColor: '#222222',
        marginBottom: 10
    }
})