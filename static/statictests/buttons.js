//Uses jQuery
console.log("hello");

var btnStartRecording = document.getElementById('btn-start-recording');
var btnStopRecording = document.getElementById('btn-stop-recording');
var btnProcessRecording = document.getElementById('btn-process-recording');
var btnLoadRecordings = document.getElementById('btn-load-recordings');

var audio = document.querySelector('audio');
var audioPlayback = document.getElementById('audio-playback');
var divRecordingsList = document.getElementById('div-recordings-list');

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
		
    // Convert recorded blob to File with name
		var blob = recorder.getBlob();
		var fileName = "audiomessage_"+new Date().valueOf();
		var fileObject = new File([blob], fileName, {
				type: 'audio/wav'
		});

    // Create JSON messagedesc from DOM
    var messagedesc  = create_messagedesc()

    // Create Form with recorded blob and JSON messagedesc
		var formData = new FormData();
		formData.append('filename', fileObject.name);
		formData.append('messagedesc', messagedesc);
		formData.append('file', fileObject);

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

function create_messagedesc() {
    var inputSenderVal = 
            document.querySelector('input[name=sender]:checked').value
    var inputDestinationVal = 
            document.querySelector('input[name=destination]:checked').value
    var inputTopicVal = 
            document.querySelector('input[name=topic]:checked').value
 
    var blah = {}
    blah.sender = inputSenderVal
    blah.destination = inputDestinationVal
    blah.topic = inputTopicVal
    console.log(JSON.stringify(blah))
    return  JSON.stringify(blah)
}


btnLoadRecordings.onclick = function() {
    console.log("loading3")
    var audio = document.getElementById('audio-playback') || new Audio();
    audio.src="https://orbhub.bootladder.com:9002/audiomessagedownload/latest";
    audio.load()

    fetchRecordingsList( refreshRecordingsList ) //is a callback
}

function fetchRecordingsList( callback ) {
    $.ajax({
        dataType: "json",
        url: "https://orbhub.bootladder.com:9002/audiomessageapi/list",
        success: function(myjson) { 
            callback( myjson )
        }
    });
}

function refreshRecordingsList( jsonRecordingsList ) {
    divRecordingsList.innerHTML = ""
    ul = createRecordingsList(jsonRecordingsList)
    divRecordingsList.appendChild(ul)
}

function createRecordingsList(jsonlist) {
    var ul = document.createElement('ul');
    $.each(jsonlist, function(i, field){
        var li = document.createElement('li');
        var a  = document.createElement('a');
        a.href="#audio-playback"
        a.id="https://orbhub.bootladder.com:9002/audiomessagedownload/"
                  + field;
        a.innerHTML = field;
        a.onclick=playbackRecordedMessage;

        var deleteButton = document.createElement('button')
        deleteButton.innerHTML = "delete"
        deleteButton.onclick = deleteRecordedMessage
        deleteButton.id="https://orbhub.bootladder.com:9002/audiomessagedownload/"
                  + field;
        li.appendChild(a)
        li.appendChild(deleteButton)

        ul.appendChild(li)
    });
    return ul
}
    

function playbackRecordedMessage() {
    console.log("loading3")
    var audio = document.getElementById('audio-playback') || new Audio();
    audio.src= this.id;
    audio.load()
}

function deleteRecordedMessage() {
    $.ajax({
        //dataType: "json",
        url: "https://orbhub.bootladder.com:9002/audiomessageapi/delete",
        success: function(myjson) { 
            alert( myjson )
        }
    });
}
