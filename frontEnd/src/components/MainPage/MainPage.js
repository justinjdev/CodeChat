import React, { Component } from 'react';

import './MainPage.css'

class MainPage extends Component {
    render() {
        return (
            <div className="main-page">
                <div className="header">
                    <h1>{"<CODE CHAT/>"}</h1>
                </div>
                <div className="content">
                    <div className="left-sidebar">
                        <p>channels</p>
                    </div>
                    <div className="main">
                        <p>chat</p>
                    </div>
                    <div className="right-sidebar">
                        <p>active</p>
                    </div>
                </div>
                <div className="footer">
                    <p>footer | more footer | other footer</p>
                </div>
            </div>
        );
    }
}

export default MainPage;