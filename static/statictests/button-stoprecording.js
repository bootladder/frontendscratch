var btnStopRecording = document.getElementById('btn-stop-recording');
var audioRecording = document.getElementById('audio-recording');

btnStopRecording.onclick = function() {
    this.disabled = true;
    recorder.stopRecording(stopRecordingCallback);
};

function stopRecordingCallback() {
    var blob = recorder.getBlob();
    audioRecording.src = URL.createObjectURL(blob);
    audioRecording.muted = false;
    audioRecording.play();

    recorder.microphone.stop();
}

