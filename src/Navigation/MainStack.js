import React from 'react'
import {createStackNavigator} from "@react-navigation/stack";
import navigationStrings from '../constants/navigationStrings';
import TabRoutes from "./TabRoutes";

const Stack=createStackNavigator();
export default function MainStack() {
    return (
        <React.Fragment>
           <Stack.Screen name={navigationStrings.TAB_ROUTES} component={TabRoutes} options={{headerShown:false}}/>
           </React.Fragment>
    )
}
