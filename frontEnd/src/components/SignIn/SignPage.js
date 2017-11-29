import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
//import axios from 'axios';
import React, {Component} from 'react';
import './SignPage.css';
const sha256 = require('js-sha256')

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    }
  }

  handleClick(event) {
    var apiBaseUrl = "http://localhost:4000/api/";
    var self = this;
    var payload = {
      "email": this.state.username,
      "password": sha256.hex(this.state.password)
    }
    //axios.post(apiBaseUrl+'login', payload)
      .then(function (response) {
        console.log(response);
        if (response.data.code === 200) {
          console.log("Login successful");
          // var uploadScreen=[]; uploadScreen.push(<UploadScreen
          // appContext={self.props.appContext}/>)
          // self.props.appContext.setState({loginPage:[],uploadScreen:uploadScreen})
        } else if (response.data.code === 204) {
          console.log("Username password do not match");
          alert("username password do not match")
        } else {
          console.log("Username does not exists");
          alert("Username does not exist");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  signIn(event) {
    let payload = {
      "email": this.state.username,
      "password": sha256.hex(this.state.password)
    }
    this.props.socket.emit("loginRequest",payload)
  }

  saveUsername(e, text) {
    console.log(text)
    localStorage.setItem("username", text)
  }

  render() {
    return (
      <div className="signpage">
        <div className="body">

          <div>
            <MuiThemeProvider>
              <div>
                <AppBar title="Sign-in"/>
                <TextField
                  hintText="Enter your Email"
                  floatingLabelText="Email"
                  onChange=
                  {(event,newValue) => this.setState({username:newValue})}
                  onChange={this.saveUsername}/>
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
                  onClick={this.props.signIn && this.signIn}/>
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