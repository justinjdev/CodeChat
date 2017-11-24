import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import React, { Component } from 'react';
import './SignPage.css';

class Login extends Component {
constructor(props){
  super(props);
  this.state={
  username:'',
  password:''
  }
 }

render() {
    return (
      <div className="SignPage">
      <div>
        <MuiThemeProvider>
          <div>
          <AppBar
             title="Sign-in"
           />
           <TextField
             hintText="Enter your Email"
             floatingLabelText="Email"
             onChange = {(event,newValue) => this.setState({username:newValue})}
             />
           <br/>
             <TextField
               type="password"
               hintText="Enter your Password"
               floatingLabelText="Password"
               onChange = {(event,newValue) => this.setState({password:newValue})}
               />
             <br/>
             <RaisedButton label="Submit" primary={true} style={style} onClick={(event) => this.handleClick(event)}/>
             <RaisedButton label="Clear" primary={true} style={style} onClick={(event) => this.handleClick(event)}/>

         </div>
         </MuiThemeProvider>
      </div>
      </div>
    );

  }
}


const style = {
 margin: 20,
};


export default Login;