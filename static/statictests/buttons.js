//Uses jQuery

var audio = document.querySelector('audio');
var audioPlayback = document.getElementById('audio-playback');

var btnLoadRecordingsSteve = document.getElementById('btn-load-steve')    
var btnLoadRecordingsAaron = document.getElementById('btn-load-aaron')    
var btnLoadRecordingsSteveFromTest = 
                document.getElementById('btn-load-steve-from-test')    
var btnLoadRecordingsTestFromSteve = 
                document.getElementById('btn-load-test-from-steve')    

var divMessagesListSteve = document.getElementById('div-messages-steve')    
var divMessagesListAaron = document.getElementById('div-messages-aaron')    
var divMessagesListSteveFromTest = 
                document.getElementById('div-messages-steve-from-test')    
var divMessagesListTestFromSteve = 
                document.getElementById('div-messages-test-from-steve')    

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
// AJAX Request to Server
// Callback is called on success
btnLoadRecordingsSteve.onclick = function() {

    var a = {}
    a.sender      = "aaron"
    a.destination = "steve"
    app_ajax('query', updateMessageListForSteve, a)
}
btnLoadRecordingsAaron.onclick = function() {

    var a = {}
    a.sender      = "steve"
    a.destination = "aaron"
    app_ajax('query', updateMessageListForAaron, a)
}
/////////////////////////////////
btnLoadRecordingsSteveFromTest.onclick = function() {

    var a = {}
    a.sender      = "testdummy"
    a.destination = "steve"
    app_ajax('query', updateMessageListForSteveFromTest, a)
}
btnLoadRecordingsTestFromSteve.onclick = function() {

    var a = {}
    a.sender      = "steve"
    a.destination = "testdummy"
    app_ajax('query', updateMessageListForTestFromSteve, a)
}
//////////////////////////////////

function updateMessageListForSteve(obj) {

    d = createMessageList(obj)
    divMessagesListSteve.innerHTML = ""
    divMessagesListSteve.appendChild(d) 
}
function updateMessageListForAaron(obj) {

    d = createMessageList(obj)
    divMessagesListAaron.innerHTML = ""
    divMessagesListAaron.appendChild(d) 
}
//////////////////////////////////
function updateMessageListForSteveFromTest(obj) {

    d = createMessageList(obj)
    divMessagesListSteveFromTest.innerHTML = ""
    divMessagesListSteveFromTest.appendChild(d) 
}
function updateMessageListForTestFromSteve(obj) {

    d = createMessageList(obj)
    divMessagesListTestFromSteve.innerHTML = ""
    divMessagesListTestFromSteve.appendChild(d) 
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

    return d
}

function createMessageListEntryFromMessageDesc(md) {

    var d = document.createElement('div')
    var playbutton = document.createElement('button')
    playbutton.innerHTML = md.topic
    if( md.customtopic ) {
        playbutton.innerHTML = md.customtopic
    }
    // Set Color of Button
    if( md.project == "1" ) {
      playbutton.setAttribute("style", "background-color: blue;font-size : 32px;"); 
    }
    else if( md.project == "2" ) {
      playbutton.setAttribute("style", "background-color: orange;font-size : 32px;"); 
    }
    else if( md.project == "3" ) {
      playbutton.setAttribute("style", "background-color: green;font-size : 32px;"); 
    }
    else {
      playbutton.setAttribute("style", "background-color: gray;font-size : 32px;"); 
    }
    playbutton.id="https://orbhub.bootladder.com:9002/audiomessagedownload/" + md.audioblobid

    playbutton.onclick = playbackRecordedMessage

    var replybutton  = document.createElement('button')
    replybutton.innerHTML = "Reply"
    replybutton.setAttribute("style", "background-color: green;");  
    replybutton.onclick = replyRecordedMessage
    replybutton.id = md.audioblobid

    var vaultbutton  = document.createElement('button')
    vaultbutton.innerHTML = "Vault"
    vaultbutton.setAttribute("style", "background-color: orange;");  
    vaultbutton.onclick = vaultRecordedMessage
    vaultbutton.id = md.audioblobid

    var erasebutton  = document.createElement('button')
    erasebutton.innerHTML = "Del"
    erasebutton.setAttribute("style", "background-color: red;");  
    erasebutton.onclick = deleteRecordedMessage
    erasebutton.id = md.audioblobid

    d.appendChild(playbutton)
    d.appendChild(replybutton)
    d.appendChild(vaultbutton)
    d.appendChild(erasebutton)
    return d
}
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////

function replyRecordedMessage() {
}
function vaultRecordedMessage() {
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
		formData.append('requestmodel', JSON.stringify(s));
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
