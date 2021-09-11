(() => {
  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  })
    .then((localStream) => {
      console.log(localStream);
    })
})();