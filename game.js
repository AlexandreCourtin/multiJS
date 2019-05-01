var socket = io();
var connected = false;
var nb_players = 0;

var movement = {
	up: false,
	down: false,
	left: false,
	right: false
}

var personal_id = Math.random() * 999999;

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
		case 37: // LEFT
			movement.left = true;
			break;
		case 38: // UP
			movement.up = true;
			break;
		case 39: // RIGHT
			movement.right = true;
			break;
		case 40: // DOWN
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
		case 37: // LEFT
			movement.left = false;
			break;
		case 38: // UP
			movement.up = false;
			break;
		case 39: // RIGHT
			movement.right = false;
			break;
		case 40: // DOWN
			movement.down = false;
			break;
	}
});

var canvas = document.getElementById('canvas');
var textOnlinePlayers = document.getElementById("text_online_players");
var textPlayersScore = document.getElementById("text_players_score");
canvas.width = 800;
canvas.height = 600;
var context = canvas.getContext('2d');

socket.on('state', function(state) {
	if (connected) {
		context.clearRect(0, 0, 800, 600);
		textOnlinePlayers.innerHTML = "Players Online: " + nb_players;
		textPlayersScore.innerHTML = "";

		nb_players = 0;
		for (var id in state.players) {
			var player = state.players[id];
			if (player) {
				nb_players += 1;
				if (player.id == personal_id)
					textPlayersScore.innerHTML += "(you) ";
				textPlayersScore.innerHTML += "Player " + player.nb + " score: " + player.score + "<br>";
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
		}
		context.fillStyle = 'yellow';
		context.beginPath();
		context.arc(state.item.x, state.item.y, 5, 0, 2 * Math.PI);
		context.fill();
	}
});
