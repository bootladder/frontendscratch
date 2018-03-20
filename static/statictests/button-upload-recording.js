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

    // Create JSON messagedesc from DOM
    var messagedesc  = create_messagedesc(fileName,timestamp)

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

function create_messagedesc(fileName,timestamp) {
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
    blah.timestamp = timestamp
    blah.audioblobid = fileName
    console.log(JSON.stringify(blah))
    return  JSON.stringify(blah)
}
