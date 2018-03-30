console.log("Inside webrtc-helpers")
function captureMicrophone(callback) {
    navigator.mediaDevices.getUserMedia({audio: true}).then(callback).catch(function(error) {
        alert('Unable to access your microphone.');
        console.error(error);
    });
}
