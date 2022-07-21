var button = document.getElementById('enter');
var input = document.getElementById('user-input');
var ul = document.querySelector('ul');
var items = ul.getElementsByTagName('li');
exports = function (n) { return n * 111 };


function inputLength() {
  return input.value.length;
}

function createListElement() {
  if (items.length > 0) {
    ul.innerHTML = '';
  };
  request.post(authOptions, function(error, response, body) {
  if (!error && response.statusCode === 200) {

    // use the access token to access the Spotify Web API
    var token = body.access_token;
    var options = {
      url: 'https://api.spotify.com/v1/search?q='+encodeURIComponent(input.value.trim())+'&type=track&include_external=audio',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      json: true
    };
    request.get(options, function(error, response, body) {
      console.log(body.tracks.items);
      let resultz = body.tracks.items;
      for (var i = 0; i < resultz.length; i++) {
        let resultObj = {id: resultz[i].id, name: resultz[i].name, artist: resultz[i].artists[0].name};
        console.log(resultObj);
        var li = document.createElement('li'); //create element and specify tag
        li.setAttribute('id', resultObj.id);
        li.appendChild(document.createTextNode(JSON.stringify(resultObj)));
        ul.appendChild(li); //to attach to unordered list
        playButton(li);
      };
    });
  }
});
}

function playback(event) {
  console.log(event.target.parentElement.id);
  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      // use the access token to access the Spotify Web API
      var token = body.access_token;
      var options = {
        url: 'https://api.spotify.com/v1/me/player/play',
        headers: {
          'Authorization': 'Bearer ' + token,
          //'Content-Type': 'application/json'
        },
        json: true
      };
      var payload = {
        'uris': ['spotify:track:' + event.target.parentElement.id],
        'offset': {
          'position': 5
        },
        'position_ms': 0
      };
      payloadJSON = JSON.stringify(payload);
      request.put(options, payloadJSON, function(error, response, body) {
        console.log(body);
        var li = document.createElement('li'); //create element and specify tag
        var liOg = document.getElementById(event.target.parentElement.id);
        ul.innerHTML = '';
        ul.appendChild(liOg);
        li.appendChild(document.createTextNode(JSON.stringify(body)));
        ul.appendChild(li);
      });
    }
  });
}

//used to add play buttons to existing list and new items
function playButton(li) {
  var btn = document.createElement('button');
  btn.appendChild(document.createTextNode('Play'));
  li.appendChild(btn);
  btn.onclick = playback;
}

function addListAfterClick() {
  if (inputLength() > 0) {
    createListElement();
  }
}

function addListAfterEnter(event) {
  if (inputLength() > 0 && event.keyCode === 13) {
    createListElement();
  }
}

button.addEventListener('click', addListAfterClick);
input.addEventListener('keypress', addListAfterEnter);

var request = require('request'); // 'Request' library

var client_id = '48d34c425f6247b8be9dc638ce0bbbe7'; // Your client id
var client_secret = 'ab61982bd6f5449bb78419b8d3b4d6b2'; // Your secret

// your application requests authorization
var authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
  },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
};