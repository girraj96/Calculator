import React, { Component } from 'react'
import FlashMessage from 'react-native-flash-message'
import { Provider } from 'react-redux'
import Routes from './src/Navigation/Routes'
import store from './src/redux/store'

export default class App extends Component {
  render() {
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


