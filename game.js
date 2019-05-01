var socket = io();

var movement = {
	up: false,
	down: false,
	left: false,
	right: false
}

document.addEventListener('keydown', function(event) {
	switch (event.keyCode) {
		case 65: // A
			movement.left = true;
			break;
		case 87: // W
			movement.up = true;
			break;
		case 68: // D
			movement.right = true;
			break;
		case 83: // S
			movement.down = true;
			break;
	}
});
document.addEventListener('keyup', function(event) {
	switch (event.keyCode) {
		case 65: // A
			movement.left = false;
			break;
		case 87: // W
			movement.up = false;
			break;
		case 68: // D
			movement.right = false;
			break;
		case 83: // S
			movement.down = false;
			break;
	}
});

socket.emit('new player');
setInterval(function() {
	socket.emit('movement', movement);
}, 1000 / 60);

var canvas = document.getElementById('canvas');
var textOnlinePlayers = document.getElementById("text_online_players");
var textPlayersScore = document.getElementById("text_players_score");
canvas.width = 800;
canvas.height = 600;
var context = canvas.getContext('2d');
socket.on('state', function(state) {
	context.clearRect(0, 0, 800, 600);

	textOnlinePlayers.innerHTML = "Players Online: " + state.nb_players;
	textPlayersScore.innerHTML = state.scores;
	for (var id in state.players) {
		var player = state.players[id];
		switch (player.color) {
			case 0:
				context.fillStyle = 'red';
				break;
			case 1:
				context.fillStyle = 'green';
				break;
			case 2:
				context.fillStyle = 'blue';
				break;
			case 3:
				context.fillStyle = 'cyan';
				break;
			case 4:
				context.fillStyle = 'pink';
				break;
			case 5:
				context.fillStyle = 'purple';
				break;
			case 6:
				context.fillStyle = 'brown';
				break;
		}
		context.beginPath();
		context.arc(player.x, player.y, 10, 0, 2 * Math.PI);
		context.fill();
	}
	context.fillStyle = 'yellow';
	context.beginPath();
	context.arc(state.item.x, state.item.y, 5, 0, 2 * Math.PI);
	context.fill();
});
