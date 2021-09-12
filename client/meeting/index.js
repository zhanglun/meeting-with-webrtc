let localPeerConnection = null;
let remotePeerConnection = null;
let socket = null;
const constraints = {
  video: {
    width: 1280,
    height: 720,
  },
  // audio: true,
}

function app() {
  connectSokcet();
  init();
}

function init() {
  localPeerConnection = createPeerConnection();

  const $video = document.querySelector('#video');

  navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => {
      console.log(stream);
      $video.srcObject = stream;
      stream.getTracks().forEach(
        transceiver = track => localPeerConnection.addTransceiver(track, { streams: [stream] })
      );
    });
}

function connectSokcet() {
  socket = io();
}

function sendToServer(msg) {
  var msgJSON = JSON.stringify(msg);

  log("Sending '" + msg.type + "' message: " + msgJSON);
  socket.send(msgJSON);
}

function log(text) {
  var time = new Date();

  console.log("[" + time.toLocaleTimeString() + "] " + text);
}

function createPeerConnection() {
  peer = new RTCPeerConnection();
  peer.onicecandidate = handleICECandidateEvent;
  peer.oniceconnectionstatechange = handleICEConnectionStateChangeEvent;
  peer.onicegatheringstatechange = handleICEGatheringStateChangeEvent;
  peer.onsignalingstatechange = handleSignalingStateChangeEvent;
  // peer.onnegotiationneeded = handleNegotiationNeededEvent;
  // peer.ontrack = handleTrackEvent;

  return peer;
}

function handleICECandidateEvent(event) {
  if (event.candidate) {
    log("*** Outgoing ICE candidate: " + event.candidate.candidate);

    sendToServer({
      type: "new-ice-candidate",
      target: targetUsername,
      candidate: event.candidate
    });
  }
}

function handleICEConnectionStateChangeEvent(event) {
  log("*** ICE connection state changed to " + myPeerConnection.iceConnectionState);

  switch (myPeerConnection.iceConnectionState) {
    case "closed":
    case "failed":
    case "disconnected":
      closeVideoCall();
      break;
  }
}

function handleSignalingStateChangeEvent(event) {
  log("*** WebRTC signaling state changed to: " + myPeerConnection.signalingState);
  switch (myPeerConnection.signalingState) {
    case "closed":
      closeVideoCall();
      break;
  }
}

function handleICEGatheringStateChangeEvent(event) {
  log("*** ICE gathering state changed to: " + myPeerConnection.iceGatheringState);
}


window.onload = app;