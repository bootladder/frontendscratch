
var btnTestQuery = document.getElementById('btn-test-query');

btnTestQuery.onclick = function() {

    //create a JSON string
    var blah = {}
    blah.sender       = 7 
    blah.destination  = 7 
    blah.topic        = 7 
    blah.timestamp    = 7 
    blah.audioblobid  = 7 
    req = JSON.stringify(blah)
    console.log(req)

    // Create Form with recorded blob and JSON messagedesc
		var formData = new FormData();
		formData.append('requestmodel', req);

		console.log("Uploading...");
		$.ajax({
				url: 'https://orbhub.bootladder.com:9002/audiomessageapi/query', 
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
}
