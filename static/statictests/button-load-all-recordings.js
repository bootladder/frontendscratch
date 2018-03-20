
var btnLoadRecordings = document.getElementById('btn-load-recordings');

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
