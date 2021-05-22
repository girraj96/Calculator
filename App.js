import React, { Component } from 'react'
import { LogBox } from 'react-native'
import FlashMessage from 'react-native-flash-message'
import { Provider } from 'react-redux'
import Routes from './src/Navigation/Routes'
import store from './src/redux/store'

export default class App extends Component {
  
  render() {
    LogBox.ignoreLogs(['Reanimated 2']);
    return (
      <>
        <Provider store={store}>
          <Routes />
        </Provider>
        <FlashMessage position="top" />
      </>
    )
  }
}


