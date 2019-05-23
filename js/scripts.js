//Save request:
function save() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '#');
    xhr.send('command=save\\&save=' + document.getElementById('content').innerHTML);
}

//New data request:
function refresh(command) {
    var xhr = new XMLHttpRequest();

    var params = 'command='+command;

    xhr.open('POST', '#', true);

    xhr.setRequestHeader("Content-type", "application/json");

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText !== '') {
            document.getElementById('content').innerHTML = xhr.responseText;
        }
    }

    xhr.send(params);
}
