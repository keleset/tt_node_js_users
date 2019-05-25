//Save request:
function save() {
  let xhr = new XMLHttpRequest();
  let params = '{ "command": "save", "save": '+ document.getElementById('content').innerHTML +' }';
  xhr.open('POST', '#', true);
  xhr.setRequestHeader("Content-type", "application/json");  
  xhr.send(params);
}

//New data request:
function refresh(command) {
  let xhr = new XMLHttpRequest();
  let params = '{ "command": "' + command + '" }';
  xhr.open('POST', '#', true);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText !== '') {
      document.getElementById('content').innerHTML = xhr.responseText;
    }
  }

  xhr.send(params);
}
