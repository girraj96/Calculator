import React, { Component } from 'react'
import { Provider } from 'react-redux'
import Routes from './src/Navigation/Routes'
import store from './src/redux/store'

const {dispatch}=store;

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
              <Routes/>
      </Provider>
    )
  }
}


