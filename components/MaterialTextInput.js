import React from 'react'
import { StyleSheet, View, TextInput  } from 'react-native'

const MaterialTextInput = ({placeholder, placeholderTextColor, defaultValue='', width, value, onChangeText, multiline, backgroundColor, borderRadius, padding, secureTextEntry, onEndEditing=()=>{} }) => {
  return (
    <View  style={styles.textInputContainer}>
        <View style={{width: width || '50%', backgroundColor: backgroundColor || null, borderRadius: borderRadius || null, padding: padding || 7}}>
          <TextInput onEndEditing={onEndEditing} defaultValue={defaultValue}  onChangeText={onChangeText || null} multiline={multiline || null} style={{color: placeholderTextColor||'lightgray'}} value={value || null} placeholder={placeholder || null} secureTextEntry={secureTextEntry || false} placeholderTextColor={placeholderTextColor || null} />
        </View>
        </View>
  )
}

export default MaterialTextInput

const styles = StyleSheet.create({
    textInputContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
      },
})