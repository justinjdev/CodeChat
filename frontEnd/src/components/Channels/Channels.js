import React, { Component } from 'react';
import './Channels.css';

class Chennels extends Component {
    constructor(props){
        super(props)

        this.state = {
            roomName:'',
            allRooms: []
        }

        this.onChannelClick = this
            .onChannelClick
            .bind(this)

    }
    componentDidMount(){

    }

    componentDidMount(){
        this.props.socket.on('joinResult', (room) => {
            let newState = this.state
            newState.roomName = room.room
            this.setState(newState)
        })

        this.props.socket.on('roomList', (allRooms) => {
            console.log("get channels")
            console.log(allRooms)

            for(let i in allRooms){
            console.log(allRooms[i])
            }

            let newState = this.state
            newState.allRooms = allRooms
            this.setState(newState)
        })

        this.props.socket.emit('getRooms')


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
                <h4>Hardcoded Channels</h4>
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
                    <li className="channel centered-text">
                        <a onClick={this.onChannelClick}>CodeChat Devs</a>
                    </li>
                    <li className="channel centered-text">
                        <a onClick={this.onChannelClick}>SHACS Tutors</a>
                    </li>
                <h4>Database Channels</h4>

                        {/* { // TODO: implement later
                            this
                            .state
                            .allRooms
                            .map((roomname, index) => {
                                return <li className="channel centered-text" key={index}><a onClick={this.onChannelClick}>{roomname}</a></li>
                            })} */}
                </ul>

            </div>
        );
    }
} export default Chennels;