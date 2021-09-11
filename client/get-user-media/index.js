function app (){
  const constraints = {
    video: {
      width: 1280,
      height: 720,
    },
    // audio: true,
  }

  const $video = document.querySelector('#video');

  navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => {
      console.log(stream);
      $video.srcObject = stream;
    });
}

window.onload = app;