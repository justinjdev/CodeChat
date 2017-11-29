import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import React, {Component} from 'react';
import './SignPage.css';
//import './Main/MainPage.css';
import Logo from '../../img/logo.png';


const sha256 = require('js-sha256')

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: ''
    }
  }


  signIn(event) {
    console.log("pls sign in")
    let payload = {
      "email": this.state.username,
      "password": sha256.hex(this.state.password)
    }
    this
      .props
      .socket
      .emit("loginRequest", payload)
    this
      .props
      .signIn()
  }

  saveUsername(e, text) {
    console.log(text)
    let state = this.state
    state.username = text
    this.setState(state)
    localStorage.setItem("username", text)
    console.log("state:", this.state)
  }

  render() {
    return (

       <div className="signpage">
        
         <div className="body"> 

          <div>

            <MuiThemeProvider>
              <div>

              <AppBar
             title="Sign In" showMenuIconButton={false}
           />
  

                <TextField
                  hintText="Enter your Email"
                  floatingLabelText="Email"
                  onChange={(event, newValue) => this.saveUsername(event, newValue)}/>
                <br/>
                <TextField
                  type="password"
                  hintText="Enter your Password"
                  floatingLabelText="Password"
                  onChange=
                  {(event,newValue) => this.setState({password:newValue})}/>
                <br/> {/* <RaisedButton
                label="Submit"
                primary={true}
                style={style}
                onClick={(event) => this.handleClick(event)}/> */}
                <RaisedButton
                  label="Submit"
                  primary={true}
                  style={style}
                  onClick={() => this.signIn()}/>
                <RaisedButton
                  label="Clear"
                  primary={true}
                  style={style}
                  onClick={(event) => this.handleClick(event)}/>

              </div>
            </MuiThemeProvider>
          </div>
        </div>
        </div>


    );

  }
}

const style = {
  margin: 20
};

export default Login;