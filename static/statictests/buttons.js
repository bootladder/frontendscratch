//Uses jQuery
console.log("hello");
$("#divTest1").text("Hello, world!");

var btnStartRecording = document.getElementById('btn-start-recording');
var btnStopRecording = document.getElementById('btn-stop-recording');
var btnProcessRecording = document.getElementById('btn-process-recording');

var audio = document.querySelector('audio');

btnStartRecording.onclick = function() {
    this.disabled = true;
    captureMicrophone(function(microphone) {
				console.log("getUserMedia OK, callback();");
        setSrcObject(microphone, audio);
        //audio.play(); //has no effect?

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

btnStopRecording.onclick = function() {
    this.disabled = true;
    recorder.stopRecording(stopRecordingCallback);
};

function stopRecordingCallback() {
    var blob = recorder.getBlob();
    audio.src = URL.createObjectURL(blob);
    audio.play();

    recorder.microphone.stop();
}

btnProcessRecording.onclick = function() {
 // get recorded blob
		var blob = recorder.getBlob();

		// generating a random file name
		var fileName = "my filename";

		// we need to upload "File" --- not "Blob"
		var fileObject = new File([blob], fileName, {
				type: 'video/webm'
		});

		var formData = new FormData();

		// recorded data
		formData.append('video-blob', fileObject);

		// file name
		formData.append('video-filename', fileObject.name);

}
