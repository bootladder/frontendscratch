//Uses jQuery
console.log("hello");
$("#divTest1").text("Hello, world!");

var btnStartRecording = document.getElementById('btn-start-recording');
var btnStopRecording = document.getElementById('btn-stop-recording');
var btnProcessRecording = document.getElementById('btn-process-recording');
var btnLoadRecordings = document.getElementById('btn-load-recordings');

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
		
		var blob = recorder.getBlob();

		var fileName = "audiomessage_"+new Date().valueOf();

		// we need to upload "File" --- not "Blob"
		var fileObject = new File([blob], fileName, {
				type: 'audio/wav'
		});

		var formData = new FormData();

		// recorded data
		formData.append('file', fileObject);

		// file name
		formData.append('filename', fileObject.name);

		console.log("Uploading...");
		$.ajax({
				url: 'https://orbhub.bootladder.com:9002/audiomessageupload', 
				data: formData,
				cache: false,
				contentType: false,
				processData: false,
				type: 'POST',
				success: function(response) {
						var msg = 'successfully uploaded recorded blob. heres message: ' + response;
						alert(msg);

						//var fileDownloadURL = 'https://google.com'

						//// preview the uploaded file URL
						//document.getElementById('header').innerHTML = '<a href="' + fileDownloadURL + '" target="_blank">' + fileDownloadURL + '</a>';

						//// preview uploaded file in a VIDEO element
						//document.getElementById('your-video-id').src = fileDownloadURL;

						//// open uploaded file in a new tab
						//window.open(fileDownloadURL);
				},
				error: function(xhr, status, error) {
						console.log(xhr.responseText);
						console.log(xhr);
						console.log(status);
						console.log(error);
				}
		}).fail(function( jqXHR, textStatus ) {  
    alert( "Triggered fail callback: " + textStatus );  
     }); 
;
}


btnLoadRecordings.onclick = function() {
    console.log("loading3")
    var audio = document.querySelector('audio') || new Audio();
    audio.src="https://orbhub.bootladder.com:9002/audiomessagedownload/latest";
    audio.load()
}


