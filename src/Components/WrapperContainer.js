import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';


const WrapperContainer = (props) => {
  const {  children, statusBarColor, barStyle, bgColor}=props;
  return (
    <SafeAreaView style={{flex: 1, backgroundColor:bgColor, justifyContent:"space-between"}}>
      <StatusBar backgroundColor={statusBarColor} barStyle={barStyle}/>
      {children}
    </SafeAreaView>
  );
};

export default WrapperContainer;
