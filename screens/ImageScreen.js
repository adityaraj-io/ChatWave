import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react'
import { Dimensions, Image, StyleSheet, View, Animated } from 'react-native'

const ImageScreen = ({route}) => {
    const { image } = route.params;
    const scale = new Animated.Value(1);
    const navigation = useNavigation();
    navigation.setOptions({
      headerStyle: {
        backgroundColor: 'black'
      },
    })
  return (
    <View style={styles.container}>
      <Animated.Image resizeMethod='contain' style={[styles.image, {
        transform: [
          {scale: scale}
        ]
      }]} source={{uri: image}} />
    </View>
  )
}

export default ImageScreen

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
        // minHeight: Dimensions.get('screen').height-Dimensions.get('window').height/6.3,
        flex: 1
        // aspectRatio: 1
    },
    image: {
        width: Dimensions.get('window').width,
        // flex: 1,
        height: Dimensions.get('window').width
    }
})