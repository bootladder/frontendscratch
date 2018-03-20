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
    a.sender      = "aaron"
    a.destination = "steve"
    app_ajax('query', createMessageList, a)
}

// Creates DOM element which can go inside a div tag
// Takes an object with an array of message descriptors
function createMessageList(obj) {
    
    d = document.createElement('div')
    ul = document.createElement('ul')

    console.log(obj)
    parsedobj = JSON.parse(obj)
    $.each(parsedobj, function(i, field){
        var li = document.createElement('li');
        m = createMessageListEntryFromMessageDesc(field)
        li.appendChild(m)
        ul.appendChild(li)
    });

    d.appendChild(ul)

    divMessagesListSteve.innerHTML = ""
    divMessagesListSteve.appendChild(d) 
}

function createMessageListEntryFromMessageDesc(md) {

    var d = document.createElement('div')
    var playbutton = document.createElement('button')
    playbutton.innerHTML = md.topic
    if( md.customtopic ) {
        playbutton.innerHTML = md.customtopic
    }
    playbutton.setAttribute("style", "background-color: blue;font-size : 32px;"); 
    playbutton.id="https://orbhub.bootladder.com:9002/audiomessagedownload/" + md.audioblobid

    playbutton.onclick = playbackRecordedMessage


    var erasebutton  = document.createElement('button')
    erasebutton.innerHTML = "Del"
    erasebutton.setAttribute("style", "background-color: red;");  
    erasebutton.onclick = deleteRecordedMessage
    erasebutton.id = md.audioblobid

    d.appendChild(playbutton)
    d.appendChild(erasebutton)
    return d
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
    s.audioblobid = this.id
		formData.append('filename', JSON.stringify(s));
	//	formData.append('filename', this.id)
    console.log("deleteing: " + JSON.stringify(s))

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
