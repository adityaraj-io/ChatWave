import React, { useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet } from 'react-native'
import { View, Image, Text } from 'react-native'
import MaterialButton from '../components/MaterialButton'
import { CommonActions, useNavigation } from '@react-navigation/native'
import auth from '@react-native-firebase/auth';


const StartScreen = () => {

    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();
  
    const navigation = useNavigation();

    function onAuthStateChanged(user) {
        setUser(user);
        if (initializing) setInitializing(false);
    }

    useEffect(()=>{
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber;
    }, [])

    if (user) {
        navigation.replace('Main')
    }
    return (
        <>
        {initializing? <View style={[styles.container, {justifyContent: 'center'}]}>
            <ActivityIndicator size={'large'} color={'#FF5A66'} />
        </View>:
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Text style={[styles.title, {fontSize: 30, marginBottom: 15}]}>Chat<Text style={{color: 'yellow'}}>Wave</Text></Text>
        <Text style={[styles.title, {marginBottom: 30}]}>Let's <Text style={{color: '#FF5A66'}}>Connect</Text> You!</Text>
        <Image source={require('../assets/images/adventurer.png')} style={styles.image} />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.title}>An<Text style={{color: '#FF5A66'}}> Easy</Text> Way to <Text style={{color: '#3183F1'}}>Connect</Text> With <Text style={{color: 'lightgreen'}}>People</Text></Text>
        <View style={[styles.buttonView, {marginTop: 20}]}>
            <MaterialButton height={50} fontSize={16} text={'Register'} textColor={'#474747'} backgroundColor={'#FF5A66'} onPress={()=>navigation.navigate('Register')} borderRadius={10} width={'100%'} />
        </View>
        <View style={styles.buttonView}>
            <MaterialButton height={50} fontSize={16} text={'Login'} textColor={'lightgray'} backgroundColor={'#707070'} onPress={()=>navigation.navigate('Login')} borderRadius={10} width={'100%'} />
        </View>
        
      </View>
    </View>}
    </>
  )
}

export default StartScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#333333',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    image: {
        width: 350,
        height: 350,
        backgroundColor: '#707070',
        borderTopRightRadius: 250,
        borderTopLeftRadius: 250,
        borderBottomLeftRadius: 150
    },
    imageContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: -19
    },
    infoContainer: {
        marginBottom: 30,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        backgroundColor: '#474747',
        width: '100%',
        padding: 30,
    },
    title: {
        fontSize: 25,
        color: '#fff',
        fontWeight: 'bold'
    },
    buttonView: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    }
})
