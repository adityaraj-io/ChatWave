import React, { useState } from 'react'
import { ActivityIndicator, StyleSheet } from 'react-native'
import { Text } from 'react-native'
import { TouchableOpacity } from 'react-native'

const MaterialButton = ({textColor, indicatorColor ,borderColor, borderWidth, text, height, backgroundColor, width, isLoading, onPress, fontSize, borderRadius, isTextBold, disabled=false, disabledBackgroundColor='gray', disabledTextColor='lightgray'}) => {
    const [loading, setLoading] = useState(isLoading || false)
    const doNothing = () => {

    }
  return (
      <TouchableOpacity disabled={disabled} style={[style.container, {borderColor: borderColor || null, borderWidth: borderWidth||null, backgroundColor: disabled?disabledBackgroundColor:backgroundColor || 'blue',height: height || null, width: width || null, borderRadius: borderRadius || 10}]} onPress={onPress||doNothing} >
        {!isLoading?<Text style={{color: disabled?disabledTextColor:textColor||'white', fontSize:fontSize || 15, textAlign: 'center', fontWeight: isTextBold? 'bold':null}}>{text}</Text>
        :<ActivityIndicator size={'small'} color={indicatorColor || '#333333'} />}
      </TouchableOpacity>
  )
}

export default MaterialButton

const style = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
