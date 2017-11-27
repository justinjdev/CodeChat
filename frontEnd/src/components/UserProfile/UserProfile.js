import React, { Component } from 'react';
import './UserProfile.css';

class UserProfile extends Component {
    constructor(props){
        super(props)

      /*  this.onUserProfileClick = this
            .onUserProfileClick
            .bind(this)*/
    }

  /*  onChannelClick(event) {
    
            
        } */
    
    render() {
        return (

            

            <div className="main-page container-fluid">
            <div className="header row centered-text">

                    <h3>{"<CODE CHAT>"}</h3>
                    </div>

            <div className="content row">
            <div className="left-sidebar col-xs-2">
            <div className="profile-icon centered-text">
            <p>D.B.</p>
            </div>         

            <div className="profile">
                <hr />
                <ul className="menu-list">
                    <li className="channel centered-text">
                        <a href="usersettings">Profile</a>
                    </li>
                    <hr />

                    <li className="channel centered-text">
                        <a href="securitysettings">Security</a>
                    </li>
                    <hr />

                    <li className="channel centered-text">
                        <a href="appsettings">App Settings</a>
                    </li>
                    <hr />

                </ul>      
            </div>         
               </div>
            </div>

            <div className="footer row centered-text">
                        <h3>{"</CODE CHAT>"}</h3>
                    </div>

            </div>



           

        );
    
} }
export default UserProfile;