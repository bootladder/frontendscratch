//Uses jQuery
console.log("messagepipe.js being loaded")

// Aww crap... this needs to be in a class so there can be
// multiple instances of these variables
var audio
var audioPlayback

var btnLoadA  // Load messages for Person A from B
var btnLoadB  // B from A

var divListA // List of messages for Person A from B
var divListB // B from A

var messageDescriptors  //All the messages...?


//////////////////////////////
// Get handles on the DOM elements
// Assign onclick handlers to the buttons

function messagepipe_init(divContainer,sender,destination) {
    console.log("assigning button onclick handleres")

    messageDescriptors = new Array()

    audio = document.querySelector('audio');
    audioPlayback = document.getElementById('audio-playback');

    //Get handles on the Template
    btnLoadA = document.getElementById('button-load-messages-a-b')    
    btnLoadB = document.getElementById('button-load-messages-b-a')
    divListA = document.getElementById('div-messages-a-b')    
    divListB = document.getElementById('div-messages-b-a')    

    //Change their IDs
    btnLoadA.id = 'button-load-messages-'+sender+'-'+destination
    btnLoadB.id = 'button-load-messages-'+destination+'-'+sender
    divListA.id = 'div-messages-'+sender+'-'+destination
    divListB.id = 'div-messages-'+destination+'-'+sender

    btnLoadA.onclick = function() {

        var a = {}
        a.sender      = "testdummy"
        a.destination = "steve"
        app_ajax('query', updateMessageListForSteve, a)
    }
    btnLoadB.onclick = function() {

        var a = {}
        a.sender      = "steve"
        a.destination = "testdummy"
        app_ajax('query', updateMessageListForAaron, a)
    }
}


function updateMessageListForSteve(obj) {

    d = createMessageList(obj)
    divListA.innerHTML = ""
    divListA.appendChild(d) 
}
function updateMessageListForAaron(obj) {

    d = createMessageList(obj)
    divListB.innerHTML = ""
    divListB.appendChild(d) 
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

    //Populate Global Array of Message Descriptors
    //Does not belong here!
    $.each(parsedobj, function(i, field){
        messageDescriptors[field.audioblobid] = field
    });

    return d
}

function createMessageListEntryFromMessageDesc(md) {

    var d = document.createElement('div')
    var playbutton = document.createElement('button')

    // Set innerHTML of Button
    playbutton.innerHTML = md.topic
    if( md.customtopic ) {
        playbutton.innerHTML = md.customtopic
    }

    // Set Color of Button
    if( md.project == "1" ) {
      color = "blue"
    }
    else if( md.project == "2" ) {
      color = "orange"
    }
    else if( md.project == "3" ) {
      color = "green"
    }
    else {
      color = "gray"
    }

    // Set Opacity of Button
    if( md.listenedto == false )
        opacity = "1"
    else
        opacity = "0.2"

    playbutton.setAttribute("style", 
      "background-color: "+color+";font-size : 32px; opacity:"+opacity); 

    playbutton.id= md.audioblobid

    playbutton.onclick = listenToRecordedMessage


    // Other Buttons
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

// Load the <audio> with the message
// Also change the state to "listenedTo = true" and update
function listenToRecordedMessage() {
    console.log("loading3")
    var audio = document.getElementById('audio-playback') || new Audio();
    audio.src= "https://orbhub.bootladder.com:9002/audiomessagedownload/" + this.id;
    audio.load()

    if( messageDescriptors[this.id].listenedto == false ) {
        console.log("Updating ListenedTo State to Server!")
        updateMessageDescriptorListenedToState(this.id,true) 
    }
}
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////

function deleteRecordedMessage() {

    // Create Form with JSON filename
    var s = {}
    s.audioblobid = this.id

    var successcb = function(myjson) { 
        s = "Deleted Message." + myjson
        alert( s )
    }

    app_ajax('delete', successcb, s)
}

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////

function updateMessageDescriptorListenedToState(id,state) {

    var s = {}
    s.audioblobid = id
    s.listenedto = state
    
    app_ajax('update', generic_ajax_success_callback , s)
}
