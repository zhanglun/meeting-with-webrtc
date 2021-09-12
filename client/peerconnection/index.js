function app() {

  pc = new RTCPeerConnection(null);
  pc.onaddstream = gotRemoteStream;

  pc.addStream(localStream); // 为 peerConnection 增加媒体流；
  pc.createOffer(gotOffer);  // 创建 SDP Offer / SDP Answer

  function gotOffer(desc) {
    pc.setLocalDescription(desc);
    sendOffer(desc);
  }

  function gotAnswer(desc) {
    pc.setRemoteDescription(desc);
  }

  function gotRemoteStream(e) {
    attachMediaStream(remoteVideo, e.stream);
  }

}

window.onload = app;