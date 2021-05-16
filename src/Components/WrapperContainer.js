import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


const WrapperContainer = (props) => {
  const {  children, statusBarColor, barStyle, bgColor}=props;
  return (
    <SafeAreaView style={{flex: 1, backgroundColor:bgColor}}>
      <StatusBar backgroundColor={statusBarColor} barStyle={barStyle}/>
      {children}
    </SafeAreaView>
  );
};

export default WrapperContainer;
