import React, { Component } from 'react';

import './MainPage.css'
import 'bootstrap-grid/dist/grid.min.css'
import Chat from '../Chat/Chat'
import Channels from '../Channels/Channels'

class MainPage extends Component {
    render() {
        return (
            <div className="main-page container-fluid">
                    <div className="header row centered-text">
                            <h3>{"<CODE CHAT>"}</h3>
                    </div>
                    <div className="content row">
                        <div className="left-sidebar col-md-2 col-xs-3">
                            <div className="profile-icon centered-text">
                                <p>D.B.</p>
                            </div>
                            <p>channels</p>
                            <Channels/>
                        </div>
                        <div className="main col-md-8 col-xs-9">
                            <Chat/>
                        </div>
                        <div className="right-sidebar col-md-2 col-xs-12">
                            <p>active</p>
                        </div>
                    </div>
                    <div className="footer row centered-text">
                        <h3>{"</CODE CHAT>"}</h3>
                    </div>
            </div>
        );
    }
}

export default MainPage;