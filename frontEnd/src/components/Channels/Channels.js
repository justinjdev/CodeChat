import React, { Component } from 'react';
import './Channels.css';
class Chennels extends Component {
    render() {
        return (
            <div className="channels">
                <hr />
                <ul>
                    <li>
                        <a href="#"><p>ADA</p></a>
                    </li>
                    <li>
                        <a href="#"><p>C++</p></a>
                    </li>
                    <li>
                        <a href="#"><p>Java</p></a>
                    </li>
                    <li>
                        <a href="#"><p>Python</p></a>
                    </li>
                </ul>
                <hr />
                <ul>
                    <li>
                        <a href="#">CodeChat Devs</a>
                    </li>
                    <li>
                        <a href="#">SHACS Tutors</a>
                    </li>
                </ul>
            </div>
        );
    }
} export default Chennels;