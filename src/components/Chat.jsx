import React, { useContext, useState, useRef, useEffect, useCallback } from 'react';
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

    let peerConnection = null;

    let channel = useRef(null);

    const [input, setInput] = useState({});
    const [disabledHangup, setDisabledHangup] = useState(true);
    const [disabledConnect, setDisabledConnect] = useState(false);

    // receive input from Input component
    const inputToChat = (data) => {
        setInput(data);
        setMsg(JSON.stringify(data));
        if (channel) {
            console.log(data);           
            channel.current.send(JSON.stringify(data));
        }
        else {
            console.log("channel is null, input: ", data.text);
        }
    }

    const [msg, setMsg] = useState('');

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
    

    const handleReady = async () => {
        // enable hangup, disable ready button
        setDisabledHangup(false);
        setDisabledConnect(true);

        console.log('Create PeerConnection with configuration: ', configuration);
        peerConnection = new RTCPeerConnection(configuration);

        registerPeerConnectionListeners();

        peerConnection.ondatachannel = channelCallback;
        function channelCallback(event) {
            let ch = event.channel;
            channel.current = ch;
            // setChannel(ch);
            channel.current.onopen = handlechannelStatusChange;
            channel.current.onclose = handlechannelStatusChange;

            channel.current.onmessage = handleReceiveMessage;
        }

        // Handle onmessage events for the receiving channel.
        // These are the data messages sent by the sending channel.        
        function handleReceiveMessage(event) {
            console.log(event.data)
            setMsg(event.data)
            // display message as Message component
        }

        function handlechannelStatusChange(event) {
            if (channel) {
                console.log("Receive channel's status has changed to " +
                            channel.current.readyState);
            }
            
            // Here you would do stuff that needs to be done
            // when the channel's status changes.
        }

        // TODO: when remote description received from signaling server
        socket.on("rtc_offer", async (data) => {
            if (!peerConnection.currentRemoteDescription && data.offer) {
            console.log('Got offer - set remote description: ', data.offer);
            const ans = new RTCSessionDescription(data.offer);
            await peerConnection.setRemoteDescription(ans);
            }

            // setup for recipient end of call
            // set up the ICE candidates
            peerConnection.onicecandidate = evt => {
            console.log("received ice candidate (recipient) ", evt);
            if (evt.candidate) {
                socket.emit("new_ice_candidate", evt.candidate);
            }
            };

            socket.on("new_ice_candidate", (evt) => {
            try {
                console.log("candidate on recipient end: ", evt)
            } catch (e) {
                console.log(e)
            }
            if (evt) {
                peerConnection.addIceCandidate(new RTCIceCandidate(evt))
                .catch((e) => console.log("add ICE candidate failed ", e))
            } else {
                console.log("no e.candidate");
            }
            })


            // create SDP answer
            const answer = await peerConnection.createAnswer();
            console.log('Created answer - set local description:', answer);
            await peerConnection.setLocalDescription(answer);

            const roomWithAnswer = {
            answer: {
                type: answer.type,
                sdp: answer.sdp,
            },
            };

            socket.emit("rtc_answer", roomWithAnswer);
        })
    }

    // create offer
    const handleConnect = async () => {
        // const URL = "https://rita-chat-server-d349b20179e4.herokuapp.com/";
        // const URL = "https://rita-chat-react-6198aaa528f8.herokuapp.com/";
        //const socket = io(URL, { autoConnect: false });
        // setSocket(io(URL));

        // disable connect button and enable hangup button
        setDisabledConnect(true);
        setDisabledHangup(false);

        console.log('Create PeerConnection with configuration: ', configuration);
        peerConnection = new RTCPeerConnection(configuration);
        console.log(peerConnection);
        registerPeerConnectionListeners();

        // Create the data channel and establish its event listeners
        const ch = peerConnection.createDataChannel("datachannel");
        channel.current = ch;
        console.log("channel: ", channel);
        channel.current.onopen = handleSendChannelStatusChange;
        channel.current.onclose = handleSendChannelStatusChange;

        channel.current.onmessage = handleReceiveMessage;

        // Handle onmessage events for the receiving channel.
        // These are the data messages sent by the sending channel.        
        function handleReceiveMessage(event) {
            console.log(event)
            // display message as Message component
            // TODO

        }

        function handleSendChannelStatusChange(event) {
            if (channel) {                
                console.log("Send channel's status has changed to " +
                    channel.current.readyState);
              var state = channel.current.readyState;
            
              if (state === "open") {
                // sendButton.disabled = false;
                // messageInputBox.disabled = false;
                // messageInputBox.focus();
              } else {
                //messageInputBox.disabled = true;
                // sendButton.disabled = true;
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
        // document.querySelector('#currentRoom').innerText = `Current room is ${roomId} - You are the caller.`
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


    const handleHangup = async () => {        
        if (peerConnection) {
            peerConnection.close();
        }

        setDisabledHangup(true);
        //TODO: Delete room on hangup
    
        document.location.reload(true);
    }

    const handleVideoCall = async () => {
        return;
    }
    const handleAddPerson = async () => {
        return;
    }
    const handleMore = async () => {
        return;
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
                            <i className="material-icons mdc-button__icon" aria-hidden="true">call</i>
                        </button>
                        <button onClick={handleConnect} className="mdc-button mdc-button--raised" disabled = {disabledConnect} id="connectBtn">
                            <i className="material-icons mdc-button__icon" aria-hidden="true">connect_without_contact</i>
                        </button>
                        <button onClick={handleHangup} className="mdc-button mdc-button--raised" disabled={disabledHangup} id="hangupBtn">
                            <i className="material-icons mdc-button__icon" aria-hidden="true">call_end</i>
                        </button>
                        <button onClick={handleVideoCall} className="mdc-button mdc-button--raised" disabled id="videoCallBtn">
                            <i className="material-icons mdc-button__icon" aria-hidden="true">video_call</i>
                        </button>
                        {/* <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" /> */}
                        <button onClick={handleAddPerson} className="mdc-button mdc-button--raised" disabled id="addPersonBtn">
                            <i className="material-icons mdc-button__icon" aria-hidden="true">person_add</i>
                        </button>
                        <button onClick={handleMore} className="mdc-button mdc-button--raised" disabled id="MoreBtn">
                            <i className="material-icons mdc-button__icon" aria-hidden="true">more_horiz</i>
                            {/* <span className="mdc-button__label">More</span> */}
                        </button>
                    </div>
                </div>
            </div>
                <Messages chatToMsg={msg}/>
                <Input inputToChat={inputToChat}/>
        </div>
    )
}

export default Chat;