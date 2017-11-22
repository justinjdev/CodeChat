import React, { Component } from 'react';
import './Channels.css';
class Chennels extends Component {
    render() {
        return (
            <div className="channels">
                <hr />
                <ul className="channel-list">
                    <li className="channel centered-text">
                        <a href="#"><p>ADA</p></a>
                    </li>
                    <li className="channel centered-text">
                        <a href="#"><p>C++</p></a>
                    </li>
                    <li className="channel centered-text">
                        <a href="#"><p>Java</p></a>
                    </li>
                    <li className="channel centered-text">
                        <a href="#"><p>Python</p></a>
                    </li>
                </ul>
                <hr />
                <ul className="channel-list">
                <li className="channel centered-text">
                        <a href="#">CodeChat Devs</a>
                    </li>
                    <li className="channel centered-text">
                        <a href="#">SHACS Tutors</a>
                    </li>
                </ul>
            </div>
        );
    }
} export default Chennels;