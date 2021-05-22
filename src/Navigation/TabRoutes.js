import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import navigationStrings from '../constants/navigationStrings';
import { Convertor, ScientificCalc, SimpleCalc } from '../Screens';
import colors from '../styles/colors';

const Tab = createMaterialTopTabNavigator();

export default function TabRoutes() {

  return (
    <View style={{ flexDirection: "row", flex: 1, width: "100%", }}>
      <TouchableOpacity style={{ position: "absolute", top: 10, left: 10 }}>
        <Image
          style={{ height: 30, width: 30 }}
          source={imagePath.ic_drawer} />
      </TouchableOpacity>
      <Tab.Navigator tabBarOptions={{
        labelStyle: {
          fontSize: 12,
          lineHeight: 12,
          textTransform: "none"
        },
        tabStyle: {
          minHeight: 10,
          maxHeight: 40,
        },
        style: {
          backgroundColor: colors.transparent,
          elevation: 0,
          marginVertical: 5,
          marginLeft: 50,
          marginRight: 2
        },
        indicatorStyle: {
          height: "100%",
          backgroundColor: colors.themeColor,
          borderRadius: 20,
        },
        activeTintColor: colors.white,
        inactiveTintColor: colors.black
      }}>
        <Tab.Screen name={navigationStrings.SIMPLE_CALC} component={SimpleCalc} 
        options={{ title: strings.SIMPLE_CALC }} />
        <Tab.Screen name={navigationStrings.SCIENTIFIC_CALC} component={ScientificCalc} options={{ title: strings.SCIENTIFIC_CALC }} />
        <Tab.Screen name={navigationStrings.CONVERTOR} component={Convertor} options={{ title: strings.CONVERTOR }} />
      </Tab.Navigator>
    </View>
  );
}
