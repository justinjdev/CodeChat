import React, {Component} from 'react'
import './App.css'
import LandingPage from '../LandingPage/LandingPage'
import MainPage from '../MainPage/MainPage'
import Register from '../Register/Register'
import SignIn from '../SignIn/SignPage'
import io from 'socket.io-client'

const socket = io('localhost:8080') // servers

class App extends Component {
  render() {
    return (<MainPage {...this.props} socket={socket} />)
  }
}

export default App
