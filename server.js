const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const rateLimit = require("express-rate-limit");
var helmet = require('helmet');

const PORT = process.env.PORT || 3000;

//CREATE EXPRESS APP
var app = express();
var server = http.Server(app);
var io = socketIO(server);
app.use(helmet());
app.use(express.static(__dirname + '/'));

app.enable("trust proxy"); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)

const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minutes
	max: 10 // limit each IP to 10 requests per windowMs
});

//  apply to all requests
app.use(limiter);

//ROUTES WILL GO HERE
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

server.listen(PORT, () => console.log('Server started on port ' + PORT));

//WEB SOCKETS
var state = {
	players: {},
	id_players: 0,
	item: {
		x: Math.floor(Math.random() * 400) + 200,
		y: Math.floor(Math.random() * 400) + 100
	},
	enemies: {}
};

io.on('connection', function(socket) {
	socket.on('new player', function(personal_id, color) {
		console.log('client connected ' + socket.id);
		state.id_players++;
		state.players[socket.id] = {
			id: personal_id,
			nb: state.id_players,
			x: Math.floor(Math.random() * 400) + 200,
			y: Math.floor(Math.random() * 400) + 100,
			color: color,
			score: 0
		};
	});
	socket.on('movement', function(data) {
		var player = state.players[socket.id] || {};
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
		//BORD
		if (player.x < 0)
			player.x = 0;
		else if (player.x > 800)
			player.x = 800;
		if (player.y < 0)
			player.y = 0;
		else if (player.y > 600)
			player.y = 600;

		if (player.x >= state.item.x - 20 && player.x <= state.item.x + 20) {
			if (player.y >= state.item.y - 20 && player.y <= state.item.y + 20) {
				player.score++;
				state.item.x = Math.floor(Math.random() * 400) + 200;
				state.item.y = Math.floor(Math.random() * 400) + 100;
			}
		}
		for (var id in state.enemies) {
			var enemy = state.enemies[id];
			if (enemy) {
				if (player.x >= enemy.x - 20 && player.x <= enemy.x + 20) {
					if (player.y >= enemy.y - 20 && player.y <= enemy.y + 20) {
						player.score--;
						enemy.x = 0;
						enemy.y = Math.floor(Math.random() * 600);
					}
				}
			}
		}
	});
	socket.on('disconnect', function () {
		if (state.players[socket.id]) {
			console.log('client disconnected ' + socket.id);
			state.players[socket.id] = null;
		}
	});
});

state.enemies[0] = { x: 0, y: Math.floor(Math.random() * 600), directionX: 1, directionY: 1 };
state.enemies[1] = { x: 0, y: Math.floor(Math.random() * 600), directionX: 1, directionY: -1 };
state.enemies[2] = { x: 800, y: Math.floor(Math.random() * 600), directionX: -1, directionY: 1 };
state.enemies[3] = { x: 800, y: Math.floor(Math.random() * 600), directionX: -1, directionY: -1 };
state.enemies[4] = { x: Math.floor(Math.random() * 800), y: 0, directionX: 1, directionY: 1 };
state.enemies[5] = { x: Math.floor(Math.random() * 800), y: 0, directionX: -1, directionY: 1 };
state.enemies[6] = { x: Math.floor(Math.random() * 800), y: 600, directionX: 1, directionY: -1 };
state.enemies[7] = { x: Math.floor(Math.random() * 800), y: 600, directionX: -1, directionY: -1 };
state.enemies[8] = { x: 0, y: Math.floor(Math.random() * 600), directionX: 1, directionY: 1 };
state.enemies[9] = { x: 0, y: Math.floor(Math.random() * 600), directionX: 1, directionY: -1 };
state.enemies[10] = { x: 800, y: Math.floor(Math.random() * 600), directionX: -1, directionY: 1 };
state.enemies[11] = { x: 800, y: Math.floor(Math.random() * 600), directionX: -1, directionY: -1 };
state.enemies[12] = { x: Math.floor(Math.random() * 800), y: 0, directionX: 1, directionY: 1 };
state.enemies[13] = { x: Math.floor(Math.random() * 800), y: 0, directionX: -1, directionY: 1 };
state.enemies[14] = { x: Math.floor(Math.random() * 800), y: 600, directionX: 1, directionY: -1 };
state.enemies[15] = { x: Math.floor(Math.random() * 800), y: 600, directionX: -1, directionY: -1 };

function move_enemies() {
	for (var id in state.enemies) {
		var enemy = state.enemies[id];
		if (enemy) {
			enemy.x += enemy.directionX * 3;
			enemy.y += enemy.directionY * 3;
			if (enemy.x > 800)
				enemy.directionX = -enemy.directionX;
			else if (enemy.x < 0)
				enemy.directionX = -enemy.directionX;
			if (enemy.y > 600)
				enemy.directionY = -enemy.directionY;
			else if (enemy.y < 0)
				enemy.directionY = -enemy.directionY;
		}
	}
}

setInterval(function() {
	io.sockets.emit('state', state);
}, 1000 / 60);
setInterval(function() {
	move_enemies();
}, 1000 / 30);
