import { connectSocket } from './libs/socket.js';
let localPeerConnection = null
let remotePeerConnection = null;
let socket = null;
// let userName = prompt('输入你的名字');

// 产生随机数
if (!location.hash) {
  location.hash = Math.floor(Math.random() * 0xFFFFFF).toString(16);
}
// 获取房间号
const roomHash = location.hash.substring(1);
const mediaConstraints = {
  video: {
    width: 1280,
    height: 720,
  },
  // audio: true,
};

function app() {
  initSocket();
  init();
}

function reportError(errMessage) {
  log_error(`Error ${errMessage.name}: ${errMessage.message}`);
}

function init() {
  localPeerConnection = createPeerConnection();

  const $video = document.querySelector("#local_video");

  navigator.mediaDevices.getUserMedia(mediaConstraints).then((stream) => {
    $video.srcObject = stream;
    stream
      .getTracks()
      .forEach((track) => {
        localPeerConnection.addTrack(track, stream)
      });
  });
}

function initSocket() {
  socket = connectSocket();

  socket.emit('join', 'zhanglun-test');

  socket.on('message', (data) => {
    const msg = JSON.parse(data);
    log("Message received: ");
    console.dir(msg);
    const time = new Date(msg.date);
    const timeStr = time.toLocaleTimeString();

    switch (msg.type) {
      case "video-offer":
        handleVideoOfferMsg(msg);
        break;
      case "video-answer":  // Callee has answered our offer
        handleVideoAnswerMsg(msg);
        break;
      case "new-ice-candidate": // A new ICE candidate has been received
        handleNewICECandidateMsg(msg);
        break;
      default:
        break;
    }
  });
}

function handleVideoOfferMsg(msg) {
  var localStream = null;

  var desc = new RTCSessionDescription(msg.sdp);

  localPeerConnection.setRemoteDescription(desc).then(function () {
    return navigator.mediaDevices.getUserMedia(mediaConstraints);
  })
  .then(function(stream) {
    localStream = stream;
    document.querySelector("#local_video").srcObject = localStream;

    localStream.getTracks().forEach(track => localPeerConnection.addTrack(track, localStream));
  })
  .then(function() {
    return localPeerConnection.createAnswer();
  })
  .then(function(answer) {
    return localPeerConnection.setLocalDescription(answer);
  })
  .then(function() {
    var msg = {
      type: "video-answer",
      sdp: localPeerConnection.localDescription
    };

    sendToServer(msg);
  })
  .catch((err) => {
    log_error(err);
  });
}

function handleVideoAnswerMsg(msg) {
  log("*** Call recipient has accepted our call");

  // Configure the remote description, which is the SDP payload
  // in our "video-answer" message.

  var desc = new RTCSessionDescription(msg.sdp);
  return localPeerConnection.setRemoteDescription(desc).catch(reportError);
}

function handleNewICECandidateMsg(msg) {
  const candidate = new RTCIceCandidate(msg.candidate);

  localPeerConnection.addIceCandidate(candidate)
    .catch(reportError);
}

function sendToServer(msg) {
  var msgJSON = JSON.stringify(msg);

  log("Sending '" + msg.type + "' message: " + msgJSON);
  socket.send(msgJSON);
}

function log_error(text) {
  var time = new Date();

  console.trace("[" + time.toLocaleTimeString() + "] " + text);
}

function log(text) {
  var time = new Date();

  console.log("[" + time.toLocaleTimeString() + "] " + text);
}

function createPeerConnection() {
  const peer = new RTCPeerConnection();
  peer.onicecandidate = handleICECandidateEvent;
  peer.oniceconnectionstatechange = handleICEConnectionStateChangeEvent;
  peer.onicegatheringstatechange = handleICEGatheringStateChangeEvent;
  peer.onsignalingstatechange = handleSignalingStateChangeEvent;
  peer.onnegotiationneeded = handleNegotiationNeededEvent;
  peer.ontrack = handleTrackEvent;

  return peer;
}

function handleTrackEvent(event) {
  log("*** Track event");
  document.getElementById("received_video").srcObject = event.streams[0];
  // document.getElementById("hangup-button").disabled = false;
}

function handleNegotiationNeededEvent() {
  localPeerConnection
    .createOffer()
    .then(function (offer) {
      return localPeerConnection.setLocalDescription(offer);
    })
    .then(function () {
      sendToServer({
        type: "video-offer",
        sdp: localPeerConnection.localDescription,
      });
    })
    .catch(reportError);
}

function handleICECandidateEvent(event) {
  if (event.candidate) {
    log("*** Outgoing ICE candidate: " + event.candidate.candidate);

    sendToServer({
      type: "new-ice-candidate",
      candidate: event.candidate,
    });
  }
}

function handleICEConnectionStateChangeEvent(event) {
  log(
    "*** ICE connection state changed to " +
      localPeerConnection.iceConnectionState
  );

  switch (localPeerConnection.iceConnectionState) {
    case "closed":
    case "failed":
    case "disconnected":
      closeVideoCall();
      break;
  }
}

function handleSignalingStateChangeEvent(event) {
  log(
    "*** WebRTC signaling state changed to: " +
      localPeerConnection.signalingState
  );
  switch (localPeerConnection.signalingState) {
    case "closed":
      closeVideoCall();
      break;
  }
}

function handleICEGatheringStateChangeEvent(event) {
  log(
    "*** ICE gathering state changed to: " +
      localPeerConnection.iceGatheringState
  );
}

function closeVideoCall() {
  var remoteVideo = document.getElementById("received_video");
  var localVideo = document.getElementById("local_video");

  if (localPeerConnection) {
    localPeerConnection.ontrack = null;
    localPeerConnection.onremovetrack = null;
    localPeerConnection.onremovestream = null;
    localPeerConnection.onicecandidate = null;
    localPeerConnection.oniceconnectionstatechange = null;
    localPeerConnection.onsignalingstatechange = null;
    localPeerConnection.onicegatheringstatechange = null;
    localPeerConnection.onnegotiationneeded = null;

    if (remoteVideo.srcObject) {
      remoteVideo.srcObject.getTracks().forEach(track => track.stop());
    }

    if (localVideo.srcObject) {
      localVideo.srcObject.getTracks().forEach(track => track.stop());
    }

    localPeerConnection.close();
    localPeerConnection = null;
  }

  remoteVideo.removeAttribute("src");
  remoteVideo.removeAttribute("srcObject");
  localVideo.removeAttribute("src");
  remoteVideo.removeAttribute("srcObject");

  document.getElementById("hangup-button").disabled = true;
  targetUsername = null;
}

window.onload = app;
