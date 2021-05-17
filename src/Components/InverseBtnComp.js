import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'

export default function InverseBtnComp({
    btnTitle,
    _onBtn,
}) {
    return (
       <TouchableOpacity style={styles.btnView} onPress={_onBtn}>
           <Text style={styles.btnName}>{btnTitle}</Text>
           <Text style={styles.inverseTxt}>-1</Text>
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
    btnName:{
        position:"relative",
        fontSize:20
    },
    inverseTxt:{
        position:"absolute",
        left:57,
        top:0
    }
})
