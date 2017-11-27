import React, { Component } from 'react';
import './Channels.css';
class Chennels extends Component {
    constructor(props){
        super(props)

        this.onChannelClick = this
            .onChannelClick
            .bind(this)

    }

    onChannelClick(event) {
        if(event.target.parentElement.classList.contains('channel')){

            var elems = document.querySelector(".active")
            if (elems !== null) {
                elems.classList.remove("active")
            }
            event.target.classList.add('active')
            
        }
    }

    render() {
        return (
            <div className="channels" onClick={this.onChannelClick}>
                <hr />
                <ul className="channel-list">
                    <li className="channel centered-text">
                        <a href="#">ADA</a>
                    </li>
                    <li className="channel centered-text">
                        <a href="#">C++</a>
                    </li>
                    <li className="channel centered-text">
                        <a href="#">Java</a>
                    </li>
                    <li className="channel centered-text">
                        <a href="#">Python</a>
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