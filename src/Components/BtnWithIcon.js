import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import colors from '../styles/colors';

export default function BtnWithIcon(props) {
    const {btnTitle,_onBtn}=props;
    return (
       <TouchableOpacity style={styles.btnView} onPress={_onBtn}>
           <Image source={btnTitle} style={styles.btnIcon}/>
       </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    btnView:{
        height: "100%", 
        width:80,
        alignItems: "center",
        justifyContent: "center", 
    },
    btnIcon:{
        height:18,
        width:20,
        resizeMode:"contain",
        tintColor:colors.themeColor
    }
})
