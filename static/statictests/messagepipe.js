audioserverurl = "http://localhost:9002"
//Uses jQuery
console.log("messagepipe.js being loaded")


//These still need to be global.....
var messageDescriptors
var audio
var audioPlayback


//////////////////////////////
// Get handles on the DOM elements
// Assign onclick handlers to the buttons

function messagepipe_init(divContainer,mynameparam,yournameparam) {

    // Ahh, we can use these as function scope,
    // Which kind of makes them like object members
    var btnLoadA  // Load messages for Person A from B
    var btnLoadB  // B from A

    var divListA // List of messages for Person A from B
    var divListB // B from A

    var hNameA  //Show the names of the people
    var hNameB


    //Save the name params in function scope
    var myname = mynameparam
    var yourname = yournameparam


    console.log("my name is" + myname + "your name is" + yourname)

    messageDescriptors = new Array()

    audio = document.querySelector('audio');
    audioPlayback = document.getElementById('audio-playback');

    //Get handles on the Template
    btnLoadA = document.getElementById('button-load-messages-a-b')    
    btnLoadB = document.getElementById('button-load-messages-b-a')
    divListA = document.getElementById('div-messages-a-b')    
    divListB = document.getElementById('div-messages-b-a')    
    hNameA   = document.getElementById('NameA')    
    hNameB   = document.getElementById('NameB')    

    //Change their IDs
    btnLoadA.id = 'button-load-messages-'+yourname+'-'+myname
    btnLoadB.id = 'button-load-messages-'+myname+'-'+yourname
    divListA.id = 'div-messages-'+yourname+'-'+myname
    divListB.id = 'div-messages-'+myname+'-'+yourname

    //Change the Names
    hNameA.innerHTML = myname
    hNameB.innerHTML = yourname

    var LoadPipe = function() {

        var a = {}
        a.sender      = yourname
        a.destination = myname
        fetchAndUpdateMessageList(a, divListA)

        a.sender      = myname
        a.destination = yourname
        fetchAndUpdateMessageList(a, divListB)
    }

    // Load the Pipe immediately.
    // Where should this be?  Not readable
//    LoadPipe()

    btnLoadA.onclick = function() {
        LoadPipe()
    }
    btnLoadB.onclick = function() {
        LoadPipe()
    }

    function fetchAndUpdateMessageList(fetchParam, divParam) {

        app_ajax('query', function(res) {
            updateMessageList(res,divParam)
        },
        fetchParam)
    }

    function updateMessageList(obj,mydiv) {

        d = createMessageList(obj)
        mydiv.innerHTML = ""
        mydiv.appendChild(d) 
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
        replybutton.messagedesc = md

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

        window.location.href='#div-audio-message-metadata-select'
        console.log(this.messagedesc)
        audiomessagemetadataselect_settomessagedescriptor(this.messagedesc)
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
        audio.src= audioserverurl+"/audiomessagedownload/" + this.id;
        audio.load()

        if( messageDescriptors[this.id].listenedto == false ) {
            console.log("Updating ListenedTo State to Server!")
            updateMessageDescriptorListenedToState(this.id,true) 

            LoadPipe()
        }

        window.location.href='#divAudioPlayback'

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
            LoadPipe()
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
}
