//Uses jQuery
console.log("hello");

var btnProcessRecording = document.getElementById('btn-process-recording');
var btnLoadRecordings = document.getElementById('btn-load-recordings');
var btnLoadMessageDesc = document.getElementById('btn-load-messagedesc');
var btnLoadMessageDescAliceBob = 
                document.getElementById('btn-load-messagedesc-alice-bob');

var audio = document.querySelector('audio');
var audioPlayback = document.getElementById('audio-playback');
var divRecordingsList = document.getElementById('div-recordings-list');
var divMessageDescList = document.getElementById('div-messagedesc-list');
var divMessageDescListAliceBob = 
                document.getElementById('div-messagedesc-list-alice-bob');


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
				cache: false,
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
        deleteButton.id = field;
        li.appendChild(a)
        li.appendChild(deleteButton)

        ul.appendChild(li)
    });
    return ul
}
    

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
function playbackRecordedMessage() {
    console.log("loading3")
    var audio = document.getElementById('audio-playback') || new Audio();
    audio.src= this.id;
    audio.load()
}
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////

function deleteRecordedMessage() {

    // Create Form with JSON filename
		var formData = new FormData();
    var s = {}
    s.filename = this.id
		//formData.append('filename', JSON.stringify(s));
		formData.append('filename', this.id)
    console.log(s)

    $.ajax({
        //dataType: "json",
				type: 'POST',
				cache: false,
				data: formData,
				processData: false,  //stupid necessary thing
				contentType: false,  //also necessary
        url: "https://orbhub.bootladder.com:9002/audiomessageapi/delete",
        success: function(myjson) { 
            s = "Deleted Message." + myjson
            alert( s )
        }
    });
}

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////

btnLoadMessageDesc.onclick = function() {
    console.log("loading message descs")

    fetchMessageDescList( refreshMessageDesc ) //is a callback
}

function fetchMessageDescList( callback ) {
    $.ajax({
        dataType: "json",
        url: "https://orbhub.bootladder.com:9002/audiomessageapi/list_messagedesc",
				cache: false,
        success: function(myjson) { 
            callback( myjson )
        }
    });
}

function refreshMessageDesc( jsonRecordingsList ) {
    console.log(jsonRecordingsList)
    divMessageDescList.innerHTML = ""
    ul = createMessagedescList(jsonRecordingsList)
    divMessageDescList.appendChild(ul)
}

function createMessagedescList(jsonlist) {
console.log(jsonlist)
    var ul = document.createElement('ul');
    $.each(jsonlist, function(i, field){
        console.log(field)
        console.log("field is: " +JSON.stringify(field))
        var li = document.createElement('li');
        li.innerHTML = JSON.stringify(field)
        ul.appendChild(li)
    });
    return ul
}
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////

btnLoadMessageDescAliceBob.onclick = function() {
    console.log("loading Alice Bob message descs")

    fetchMessageDescList( refreshMessageDescAliceBob ) //is a callback
}

function refreshMessageDescAliceBob( jsonRecordingsList ) {
    console.log(jsonRecordingsList)
    divMessageDescListAliceBob.innerHTML = ""
    ul = createMessagedescListAliceBob(jsonRecordingsList)
    divMessageDescListAliceBob.appendChild(ul)
}

function createMessagedescListAliceBob(jsonlist) {
console.log(jsonlist)
    var ul = document.createElement('ul');
    var alice2bob = []
    var bob2alice = []

    $.each(jsonlist, function(i, field){
        console.log(field)
        console.log("field is: " +JSON.stringify(field))

        if( field.sender == "alice" && field.destination == "bob") {
          console.log("ALICE TO BOB!!!")
          var li = document.createElement('li');
          a = createAnchorTagFromMessageDesc(field)
          li.appendChild(a)
          alice2bob.push(li)
        }
        if( field.sender == "bob" && field.destination == "alice") {
          console.log("BOB to ALICE!!!")
          var li = document.createElement('li');
          a = createAnchorTagFromMessageDesc(field)
          li.appendChild(a)
          bob2alice.push(li)
        }
    });
    
    $.each(alice2bob, function(i,field) {
        ul.appendChild(field)
    });
    $.each(bob2alice, function(i,field) {
        ul.appendChild(field)
    });
    return ul
}

function createAnchorTagFromMessageDesc(messagedesc) {
        var a  = document.createElement('a');
        a.href="#audio-playback"
        a.id="https://orbhub.bootladder.com:9002/audiomessagedownload/"
                  + messagedesc.audioblobid;
        a.innerHTML = messagedesc.sender + "-" + messagedesc.destination +
                      "-" + messagedesc.timestamp + 
                      "-topic-" + messagedesc.topic
        a.onclick=playbackRecordedMessage;
        return a
}
