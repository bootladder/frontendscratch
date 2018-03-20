var divMessageDescList = document.getElementById('div-messagedesc-list');
var divMessageDescListAliceBob = 
                document.getElementById('div-messagedesc-list-alice-bob');

var btnLoadMessageDesc = document.getElementById('btn-load-messagedesc');
var btnLoadMessageDescAliceBob = 
                document.getElementById('btn-load-messagedesc-alice-bob');

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
          //a = createAnchorTagFromMessageDesc(field)
          entry = createListEntryFromMessageDesc(field)
          li.appendChild(entry)
          alice2bob.push(li)
        }
        if( field.sender == "bob" && field.destination == "alice") {
          console.log("BOB to ALICE!!!")
          var li = document.createElement('li');
          entry = createListEntryFromMessageDesc(field)
          li.appendChild(entry)
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

function createListEntryFromMessageDesc(messagedesc) {
        var d  = document.createElement('div');
        var playbutton = document.createElement('button')
        playbutton.innerHTML = "- A -"
        playbutton.setAttribute("style", "font-size : 28px;"); 
        var erasebutton  = document.createElement('button')
        erasebutton.innerHTML = "Delete"
        erasebutton.setAttribute("style", "background-color: red;"); 

        d.appendChild(playbutton)
        d.appendChild(erasebutton)

        return d
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

