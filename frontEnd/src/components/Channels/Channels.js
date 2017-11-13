import React, { Component } from 'react'; 
import './Channels.css';
class Chennels extends Component { render() { return (
<div className="channels">
    <hr/>
    <ul>
        <li>
            <a href="#">ADA</a>
        </li>
        <li>
            <a href="#">C++</a>
        </li>
        <li>
            <a href="#">Java</a>
        </li>
        <li>
            <a href="#">Python</a>
        </li>
    </ul>
    <hr/>
    <ul>
        <li>
            <a href="#">CodeChat Devs</a>
        </li>
        <li>
            <a href="#">SHACS Tutors</a>
        </li>
    </ul>
</div>
); } } export default Chennels;