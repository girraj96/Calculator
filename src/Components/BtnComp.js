import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import colors from '../styles/colors'
import fontFamily from '../styles/fontFamily'

export default function BtnComp({
    btnTitle,_onBtn, titleFontSize=22, titleColor=colors.black
}) {
    
    return (
        <TouchableOpacity style={styles.btnView} onPress={_onBtn}>
            <Text style={{fontSize:titleFontSize,
            color:titleColor,
            fontFamily:fontFamily.regular}}>{btnTitle}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    btnView: {
        height: "100%", 
        width:80,
        alignItems: "center",
        justifyContent: "center", 
    },
 
})
