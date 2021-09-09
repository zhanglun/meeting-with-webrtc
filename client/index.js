(() => {
  navigator.mediaDevices.getUserMedia({
    audio: true,
  })
    .then((localStream) => {
      console.log(localStream);
    })
})();