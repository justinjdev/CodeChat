import React, {Component} from 'react'
import io from 'socket.io-client'

import './Audio.css'

// const socket = io('https://ezchatrooms.herokuapp.com/') //old test, maybe
// remove it?
const socket = io('localhost:8080') // local computer
let mediaRecorder    //records audio
let vcstate = false   //tracks whether user is in VC or not
let gainNode         //pass audio stream through gainNode to manipulate recording volume
let pbvolume = 1     //storage for pbvolume so we do not have to manually retrieve it every time we play a segment
let recinterval  //stores interval id: used to setInterval when recording and clearInterval when not recording
let mic // T/F did user allow mic
// const socket = io('104.131.129.223:8080') // servers

class Audio extends Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.recclick = this.recclick.bind(this)
        this.vcclick = this.vcclick.bind(this)
        this.recchange = this.recchange.bind(this)
        this.pbchange = this.pbchange.bind(this)
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
                .getUserMedia(constraints)  //ask user for permission to use microphone
                .then(function (mediaStream) {  //user accepts
                    mic = true
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
                  //      socket.emit('voice', blob)  //send blob to server

                  
                  let audio = document.createElement('audio')
                  audio.volume = pbvolume     //set playback volume
                  audio.src = window    //link audio
                      .URL
                      .createObjectURL(blob)
                  audio.play()    //play audio
                    }
                })
                .catch(function (err) {  ///user does not accept or error
                    mic = false
                })
        }
        socket.on('voice', function (buff) {
            if(vcstate) {
                let blob = new Blob([buff], {'type': 'audio/ogg codecs=opus'})   //convert buffer back into blob
                let audio = document.createElement('audio')
                audio.volume = pbvolume     //set playback volume
                audio.src = window    //link audio
                    .URL
                    .createObjectURL(blob)
                audio.play()    //play audio
            }
        })
    }
    recclick() {  //if using a button for PTT
        if(mic){  //inactive if user does not allow access to microphone. Show Alert
            if(vcstate) { //button only active if user is in VC
                if(mediaRecorder.state === "recording"){  //if recording, stop recording and clear interval
                    document
                        .getElementById("rbutton")
                        .value = "Start Recording"    //change button text
                    clearInterval(recinterval)
                    mediaRecorder.stop()              //stop recording
                } else {  //start recording and set interval
                    document
                        .getElementById("rbutton")
                        .value = "Stop Recording"     //change button text
                    recinterval = setInterval(function () {   //every 500 ms, if recording, restart mediaRecorder to send buffer to server
                        mediaRecorder.stop()
                        mediaRecorder.start()
                    }, 500) //interval time in ms. Lower time makes audio choppy
                    mediaRecorder.start()             //start recording
                }
            }
        } else {
            window.alert("Microphone Disabled")
        }
    }
    //reckeydown(e) { //PTT key pressed down    - currently not bound
    //    let kc = 90   //preset keyCode for PTT, 90 = 'z'      this check could occur here or before the method is called
    //    if(e.keyCode==kc){
    //        if(vcstate && mediaRecorder.state != "recording"){   //only active if user is in VC, make sure user isn't already recording(bug)
    //            mediaRecorder.start()
    //        }
    //    }
    //}
    //reckeyup(e) {   //PTT key released        - currently not bound
    //    let kc = 90   //preset keyCode for PTT, 90 = 'z'      this check could occur here or before the method is called
    //    if(e.keyCode==kc){
    //        if(vcstate && mediaRecorder.state != "inactive"){   //only active if user is in VC, make sure mediaRecorder isn't already stopped(bug)
    //            mediaRecorder.stop()
    //        }
    //    }
    //}
    vcclick() {
        if(vcstate) { //if in VC, disable VC
            if(mic) {
                if(mediaRecorder.state === "recording") {  //disable recording if recording. Do not check if mic disabled
                    this.recclick()
                }
            }
            vcstate = false
            document
                .getElementById("vcbutton")
                .value = "Enter VC"
        } else { //enter VC
            vcstate = true
            document
                .getElementById("vcbutton")
                .value = "Leave VC"
        }
    }
    recchange(e) {  //set gain.value to new value if mic is enabled, else display alert
        if(mic) {
            gainNode.gain.value = e.target.value
        } else {
            window.alert("Microphone Disabled")
        }
    }
    pbchange(e) {  //set playback volume to new value
        pbvolume = e.target.value
    }
    render() {
        return (
            <div className="Audiochat">
                <span>
                    RecordVolume:
                </span>
                <input
                    type="range"
                    id="recordVolume"
                    min="0"
                    max="1"
                    step="0.01"
                    defaultValue="1"
                    onChange={this.recchange}/>
                <span>
                    PlaybackVolume:
                </span>
                <input
                    type="range"
                    id="playbackVolume"
                    min="0"
                    max="1"
                    step="0.01"
                    defaultValue="1"
                    onChange={this.pbchange}/>
                <input
                    type="button"
                    value="Start Recording"
                    id="rbutton"
                    onClick={this.recclick}/>
                <input
                    type="button"
                    value="Enter VC"
                    id="vcbutton"
                    onClick={this.vcclick}/>
            </div>
        )
    }
}

export default Audio