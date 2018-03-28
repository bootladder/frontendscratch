
// This is the generic AJAX call.
// Param:  the API endpoint name (last part of the URL)
// Param:  callback function
// Param:  a obj, converted to string 
//          which will go into the POST form
function app_ajax(endpoint, callback, reqobj) {

    var forminput = JSON.stringify(reqobj)

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
        alert( "Triggered AJAX fail callback: " + jqXHR.responseText );  
     }); 
}


function app_ajax_with_file(endpoint, callback, reqobj, reqfile) {

    var forminput = JSON.stringify(reqobj)

    // Create Form with recorded blob and JSON messagedesc
		var formData = new FormData();
		formData.append('requestmodel', forminput);
		formData.append('file', reqfile);

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
						alert(xhr.responseText);
				}
		}).fail(function( jqXHR, textStatus, msg ) {  
        console.log( "Triggered AJAX fail callback: " + jqXHR.responseText);  
     }); 
}


function generic_ajax_success_callback(response) { 
        var s = "AJAX success!  Response: " + response
        console.log(s)
}

//////////////////////////////////////////////////////////////////
//This is the shim for portability across clientside and NodeJS

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    var $ = require('jquery')
    module.exports = {
        app_ajax: app_ajax,
        app_ajax_with_file: app_ajax_with_file
    }
  }
  else {
    window.app_ajax = app_ajax;
    window.app_ajax_with_file=app_ajax_with_file
  }
