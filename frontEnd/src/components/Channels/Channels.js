import React, {Component} from 'react';
import './Channels.css';


class Chennels extends Component {
    constructor(props) {
        super(props)

        this.state = {
            roomName: '',
            allRooms: []
        }

        this.onChannelClick = this
            .onChannelClick
            .bind(this)

    }

    componentWillMount(){
        
        this.props.socket.on('roomList', (allRooms) => {
            console.log("get channels")
            console.table(allRooms)

            // for(let i in allRooms){
            // console.log(allRooms[i])
            // }

            let newState = this.state
            newState.allRooms = allRooms
            this.setState(newState)
        })

        this.props.socket.emit('getRooms')
    }

    componentDidMount(){
        this.props.socket.on('joinResult', (room) => {
            let newState = this.state
            newState.roomName = room.room
            this.setState(newState)
        })

    }

    onChannelClick(event) {
        
        console.log("current room: " + this.state.roomName)
        console.log("new room:", event.target.text)

        let room = {
            previousRoom: this.state.roomName,
            newRoom: event.target.text
        }

        var elems = document.querySelector(".active")
        if (elems !== null) {
            elems
                .classList
                .remove("active")
        }
        event.target.classList.add('active')

        this.props.socket.emit('join', room)
    }

    render() {
        return (
            <div className="channels">
                <div className="centered-text">
                    <h4>Text Channels</h4>
                </div>
                <ul className="channel-list">
                    {
                    this
                        .state
                        .allRooms
                        .map((roomname, index) => {
                            // let highlightClass = ""
                            // if(roomname == "Lobby") highlightClass += " active"
                            return <li className="channel centered-text" key={index}>
                                <a onClick={this.onChannelClick}>{roomname}</a>
                            </li>
                        })}
                </ul>

            </div>
        );
    }
}
export default Chennels;