//First Load the Javascript
//Then, fetch initial state from Server

$(document).ready( function() {
    dynamicallyLoadScript("https://cdn.webrtc-experiment.com/RecordRTC.js");
    dynamicallyLoadScript("https://webrtc.github.io/adapter/adapter-latest.js");
    dynamicallyLoadScript("webrtc-helpers.js");
    dynamicallyLoadScript("buttons.js");
    dynamicallyLoadScript("button-startrecording.js");
    dynamicallyLoadScript("button-stoprecording.js");
    dynamicallyLoadScript("button-upload-recording.js");
    dynamicallyLoadScript("ajax.js");
    dynamicallyLoadScript("button-test.js");

    $("#testmessagepipe")
    .load("messagepipe.html", function(z,statustext,z) {
        if( statustext === "error" )
          console.log("Error loading messagepipe.html")

        console.log("Loaded the MessagePipe HTML.  Loading the Pipe")
        messagepipe( 'testmessagepipe', 'steve', 'testdummy' )
    });

})


function dynamicallyLoadScript(url) {
    var script = document.createElement("script"); // Make a script DOM node
    script.src = url; // Set it's src to the provided URL

    document.body.appendChild(script); 
		console.log("Loaded Script, src="+url);
}
