import React, { Component } from 'react';

import './ActiveUsers.css';

class ActiveUsers extends Component {
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