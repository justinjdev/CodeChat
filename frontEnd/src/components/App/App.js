import React, {Component} from 'react'
import './App.css'
import LandingPage from '../LandingPage/LandingPage'
import MainPage from '../MainPage/MainPage'
import Register from '../Register/Register'
import SignIn from '../SignIn/SignPage'
import Audio from '../Audio/Audio'

import io from 'socket.io-client'

const socket = io('104.131.129.223:8080') // servers

class App extends Component {
  render() {
    return (<MainPage {...this.props} socket={socket} />)
  }
}

export default App
