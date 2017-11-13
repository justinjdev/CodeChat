import React, {Component} from 'react'
import io from 'socket.io-client'

const socket = io('https://ezchatrooms.herokuapp.com/')

class Chat extends Component {
    constructor(props) {
        super(props)
        this.state = {
            chatInput: '',
            room: 'Lobby',
            messagesList: []
        }

        this.submitHandler = this
            .submitHandler
            .bind(this)
        this.textChangeHandler = this
            .textChangeHandler
            .bind(this)
    }
    componentWillMount() {
        console.log("will mount")
        //get the messages from server and put in messagesList
    }
    componentDidMount() {
        socket.on("message", (message) => {
            console.log(message)
            this.printMessage(message)
        })
    }
    submitHandler(event) {
        event.preventDefault()
        let messageText = this.state.chatInput

        let messageObject = {
            room: this.state.room,
            text: messageText,
            nick: 'bobert'
        }

        socket.emit('message', messageObject)

        this.printMessage(messageObject)

        this.setState({chatInput: ''})
        console.log(messageObject)
    }

    printMessage(message) {
        const oldList = this.state.messagesList
        const newList = [
            ...oldList,
            message.text
        ] //...oldList creates a new array in a new memory address with the contents of the old array

        this.setState({messagesList: newList})
    }

    textChangeHandler(event) {
        this.setState({chatInput: event.target.value})
        // console.log("textChange", event.target.value)
    }

    render() {
        return (
            <div className="chat">
                <h1>
                    Chat Room
                </h1>
                <ul className="messagesList">
                    {this.state.messagesList.map((message,index)=>{
                        return <li key={index}>{message}</li>
                    })}
                </ul>
                <form className="chatInput" onSubmit={this.submitHandler}>
                    <input
                        type="text"
                        onChange={this.textChangeHandler}
                        value={this.state.chatInput}
                        required/>
                </form>
            </div>
        )
    }
}
export default Chat