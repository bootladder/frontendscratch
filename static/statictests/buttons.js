//Uses jQuery

var audio = document.querySelector('audio');
var audioPlayback = document.getElementById('audio-playback');

var btnLoadRecordingsSteve = document.getElementById('btn-load-steve')    
var btnLoadRecordingsAaron = document.getElementById('btn-load-aaron')    

var divMessagesListSteve = document.getElementById('div-messages-steve')    

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
// AJAX Request to Server
// Callback is called on success
btnLoadRecordingsSteve.onclick = function() {

    var a = {}
    a.sender = "alice"
    a.destination = "bob"
    a.b = "hello"

    app_ajax('query', createMessageList, a)
}

// Creates DOM element which can go inside a div tag
// Takes an object with an array of message descriptors
function createMessageList(obj) {
    d = document.createElement('div')
    d.innerHTML = "hello"

    divMessagesListSteve.innerHTML = "yarrr"
    divMessagesListSteve.appendChild(d) 
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
