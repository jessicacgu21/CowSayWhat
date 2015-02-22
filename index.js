var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var exec = require('child_process').exec;
var colors = require('colors');
var cowfiles = ["bong", "charizardvice", "daemon", "default", "dragon-and-cow", "dragon", "elephant", "eyes", "flaming-sheep", "ghostbusters", "kitty", "meow", "milk", "moofasa", "moose", "stegosaurus", "turkey", "turtle"];
var users = {}

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/style.css', function(req, res){
  res.sendFile(__dirname + '/style.css');
});

io.on('connection', function(socket){
  socket.on("new user", function(msg) {
    socket.username = msg;
    users[msg] = cowfiles[1];
  });

  socket.on('re message', function(msg) {
    var index = Math.random() * 1000;
    users[msg] = cowfiles[Math.round(index % 19)];
  });

  socket.on('chat message', function(msg){
    var file = users[socket.username];
    var orig = 'echo ' + msg.body + ' | cowsay -f ' + file + ' | lolcat';
    var rev = 'echo ' + msg.body.split("").reverse().join("") + " | cowsay -f " + file + " | ./revawk | tr '/\\' '\\/'";
    var childo = exec(orig, function (error, stdout, stderr) {
      socket.emit('chat message', {body: stdout, user: msg.user}); 
    });
    var childr = exec(rev, function (error, stdout, stderr) {
      socket.broadcast.emit('chat message', {body: stdout, user: msg.user}); 
    });
  });
});
var port = parseInt(process.env.port) || 3000
http.listen(port, function(){
  console.log('listening on *:', port);
});
