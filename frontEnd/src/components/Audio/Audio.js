import React, {Component} from 'react'
import io from 'socket.io-client'

import './Audio.css'

// const socket = io('https://ezchatrooms.herokuapp.com/') //old test, maybe
// remove it?
const socket = io('localhost:8080') // local computer
// const socket = io('104.131.129.223:8080') // servers

class Audio extends Component {
    constructor(props) {
        super(props)
        this.state = {}

    }
    componentWillMount() {
        console.log("will mount")
        //get the messages from server and put in messagesList
    }
    componentDidMount() {
        // let socket = io('localhost:3000')
        let mediaRecorder
        let rstat = false //recording = true
        let vcstat = true
        document
            .getElementById('rbutton')
            .onclick = function () { //when button is pressed, switch recording state - could be generalized to key press/release
            if (vcstat) {
                if (rstat) {
                    mediaRecorder.stop()
                    rstat = false
                } else {
                    mediaRecorder.start()
                    rstat = true
                }
            }
        }
        document
            .getElementById('vcbutton')
            .onclick = function () { //when button is pressed, switch recording state - could be generalized to key press/release - see bottom
            if (vcstat) {
                vcstat = false
                if (rstat) {
                    rstat = false
                    mediaRecorder.stop()
                }
            } else {
                vcstat = true
            }
        }

        if (navigator.mediaDevices) {
            let constraints = {
                audio: true
            }
            let chunks = []
            navigator
                .mediaDevices
                .getUserMedia(constraints)
                .then(function (mediaStream) {

                    //mediaRecorder = new MediaRecorder(mediaStream)
                    let audioCtx = new AudioContext() //reroute input to control recording volume
                    let source = audioCtx.createMediaStreamSource(mediaStream)
                    let dest = audioCtx.createMediaStreamDestination()
                    let gainNode = audioCtx.createGain() //volume control
                    source.connect(gainNode)
                    gainNode.connect(dest)

                    document
                        .getElementById('recordVolume')
                        .onchange = function () { //change volume
                        gainNode.gain.value = this.value
                    }

                    gainNode.gain.value = document
                        .getElementById('recordVolume')
                        .value

                    mediaRecorder = new MediaRecorder(dest.stream, {audioBitsPerSecond: 32000}) //route back to mediaRecorder

                    mediaRecorder.ondataavailable = function (e) {
                        chunks.push(e.data)
                    }
                    mediaRecorder.onstop = function (e) {
                        let blob = new Blob(chunks, {'type': 'audio/ogg codecs=opus'})
                        // $('#m').val(blob.size)
                        chunks = []
                        socket.emit('voice', blob)
                    }

                    mediaRecorder.start()
                    rstat = true
                    if (rstat) {
                        setInterval(function () {
                            mediaRecorder.stop()
                            mediaRecorder.start()
                        }, 500)
                    }
                })

            socket.on('voice', function (buff) { //1) play if in voice chat, ignore otherwise     2) only send to users in voice chat

                if (vcstat) {
                    let blob = new Blob([buff], {'type': 'audio/ogg codecs=opus'})
                    let audio = document.createElement('audio')
                    audio.volume = document
                        .getElementById('playbackVolume')
                        .value
                    audio.src = window
                        .URL
                        .createObjectURL(blob)
                    audio.play()
                }
            })
        }

        // $(document).on('keydown', function(e) {      //z - PTT   if(e.keyCode==90) {
        // mediaRecorder.start()     stat = true   } }) $(document).on('keyup',
        // function(e) {   if(e.keyCode==90) {     mediaRecorder.stop()     stat = false
        //   } })

    }
    logit(e) {
        console.log("logging!!!",e.target.value)
    }
    render() {
        return (
            <div className="Audiochat">
                <ul id="messages"></ul>
                <form action="">
                    <input id="m" autoComplete="off"/>
                    <button>Send</button>
                </form>
                <span>
                    RecordVolume:
                </span>
                <input
                    type="range"
                    id="recordVolume"
                    min="0"
                    max="1"
                    value="1"
                    step="0.01"
                    onChange={this.logit}/>
                <span>
                    PlaybackVolume:
                </span>
                <input
                    type="range"
                    id="playbackVolume"
                    min="0"
                    max="1"
                    value="1"
                    step="0.01"
                    onChange={this.logit}/>
                <input
                    type="button"
                    value="Start/Stop Recording"
                    id="rbutton"
                    onChange={this.logit}/>
                <input type="button" value="Enter VC" id="vcbutton" onChange={this.logit}/>
            </div>

        )
    }
}
export default Audio