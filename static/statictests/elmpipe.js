audioserverurl = "http://localhost:9002";
//Uses jQuery
console.log("elmpipe.js being loaded");

function getMessages() {

    var a = {};
    a.sender      = "steve";
    a.destination = "aaron";
    app_ajax('query', function(res) {
        updateMessageList(res);
    },a);
}

function updateMessageList(obj) {

    //send port
    app.ports.selectedIndex.send(obj)
}

getMessages();
