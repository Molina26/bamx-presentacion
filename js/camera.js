console.log("camera importado");
class Camera {
  constructor(videoNode) {
    this.videoNode = videoNode;
  }

  power() {
    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: {
          width: 300,
          heigt: 300,
        },
      })
      .then((stream) => {
        this.videoNode.srcObject = stream;
        this.stream = stream;
      });
  }

  off() {
    this.videoNode.pause();
    if (this.stream) {
      this.stream.getTracks()[0].stop();
    }
  }

  takePhoto() {
    let canvas = document.createElement("canvas");
    canvas.setAttribute("width", 300);
    canvas.setAttribute("height", 300);

    let context = canvas.getContext("2d");
    context.drawImage(this.videoNode, 0, 0, canvas.width, canvas.height);

    this.photo = context.canvas.toDataURL();
    canvas = null;
    context = null;

    return this.photo;
  }
}
