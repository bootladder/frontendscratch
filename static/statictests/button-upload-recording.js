// Uses recorder.getBlob

var btnProcessRecording = document.getElementById('btn-process-recording');

btnProcessRecording.onclick = function() {
		
    // Convert recorded blob to File with name
		var blob = recorder.getBlob();
		var timestamp = new Date().valueOf();
		var fileName = "audiomessage_"+timestamp
		var fileObject = new File([blob], fileName, {
				type: 'audio/wav'
		});

    // Create messagedesc object from DOM
    var messagedesc  = create_messagedesc(fileName,timestamp)

    // POST the message descriptor and file
		console.log("Uploading...");
    var uploadcb = function(response) {
        var msg = 'successful upload. heres message: ' + response;
        alert(msg);
    }

    app_ajax_with_file('audiomessageupload', uploadcb, messagedesc, fileObject)
}

function create_messagedesc(fileName,timestamp) {
    var inputSenderVal = 
            document.querySelector('input[name=sender]:checked').value
    var inputDestinationVal = 
            document.querySelector('input[name=destination]:checked').value
    var inputTopicVal = 
            document.querySelector('input[name=topic]:checked').value
    var inputProjectVal = 
            document.querySelector('input[name=project]:checked').value
    var inputCustomTopicVal = 
            document.getElementById("textinput-customtopic").value
 
    var blah = {}
    blah.sender = inputSenderVal
    blah.destination = inputDestinationVal
    blah.topic = inputTopicVal
    blah.project = inputProjectVal
    blah.customtopic = inputCustomTopicVal
    blah.timestamp = timestamp
    blah.audioblobid = fileName
    return  blah
}
