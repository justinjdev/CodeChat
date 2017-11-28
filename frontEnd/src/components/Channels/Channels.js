import React, { Component } from 'react';
import './Channels.css';
import Audio from '../Audio/Audio'

class Chennels extends Component {
    constructor(props){
        super(props)

        this.state = {
            roomName:''
        }

        this.onChannelClick = this
            .onChannelClick
            .bind(this)

    }

    componentDidMount(){
        this.props.socket.on('joinResult', (room) => {
            console.table(room)
            let newState = this.state
            newState.roomName = room.room
            this.setState(newState)
        })

    }

    onChannelClick(event) {
        // event.preventDefault()
        // event.stopPropagation()
        console.log("current room: " + this.state.roomName)
        console.log("new room:",event.target.text)
        
        let room = {
            previousRoom: this.state.roomName,
            newRoom: event.target.text
        }
        // console.log(event.target)
        var elems = document.querySelector(".active")
        if (elems !== null) {
            elems.classList.remove("active")
        }
        event.target.classList.add('active')

        this.props.socket.emit('join', room)

        // if(event.target.parentElement.classList.contains('channel')){

        //     var elems = document.querySelector(".active")
        //     if (elems !== null) {
        //         elems.classList.remove("active")
        //     }
        //     event.target.classList.add('active')
        // }
    }

    render() {
        return (
            <div className="channels">
                <hr />
                <ul className="channel-list">
                    <li className="channel centered-text">
                        <a onClick={this.onChannelClick}>ADA</a>
                    </li>
                    <li className="channel centered-text">
                        <a onClick={this.onChannelClick}>C++</a>
                    </li>
                    <li className="channel centered-text">
                        <a onClick={this.onChannelClick}>Java</a>
                    </li>
                    <li className="channel centered-text">
                        <a onClick={this.onChannelClick}>Python</a>
                    </li>
                </ul>
                <hr />
                <ul className="channel-list">

                <li className="channel centered-text">
                        <a onClick={this.onChannelClick}>CodeChat Devs</a>
                    </li>
                    <li className="channel centered-text">
                        <a onClick={this.onChannelClick}>SHACS Tutors</a>
                    </li>

                    <hr />
                    <a>Audio Settings</a> 
                     <Audio/> 



                </ul>
            </div>
        );
    }
} export default Chennels;