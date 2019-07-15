var btnStartRecording = document.getElementById('btn-start-recording');
var audioRecording = document.getElementById('audio-recording');

btnStartRecording.onclick = function() {
    this.disabled = true;
    captureMicrophone(function(microphone) {
				console.log("getUserMedia OK, callback();");
        setSrcObject(microphone, audioRecording);
        //audio.play(); //has no effect?
        audioRecording.muted = true;

        recorder = RecordRTC(microphone, {
            type: 'audio',
            recorderType: StereoAudioRecorder,
            desiredSampRate: 16000
        });

        recorder.startRecording();

        // release microphone on stopRecording
        recorder.microphone = microphone;

        btnStopRecording.disabled = false;
    });
};


