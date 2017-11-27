import React, { Component } from 'react'
// import io from 'socket.io-client'

import './Chat.css'

// const socket = io('https://ezchatrooms.herokuapp.com/') //old test, maybe remove it?
// const socket = io('localhost:8080') // local computer
// const socket = io('104.131.129.223:8080') // servers
// const socket = io('192.168.1.83:8080') // server

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
            .bind(this)
        this.textChangeHandler = this
            .textChangeHandler
            .bind(this)
        this.clearMessageList = this
            .clearMessageList
            .bind(this)
    }
    componentWillMount() {
        console.log("will mount")
        //get the messages from server and put in messagesList
    }
    componentDidMount() {
        console.log('did mount')

        this.props.socket.on("userList", (list) => {
            if (list != null)
                console.table(list)
        })

        this.props.socket.on('cachedMessages', (msgs) => {
            console.table(msgs)
            for (let i in msgs) {
                this.printMessage(JSON.parse(msgs[i]))
            }
        })

        this.props.socket.on('message', (message) => {
            console.log(message)
            this.printMessage(message)
        })

        this.props.socket.on('joinResult', (join) => {
            this.clearMessageList()

            let state = this.state
            state.room = join.room
            this.setState(state)

            console.log('connected to: ' + this.state.room)

        })

        const textArea = document.querySelector('.input')
        const submitButton = document.querySelector('.submit')
        textArea.addEventListener("keydown", (event) => {
            if (event.keyCode === 13) {
                if (!event.shiftKey) {
                    event.preventDefault()
                    submitButton.click()
                }
            }
            // console.log(event.keyCode)
            if (event.keyCode === 9) {
                event.preventDefault()
                this.setState({ chatInput: event.target.value + "\t" })
            }
        })
    }
    submitHandler(event) {
        event.preventDefault()
        let messageText = this.state.chatInput
        console.log('send message to: ' + this.state.room)
        let messageObject = {
            room: this.state.room,
            text: messageText,
            nick: 'bobert'
        }

        //   socket.emit('question', 'do you think so?', function (answer) {});
        this.props.socket.emit('message', messageObject, (answer) => {
            console.log(answer.text)
            this.printMessage(answer)
        })

        let state = this.state
        state.chatInput = ''
        this.setState(state)

    }
    clearHandler(event) {
        let state = this.state
        state.chatInput = ''
        this.setState(state)
    }

    printMessage(message) {
        const oldList = this.state.messagesList
        const newList = [
            ...oldList,
            message
        ] //...oldList creates a new array in a new memory address with the contents of the old array

        let state = this.state
        state.messagesList = newList
        this.setState(state)

        let lastMessage = document.querySelector('.message:last-child')
        lastMessage.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })
    }

    clearMessageList() {
        let state = this.state
        state.messagesList = []
        this.setState(state)
    }

    textChangeHandler(event) {

        let state = this.state
        state.chatInput = event.target.value
        this.setState(state)
        // this.setState({ chatInput: event.target.value })
        // console.log("textChange", event.target.value)
    }

    render() {
        return (
            <div className="chat">
                <div className="chat-window">
                    <ul className="messages-list">
                        {this.state.messagesList.map((message, index) => {
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
                        required />
                    <div className="submit-buttons">
                        <button
                            className="submit"
                            type="submit"
                            value="Send">Send</button>
                        <button
                            className="clear"
                            type="reset"
                            onClick={this.clearHandler}
                            value="Clear">Squeegee</button>
                    </div>
                </form>
            </div>
        )
    }
}
export default Chat