import React, {Component} from 'react'
import io from 'socket.io-client'

import './Chat.css'

// const socket = io('https://ezchatrooms.herokuapp.com/')
const socket = io('192.168.1.83:8080')

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
        this.clearHandler = this
            .clearHandler
            .bind(this);
        this.textChangeHandler = this
            .textChangeHandler
            .bind(this)
    }
    componentWillMount() {
        console.log("will mount")
        //get the messages from server and put in messagesList
    }
    componentDidMount() {
        console.log('did mount')
        socket.on('cachedMessages', (msgs)=>{
            for(let i in msgs){
                console.log(JSON.parse(msgs[i]))
                this.printMessage(JSON.parse(msgs[i]))
            }
        })


        socket.on("message", (message) => {
            console.log(message)
            this.printMessage(message)
        })


        const textArea = document.querySelector('.input')
        const submitButton = document.querySelector('.submit')
        textArea.addEventListener("keydown", (event) =>{
            if(event.keyCode === 13){
                if(!event.shiftKey){
                    event.preventDefault()
                    submitButton.click()
                }
            }
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

        socket.emit('message', messageObject, (answer)=>{
            console.log("do the thing")
        })

        this.printMessage(messageObject)

        this.setState({chatInput: ''})
        console.log(messageObject)
    }
    clearHandler(event){
        this.setState({chatInput: ''})
    }

    printMessage(message) {
        const oldList = this.state.messagesList
        const newList = [
            ...oldList,
            message
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
                <div className="chat-window">
                    <ul className="messages-list">
                        {this.state.messagesList.map((message,index)=>{
                            return <li className="message" key={index}>
                            <div className="message-sender">
                            {message.nick}
                            </div>
                            <div className="message-text">
                            {message.text}
                            </div>
                            </li>
                        })}
                    </ul>
                </div>
                <form className="chat-input" onSubmit={this.submitHandler}>
                    <textarea
                        className="input"
                        type="text"
                        rows="1"
                        onChange={this.textChangeHandler}
                        value={this.state.chatInput}
                        required/>
                    <div className="submit-buttons">
                        <button
                            className="submit"
                            type="submit"
                            value="Send">Send</button>
                        <button
                            className="clear"
                            type="reset"
                            onClick={this.clearHandler}
                            value="Clear">Clear</button>
                    </div>
                </form>
            </div>
        )
    }
}
export default Chat