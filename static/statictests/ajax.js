
// This is the generic AJAX call.
// Param:  the API endpoint name (last part of the URL)
// Param:  callback function
// Param:  a obj, converted to string 
//          which will go into the POST form
function app_ajax(endpoint, callback, reqobj) {

    forminput = JSON.stringify(reqobj)

    // Create Form with recorded blob and JSON messagedesc
		var formData = new FormData();
		formData.append('requestmodel', forminput);

		console.log("AJAXing...");
		$.ajax({
				url: 'https://orbhub.bootladder.com:9002/audiomessageapi/'+endpoint, 
				data: formData,
				cache: false,
				contentType: false,
				processData: false,
				type: 'POST',
				datatype: 'json',
				success: function(response) {
            console.log("AJAXing... Success!");
            callback(response)
				},
				error: function(xhr, status, error) {
						console.log(xhr.responseText);
						console.log(status);
						console.log(error);
				}
		}).fail(function( jqXHR, textStatus ) {  
        alert( "Triggered AJAX fail callback: " + textStatus );  
     }); 
}
