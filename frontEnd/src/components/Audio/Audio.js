import React, {Component} from 'react'
import io from 'socket.io-client'

import './Audio.css'

// const socket = io('https://ezchatrooms.herokuapp.com/') //old test, maybe
// remove it?
const socket = io('localhost:8080') // local computer
let mediaRecorder    //records audio
let vcstate = true   //tracks whether user is in VC or not
let gainNode         //pass audio stream through gainNode to manipulate recording volume
// const socket = io('104.131.129.223:8080') // servers

class Audio extends Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.recclick = this.recclick.bind(this)
        this.vcclick = this.vcclick.bind(this)
        this.recchange = this.recchange.bind(this)
    }
    componentWillMount() {
        console.log("will mount")
        //get the messages from server and put in messagesList
    }
    componentDidMount() {
        if (navigator.mediaDevices) {
            let constraints = {  //what to record. audio: true, [video:false]
                audio: true
            }
            let chunks = [] //buffer to store audio in
            navigator
                .mediaDevices
                .getUserMedia(constraints)
                .then(function (mediaStream) {

                    let audioCtx = new AudioContext() //reroute input to control recording volume
                    let source = audioCtx.createMediaStreamSource(mediaStream)
                    let dest = audioCtx.createMediaStreamDestination()
                    gainNode = audioCtx.createGain() //gainNode controls recording volume
                    source.connect(gainNode)
                    gainNode.connect(dest)
                    gainNode.gain.value = document  //set initial recVolume when initialized
                        .getElementById('recordVolume')
                        .value

                    mediaRecorder = new MediaRecorder(dest.stream, {audioBitsPerSecond: 32000}) //route back to mediaRecorder, optionally set bitrate

                    mediaRecorder.ondataavailable = function (e) { //when recording, store input in buffer
                        chunks.push(e.data)
                    }
                    mediaRecorder.onstop = function (e) {  //when stopped (by interval or by user), send voice to server
                        let blob = new Blob(chunks, {'type': 'audio/ogg codecs=opus'}) //store buffer in blob, use opus codec
                        chunks = []  //empty buffer
                        socket.emit('voice', blob)  //send blob to server
                    }

                    mediaRecorder.start() //mediaRecorder defaults to recording. Remove to default to inactive
                    setInterval(function () {   //every 500 ms, if recording, restart mediaRecorder to send buffer to server
                        if(mediaRecorder.state=="recording") {
                            mediaRecorder.stop()
                            mediaRecorder.start()
                        }
                    }, 500) //interval time in ms. Lower time makes audio choppy
                })
                //parts of playback could be moved outside for optimization
            socket.on('voice', function (buff) { // 1) play if in voice chat, ignore otherwise     2) only send to users in voice chat
                                                        // 1) is currently implemented, 2)requires control in backend
                if (vcstate) {
                    let blob = new Blob([buff], {'type': 'audio/ogg codecs=opus'}) //convert buffer back into blob
                    let audio = document.createElement('audio')
                    audio.volume = document
                        .getElementById('playbackVolume')   //set playback volume to playbackVolume.value
                        .value
                    audio.src = window
                        .URL
                        .createObjectURL(blob)  //link audio
                    audio.play()  //play audio
                }
            })
        }
    }
    logit(e) {
        console.log("logging!!!",e.target.value)
    }
    recclick() {  //if using a button for PTT
        if(vcstate) { //button only active if user is in VC
            if(mediaRecorder.state == "recording"){
                document
                    .getElementById("rbutton")
                    .value = "Start Recording"    //change button text
                mediaRecorder.stop()              //stop recording
            } else {
                document
                    .getElementById("rbutton")
                    .value = "Stop Recording"     //change button text
                mediaRecorder.start()             //start recording
            }
        }
    }
    reckeydown(e) { //PTT key pressed down    - currently not bound
        let kc = 90   //preset keyCode for PTT, 90 = 'z'      this check could occur here or before the method is called
        if(e.keyCode==kc){
            if(vcstate && mediaRecorder.state != "recording"){   //only active if user is in VC, make sure user isn't already recording(bug)
                mediaRecorder.start()
            }
        }
    }
    reckeyup(e) {   //PTT key released        - currently not bound
        let kc = 90   //preset keyCode for PTT, 90 = 'z'      this check could occur here or before the method is called
        if(e.keyCode==kc){
            if(vcstate && mediaRecorder.state != "inactive"){   //only active if user is in VC, make sure mediaRecorder isn't already stopped(bug)
                mediaRecorder.stop()
            }
        }
    }
    vcclick() {
        if(vcstate) {
            if(mediaRecorder.state == "recording") {
                this.recclick()
            }
            vcstate = false
            document
                .getElementById("vcbutton")
                .value = "Enter VC"
        } else {
            vcstate = true
            document
                .getElementById("vcbutton")
                .value = "Leave VC"
        }
    }
    recchange(e) {
        gainNode.gain.value = e.target.value
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
                </span> //NOTE: sliders are not sliding currently for some reason, but values are correctly being updated
                <input
                    type="range"
                    id="recordVolume"
                    min="0"
                    max="1"
                    value="1"
                    step="0.01"
                    onChange={this.recchange}/>
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
                    value="Stop Recording"
                    id="rbutton"
                    onClick={this.recclick}/>
                <input
                    type="button"
                    value="Leave VC"
                    id="vcbutton"
                    onClick={this.vcclick}/>
            </div>

        )
    }
}

export default Audio