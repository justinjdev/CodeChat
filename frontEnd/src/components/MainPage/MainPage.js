import React, { Component } from 'react'

import './MainPage.css'
import 'bootstrap-grid/dist/grid.min.css'
import Chat from '../Chat/Chat'
import Channels from '../Channels/Channels'
import ActiveUsers from '../ActiveUsers/ActiveUsers'
import Audio from '../Audio/Audio'
import logo from './../../img/logo.png'

class MainPage extends Component {
    
    render() {
        return (
            <div className="main-page container-fluid">
                    <div className="header row centered-text">
                            <h3>{"<CODE CHAT>"}</h3>
                    </div>
                    <div className="content row">

                        <div className="left-sidebar col-xs-2">
                            <div className="profile-icon centered-text">
                                <img src={logo} alt="CodeChat"/>
                                {/* <p>D.B.</p> */}
                            </div>
                            <hr/>
                            <Channels socket={this.props.socket}/>
                            <hr/>                            
                            <Audio socket={this.props.socket}/>

                        </div>

                        <div className="main col-xs-9">
                            <Chat socket={this.props.socket}/>
                        </div>

                        <div className="right-sidebar col-xs-1">
                            <p>Active</p>
                            <ActiveUsers socket={this.props.socket}/>
                        </div>
                        
                    </div>

                    <div className="footer row centered-text">
                        <h3>{"</CODE CHAT>"}</h3>
                    </div>
            </div>
        )
    }
}

export default MainPage