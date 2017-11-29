import React, {Component} from 'react'
import './App.css'
import LandingPage from '../LandingPage/LandingPage'
import MainPage from '../MainPage/MainPage'
import Register from '../Register/Register'
import SignIn from '../SignIn/SignPage'
import Audio from '../Audio/Audio'

import io from 'socket.io-client'

// const socket = io('104.131.129.223:8080') // servers
const socket = io('localhost:8080') // servers

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      register: false,
      chatting: true
    }
    this.signIn = this
      .signIn
      .bind(this)
  }

  getRegister() {
    const register = localStorage.getItem('registered')
    let state = this.state
    state.register = register
    this.setState(state)
  }

  getSignedIn() { // this is dangerous. TODO: Change and fix
    const chatting = localStorage.getItem('chatting')
    let state = this.state
    state.chatting = chatting
    this.setState(state)
  }

  signIn() {
    let state = this.state
    console.log(this.state)
    console.log(state)
    // state.chatting = true
    this.setState({chatting: true})
  }

  render() {
    /**
     * If signed in is true, then show main page.
     *  else, if register is true, show register page, otherwise show sign in page
     */
    return (this.state.chatting
      ? <MainPage {...this.props} socket={socket}/>
      : this.state.register
        ? <SignIn {...this.props} signIn={this.signIn} socket={socket}/>
        : <Register {...this.props} signIn={this.signIn} socket={socket}/>)
  }
}

export default App
