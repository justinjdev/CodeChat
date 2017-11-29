import React, { Component } from 'react';
// import io from 'socket.io-client'

import './ActiveUsers.css';

// const socket = io('104.131.129.223:8080') // servers

class ActiveUsers extends Component {
    constructor(props) {
        super(props)
        this.state = {
            room: 'Lobby',
            usersList: []
        }


    }
    componentDidMount() {
        console.log('did mount')
        this.props.socket.on('userList', (users)=>{
            console.log("users:")
            console.table(users)
            // for(let i in users){
            //     this.printMessage(JSON.parse(users[i]))
            // }
            if(users != null)
                console.table(users)
        })
    }

    render() {
        return (
            <div className="active-users">
                i dont actually know how to grab all the users...
                <ul className="users-list">
                    <li className="active-user centered-text"><p>D.B.</p></li>
                    <li className="active-user centered-text"><p>T.M.</p></li>
                    <li className="active-user centered-text"><p>C.C.</p></li>
                </ul>
            </div>
        );
    }
}

export default ActiveUsers;