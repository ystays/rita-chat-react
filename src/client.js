mdc.ripple.MDCRipple.attachTo(document.querySelector('.mdc-button'));

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

let peerConnection = null;
let remoteStream = null;
let roomDialog = null;
let roomId = null;

let sendChannel = null;
let receiveChannel = null;

//import { io } from "socket.io-client";
// const io = require("socket.io-client");
//const io = require("../node_modules/socket.io/client-dist/socket.io.js");
const URL = "http://localhost:4000";
//const socket = io(URL, { autoConnect: false });
const socket = io(URL)

let message_box = null;
let send_button = null;

var sendButton = null;
var messageInputBox = null;
var receiveBox = null;

function init() {
  document.querySelector('#connectBtn').addEventListener('click', createOffer);
  document.querySelector('#readyBtn').addEventListener('click', receiveOfferAndSendAnswer);
  document.querySelector('#hangupBtn').addEventListener('click', hangUp);
  // document.querySelector('#createBtn').addEventListener('click', createRoom);
  // document.querySelector('#joinBtn').addEventListener('click', joinRoom);
  // roomDialog = new mdc.dialog.MDCDialog(document.querySelector('#room-dialog'));

  const $messageForm = document.querySelector("#message-form")
  messageInputBox = $messageForm.querySelector("input")
  sendButton = $messageForm.querySelector("button")

  sendButton.addEventListener('click', sendMessage, false);
}

function sendMessage(e) {
  // prevent form submission refreshing page
  e.preventDefault();
  var message = messageInputBox.value;
  sendChannel.send(message);
  
  // Clear the input box and re-focus it, so that we're
  // ready for the next message.
  messageInputBox.value = "";
  messageInputBox.focus();
}

async function createOffer() {
  document.querySelector('#hangupBtn').disabled = false;
  document.querySelector('#connectBtn').disabled = true;
  
  console.log('Create PeerConnection with configuration: ', configuration);
  peerConnection = new RTCPeerConnection(configuration);

  registerPeerConnectionListeners();

  // Create the data channel and establish its event listeners
  sendChannel = peerConnection.createDataChannel("sendChannel");
  sendChannel.onopen = handleSendChannelStatusChange;
  sendChannel.onclose = handleSendChannelStatusChange;
  
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

async function receiveOfferAndSendAnswer() {
  document.querySelector('#hangupBtn').disabled = false;
  document.querySelector('#readyBtn').disabled = true;

  console.log('Create PeerConnection with configuration: ', configuration);
  peerConnection = new RTCPeerConnection(configuration);

  registerPeerConnectionListeners();

  peerConnection.ondatachannel = receiveChannelCallback;
  function receiveChannelCallback(event) {
    receiveChannel = event.channel;
    receiveChannel.onopen = handleReceiveChannelStatusChange;
    receiveChannel.onclose = handleReceiveChannelStatusChange;

    receiveChannel.onmessage = handleReceiveMessage;
  }

  // Handle onmessage events for the receiving channel.
  // These are the data messages sent by the sending channel.
  
  function handleReceiveMessage(event) {
    console.log(event)
    // var el = document.createElement("p");
    // var txtNode = document.createTextNode(event.data);
    
    // el.appendChild(txtNode);
    // receiveBox.appendChild(el);
  }

  function handleReceiveChannelStatusChange(event) {
    if (receiveChannel) {
      console.log("Receive channel's status has changed to " +
                  receiveChannel.readyState);
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

async function hangUp(e) {
  // const tracks = document.querySelector('#localVideo').srcObject.getTracks();
  // tracks.forEach(track => {
  //   track.stop();
  // });

  if (remoteStream) {
    remoteStream.getTracks().forEach(track => track.stop());
  }

  if (peerConnection) {
    peerConnection.close();
  }

  //document.querySelector('#joinBtn').disabled = true;
  //document.querySelector('#createBtn').disabled = true;
  document.querySelector('#hangupBtn').disabled = true;
  document.querySelector('#currentRoom').innerText = '';

  // Delete room on hangup
  if (roomId) {
    const db = firebase.firestore();
    const roomRef = db.collection('rooms').doc(roomId);
    const calleeCandidates = await roomRef.collection('calleeCandidates').get();
    calleeCandidates.forEach(async candidate => {
      await candidate.delete();
    });
    const callerCandidates = await roomRef.collection('callerCandidates').get();
    callerCandidates.forEach(async candidate => {
      await candidate.delete();
    });
    await roomRef.delete();
  }

  document.location.reload(true);
}

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




init();
