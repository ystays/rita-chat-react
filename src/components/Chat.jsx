import React, { useContext, useState } from 'react';
// import Video from "../img/video.png";
// import Add from "../img/add_person.png";
// import More from "../img/more.png";

import Messages from "./Messages";
import Input from "./Input";
import { AuthContext } from '../context/AuthContext';

import { ChatContext } from "../context/ChatContext";

const Chat = ({ socket }) => {

    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);

    const [peerConnection, setPeerConnection] = useState(null);
    // const [socket, setSocket] = useState(null);

    const [channel, setChannel] = useState(null);

    const [input, setInput] = useState({});

    const inputToChat = (data) => {
        setInput(data);
    }

    // Default configuration - Change these if you have a different STUN or TURN server.
    const configuration = {
        iceServers: [
        {
            urls: [
            'stun:stun1.l.google.com:19302',
            'stun:stun2.l.google.com:19302'
            ],
        },
        ],
        iceCandidatePoolSize: 10,
    };

    function registerPeerConnectionListeners() {
        peerConnection.addEventListener('icegatheringstatechange', () => {
          console.log(
              `ICE gathering state changed: ${peerConnection.iceGatheringState}`);
        });
      
        peerConnection.addEventListener('connectionstatechange', () => {
          console.log(`Connection state change: ${peerConnection.connectionState}`);
          if (peerConnection.connectionState === 'connected') {
            console.log("Peers connected!");
          }
        });
      
        peerConnection.addEventListener('signalingstatechange', () => {
          console.log(`Signaling state change: ${peerConnection.signalingState}`);
        });
      
        peerConnection.addEventListener('iceconnectionstatechange ', () => {
          console.log(
              `ICE connection state change: ${peerConnection.iceConnectionState}`);
        });
    }
    
    // create offer
    const handleReady = async () => {
        // const URL = "https://rita-chat-server-d349b20179e4.herokuapp.com/";
        // const URL = "https://rita-chat-react-6198aaa528f8.herokuapp.com/";
        //const socket = io(URL, { autoConnect: false });
        // setSocket(io(URL));

        // disable Ready button and enable hangup button

        console.log('Create PeerConnection with configuration: ', configuration);
        setPeerConnection(new RTCPeerConnection(configuration));

        registerPeerConnectionListeners();

        // Create the data channel and establish its event listeners
        setChannel(peerConnection.createDataChannel("sendChannel"));
        setChannel.onopen = handleSendChannelStatusChange;
        setChannel.onclose = handleSendChannelStatusChange;

        function handleSendChannelStatusChange(event) {
            if (sendChannel) {
              var state = sendChannel.readyState;
            
              if (state === "open") {
                sendButton.disabled = false;
                messageInputBox.disabled = false;
                messageInputBox.focus();
              } else {
                //messageInputBox.disabled = true;
                sendButton.disabled = true;
              }
            }
        }

          // Create an offer
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        console.log('Created offer: ', offer);

        const roomWithOffer = {
            offer: {
            type: offer.type,
            sdp: offer.sdp
            }
        };
        // use signaling server to transmit offer to recipient
        await socket.emit("rtc_offer", roomWithOffer);
        
        // add room id
        const roomId = socket.id;
        console.log(`New room created with SDP offer. Room ID: ${roomId}`);
        document.querySelector('#currentRoom').innerText = `Current room is ${roomId} - You are the caller.`
        // Code for creating room above

        socket.on("rtc_answer", async (data) => {
            if (!peerConnection.currentRemoteDescription && data.answer) {
            console.log('Got answer - set remote description: ', data.answer);
            const answer = new RTCSessionDescription(data.answer);
            await peerConnection.setRemoteDescription(answer);

            // set up the ICE candidates
            peerConnection.onicecandidate = evt => {
                console.log("received ice candidate (offerer)", evt);
                if (evt.candidate) {
                socket.emit("new_ice_candidate", evt.candidate);
                }
            };
        
            socket.on("new_ice_candidate", (evt) => {
                try {
                peerConnection.addIceCandidate(new RTCIceCandidate(evt))
                .catch((e) => console.log("add ICE candidate failed ", e))
                } catch(e) {
                console.log("no evt.candidate: ", e);
                }
            })
            }
        })
    }

    const handleConnect = async () => {

    }

    const handleHangup = async () => {

    }

    const handleVideoCall = async () => {

    }

    const handleAddPerson = async () => {

    }

    const handleMore = async () => {

    }

    return ( 
        <div className='chat'>
            <div className='chatInfo'>
                <span>{data.user?.displayName}</span>
                <div className='chatIcons'>
                    {/* <link href="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css" rel="stylesheet" /> */}
                    {/* <script src="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.js"></script> */}
                    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"></link>
                    <div id="buttons" className="ctrl__buttons">
                        <button onClick={handleReady} className="mdc-button mdc-button--raised" id="readyBtn">
                            {/* <i className="material-icons mdc-button__icon" aria-hidden="true">phone_enabled</i> */}
                            <i className="material-icons mdc-button__icon" aria-hidden="true">connect_without_contact</i>
                            {/* <span className="mdc-button__label">Go online</span> */}
                        </button>
                        <button onClick={handleConnect} className="mdc-button mdc-button--raised" disabled id="connectBtn">
                            <i className="material-icons mdc-button__icon" aria-hidden="true">call</i>
                            {/* <span className="mdc-button__label">Start chat</span> */}
                        </button>
                        <button onClick={handleHangup} className="mdc-button mdc-button--raised" disabled id="hangupBtn">
                            <i className="material-icons mdc-button__icon" aria-hidden="true">call_end</i>
                            {/* <span className="mdc-button__label">Hangup</span> */}
                        </button>
                        <button onClick={handleVideoCall} className="mdc-button mdc-button--raised" id="videoCallBtn">
                            <i className="material-icons mdc-button__icon" aria-hidden="true">video_call</i>
                            {/* <span className="mdc-button__label">Video call</span> */}
                        </button>
                        {/* <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" /> */}
                        <button onClick={handleAddPerson} className="mdc-button mdc-button--raised" id="addPersonBtn">
                            <i className="material-icons mdc-button__icon" aria-hidden="true">person_add</i>
                            {/* <span className="mdc-button__label"></span> */}
                        </button>
                        <button onClick={handleMore} className="mdc-button mdc-button--raised" id="MoreBtn">
                            <i className="material-icons mdc-button__icon" aria-hidden="true">more_horiz</i>
                            {/* <span className="mdc-button__label">More</span> */}
                        </button>
                    </div>

                    <script src="/socket.io/socket.io.js"></script>
                    <script type="module" src="../client.js"></script>
                    {/* <img src={Video} alt='' />
                    <img src={Add} alt='' />
                    <img src={More} alt='' /> */}
                </div>
            </div>
                <Messages />
                <Input inputToChat={inputToChat}/>
        </div>
    )
}

export default Chat;