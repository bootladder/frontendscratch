var btnStopRecording = document.getElementById('btn-stop-recording');

btnStopRecording.onclick = function() {
    this.disabled = true;
    recorder.stopRecording(stopRecordingCallback);
};

function stopRecordingCallback() {
    var blob = recorder.getBlob();
    audio.src = URL.createObjectURL(blob);
    audio.muted = false;
    audio.play();

    recorder.microphone.stop();
}

