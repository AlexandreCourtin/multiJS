const express = require('express');
const http = require('http');
//const path = require('path');
const socketIO = require('socket.io');
const PORT = process.env.PORT || 3000;

//CREATE EXPRESS APP
var app = express();
var server = http.Server(app);
var io = socketIO(server);
app.use(express.static(__dirname + '/'));
app.set('view engine', 'ejs');

//ROUTES WILL GO HERE
app.get('/', function(req, res) {
	res.render(__dirname + '/index', {nb_players: nb_players});
});

server.listen(PORT, () => console.log('Server started on port ' + PORT));

//WEB SOCKETS

var players = {};
var nb_players = 0;
io.on('connection', function(socket) {
	socket.on('new player', function() {
		console.log('client connected');
		nb_players++;
		players[socket.id] = {
			x: 300,
			y: 300,
			color: Math.floor(Math.random() * 3)
		};
	});
	socket.on('movement', function(data) {
		var player = players[socket.id] || {};
		if (data.left) {
			player.x -= 5;
		}
		if (data.up) {
			player.y -= 5;
		}
		if (data.right) {
			player.x += 5;
		}
		if (data.down) {
			player.y += 5;
		}
	});
	socket.on('disconnect', function () {
		console.log('client disconnected');
		nb_players--;
		players[socket.id] = 0;
	});
});

setInterval(function() {
	io.sockets.emit('state', players);
}, 1000 / 60);

setInterval(function() {
	console.log('numbers of players = ' + nb_players);
}, 1000);
