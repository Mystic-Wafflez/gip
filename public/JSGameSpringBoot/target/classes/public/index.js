// made using HTML Canvas API, STOMP API, SockJS
// TODO: pretty titlescreen, DB connection, netcode (springboot websocket), player lives(?)
// DONE: player, full 360 movement, shooting, shot culling, targets, hitreg, 2nd player, springboot server

// NOTE: circular hitreg uses Pythagorean theorem (maybe i DO have a use for it in life after all?)
// basic canvas setup
const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d') 

// sets up canvas size, scalable
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// game start button
document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('startButton');
	const startConnection = document.getElementById('startConnection')
    startButton.addEventListener('click', function() {
        startGame();
        var startupSFX = new Audio("startupSFX.wav")
		startupSFX.play()
    });
	startConnection.addEventListener('click', function() {
		connectSocket();
	})
});
// starts game loop
function startGame() {
	gameStarted = true
	animation();
	console.log('Holotape Started!')	
	const startButton = document.getElementById('startButton')
	startButton.style.display = 'none'
	const buttonDiv = document.getElementById('buttonDiv')
	buttonDiv.style.display = 'none'
}
document.addEventListener('keydown', playAudio)

function playAudio() {
	const startupAudio = document.querySelector("audio")
	startupAudio.volume = 0.2 
	startupAudio.play()
	if (startupAudio.paused) {
		audio.play()
	}
}

// player class + constructor
class Player {
	constructor({position, velocity,shieldRadius}) {
		this.position = position; // uses {x,y}
		this.velocity = velocity; // same deal
		this.rotation = 0 // starting value
		this.targetHits = 0
		this.shieldRadius = shieldRadius
	}
	draw(){
		// player image variables
		const playerHeight = 100;
		const playerWidth = 100;
		// loading image
		const playerImg = new Image()
		playerImg.src = "./char.png"
		// 'save' basically creates a savestate
		// 'rotate' will try to rotate the entire canvas, so to rotate the player you need to change canvas' location to be on the player's center.
		// this can be done by using 'translate', while referencing the player's x & y positions on the canvas.
		// using 'save' & 'restore', the rotation code will only be called for whatever's within those two.
		context.save();
		context.translate(this.position.x + playerWidth / 2, this.position.y + playerHeight / 2);
		context.rotate(this.rotation);
		context.drawImage(playerImg, -playerWidth / 2, -playerHeight / 2, playerWidth, playerHeight);
		context.restore();
		
		// WIP shield drawing
		//context.strokeStyle = '#39FF14'
		//context.beginPath()
		//const shieldRadius = 48
		//context.arc(this.position.x + playerWidth / 2, this.position.y + playerHeight / 2,shieldRadius,0,Math.PI*2,false)
		//context.closePath()
		//context.stroke()
	}
	// calls draw, updates position based on velocity
	update() {
		this.draw()
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y
	}
}

class Shot {
	constructor ({position,velocity}) {
		this.position = position
		this.velocity = velocity
		this.radius = 5
		this.tickTimer = 60 // idea: cull shots when 60 ticks have passed
	}
	draw(){
		context.beginPath()
		context.arc(this.position.x,this.position.y,this.radius,0,Math.PI*2,false)
		context.closePath()
		context.fillStyle = '#39FF14'
		context.fill()
	}
	update(){
		this.draw()
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y
	}
}
class Target {
	constructor({position,velocity, radius}) {
		this.position = position
		this.velocity = velocity
		this.radius = radius
		this.tickTimer = 2400 // longer lifetime bc you dont want your targets to randomly disappear while they're still onscreen
	}
	draw(){
		context.fillStyle = '#061902'
		context.strokeStyle = '#39FF14'
		context.beginPath()
		context.arc(this.position.x,this.position.y,this.radius,0,Math.PI*2,false)
		context.fill()
		context.stroke()
		context.lineWidth = '2'
		context.closePath()
	}
	update(){
		this.draw()
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y
	}
}
// player
const player = new Player({
	position: {x: canvas.width / 2 - 500, y: canvas.height / 2 - 50},
	velocity: {x: 0, y: 0},
})
const player2 = new Player({
	position: {x: canvas.width / 2 + 500, y: canvas.height / 2 - 50},
	velocity: {x: 0, y: 0},
})
player2.rotation = 3.15


const shots = []
const shots2 = []
const targets = []
// functions
// constant variable keeps track of which keys are pressed
const keys = {
	w: {
		pressed: false
	},
	a: {
		pressed: false
	},
	d: {
		pressed: false
	},
	arrowup : {
		pressed: false
	},
	arrowleft: {
		pressed: false
	},
	arrowright: {
		pressed: false
	}
}
// speed values
const PlayerSpeed = 2.5
const PlayerRotation = 0.015

let gameStarted = false

// creates targets every X milliseconds
window.setInterval(() => {
	// only creates targets if the game has actually been started
	if (gameStarted) {
	const index =  Math.floor(Math.random() * 4)
	let x, y
	let radius = 50 * Math.random() + 10
	let velX, velY
	switch (index) {
		case 0:  // left?
		x = 0 - radius
		y = Math.random() * canvas.height
		velX = 1
		velY = 0
		break
	case 1:  // bottom?
		x = Math.random() * canvas.width
		y = canvas.height + radius
		velX = 0
		velY = -1
		break
	case 2:  // right?
		x = canvas.width + radius
		y = Math.random() * canvas.height
		velX = -1 
		velY = 0
		break
	case 3:  // top?
		x = Math.random() * canvas.width
		y = 0 - radius
		velX = 0
		velY = 1
		break
	}

	targets.push(
		new Target({
			position: {
				x: x, 
				y: y
			},
			velocity: {
				x: velX, 
				y: velY
			},
			radius
		})
	)
// determines timer (in ms)
}},3000)

// pythagorean theorem:
function hitReg(circle1, circle2) {
	// get distance between x & y positions of both circles
	const xDiff  = circle2.position.x - circle1.position.x
	const yDiff = circle2.position.y - circle1.position.y
	// Square root of xDiff² + yDiff²
	const distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff)
	// check if touching
	if (distance <= circle1.radius + circle2.radius ){
		console.log('hit')
		var hitSFX = new Audio("hitSFX.wav")
		hitSFX.play()
		return true
		
	}
	return false
}
// calls update, creates animation loop
function animation() {
	
	
	// clear the canvas every frame
	context.clearRect(0,0, canvas.width,canvas.height)
	
	// redraws background every frame
	context.fillStyle = 'black'
	context.fillRect(0, 0, canvas.width, canvas.height)
	// text stuff
	// tells obj FontFace to load the font file, font gets passed as param, of function, gets added to document fonts
	
	// make stuff happen when the player destroys X amount of targets
	context.font = '30px CustomFont'
	if (player.targetHits >= 50) {
    context.fillStyle = 'magenta';
    context.fillText("Savage!", 10, 80);
} else if (player.targetHits >= 25) {
    context.fillStyle = '#FFBF00';
    context.fillText("Stylish!", 10, 80);
}
	 else {
			context.fillStyle = '#39FF14'
	}
	context.fillText("P1 HITS: " + player.targetHits, 10, 50)
	
	
	// player 2 target checks
	if (player2.targetHits >= 50) {
    context.fillStyle = 'magenta';
    context.fillText("Savage!", canvas.width / 2 + 500, 80);
} else if (player2.targetHits >= 25) {
    context.fillStyle = '#FFBF00';
    context.fillText("Stylish!", canvas.width / 2 + 780, 80);
}
	 else {
			context.fillStyle = '#39FF14'
	}
	
	context.fillText("P2 HITS: " + player2.targetHits, canvas.width / 2 + 780, 50)
	// starts loop
	window.requestAnimationFrame(animation)
	player.update()
	player2.update()
	
	// loops backwards through shots array every frame
	for (let i = shots.length - 1; i >= 0; i--) {
		const shot =  shots[i]
		shot.tickTimer -= 1
		shot.update()
		if (shot.tickTimer < 0) {
			shots.splice(i,1)
		} // culls shots after 60 frames
	}
		// player 2 shots array loop
		for (let j = shots2.length - 1; j >= 0; j--) {
		const shot2 =  shots2[j]
		shot2.tickTimer -= 1
		shot2.update()
		if (shot2.tickTimer < 0) {
			shots2.splice(j,1)
		} // culls shots after 60 frames
	}
	// target rendering? also loops backwards yadda yadda
	for (let h = targets.length - 1; h >= 0; h--){
		const target = targets[h]
		target.tickTimer -= 1
		target.update()
		//shots
			for (let i = shots.length - 1; i >= 0; i--) {
			const shot = shots[i]
			
			if (hitReg(target, shot)) {
				shots.splice(i,1)
				console.log('HIT')
				targets.splice(h,1)
				player.targetHits += 1
				console.log(player.targetHits)
			}
			}
		
		
			for (let j = shots2.length - 1; j >= 0; j--) {
			const shot = shots2[j]
			
			if (hitReg(target, shot)) {
				shots2.splice(j,1)
				console.log('HIT')
				targets.splice(h,1)
				player2.targetHits += 1
				console.log(player2.targetHits)
				
			}
			}
		if (target.tickTimer < 0) {
			targets.splice(h,1)
		}
	} // cull targets after longer time has passed bc resources
	
	// resets velocity
	player.velocity.x = 0;
	player.velocity.y = 0;
	
	player2.velocity.x = 0;
	player2.velocity.y = 0;
	
	Shot.tickTimer -= 1; // should subtract 1 for every 'frame'
	// determines speed when key is pressed
	if (keys.w.pressed) {
		player.velocity.x = Math.cos(player.rotation) * PlayerSpeed
		player.velocity.y = Math.sin(player.rotation) * PlayerSpeed
	}
	//rotates right
	if (keys.d.pressed) player.rotation += PlayerRotation
	// rotates left
		else if (keys.a.pressed) player.rotation -= PlayerRotation
		// player 2
if (keys.arrowup.pressed) {
	player2.velocity.x = Math.cos(player2.rotation) * PlayerSpeed
	player2.velocity.y = Math.sin(player2.rotation) * PlayerSpeed
}
if (keys.arrowright.pressed) player2.rotation += PlayerRotation
else if (keys.arrowleft.pressed) player2.rotation -= PlayerRotation
}


window.addEventListener('keydown', (event) => {
	// switch = cleaner if/else, uses cases. better readability.
	switch(event.code) {
		case 'KeyW':
			keys.w.pressed = true
			console.log('Z input');
			break
		case 'KeyA':
			keys.a.pressed = true
			console.log('Q input');
			break
		case 'KeyD':
			keys.d.pressed = true
			console.log('D input');
			break
		case 'Space':
			const ShotSpeedPlayer1 = 3.5
			// defines player dimensions bc.. reasons
			const playerWidth = 100
			const playerHeight =  100
			
			const tipOffsetX = playerWidth / 2; 	// assuming the width of the player's ship is the distance from the center to the tip
			// don't need an offset for Y bc it's centered vertically

			// Calculate the offset based on the player's rotation
			const xOffset = Math.cos(player.rotation) * tipOffsetX;
			const yOffset = Math.sin(player.rotation) * tipOffsetX;
			// Adjust the shot's position based on the offset
			const shotX = player.position.x + playerWidth / 2 + xOffset;
			const shotY = player.position.y + playerHeight / 2 + yOffset;
			shots.push(new Shot({
			position: {
				x: shotX,
				y: shotY,
			},
			velocity: {
				x: Math.cos(player.rotation) * ShotSpeedPlayer1,
				y: Math.sin(player.rotation) * ShotSpeedPlayer1
			}
			
	}))
		// sound effects
			var shotSFX = new Audio("laser.wav");
			shotSFX.play();
			console.log('Spacebar input')
			break
			
			// player 2 inputs
		case 'ArrowUp':
			keys.arrowup.pressed = true
			console.log('up arrow input')
		break
		
		case 'ArrowRight':
			keys.arrowright.pressed = true
			console.log('right arrow input')
		break
		
		case 'ArrowLeft':
			keys.arrowleft.pressed = true
			console.log('left arrow input')
		break
			case 'NumpadEnter':
			const ShotSpeedPlayer2 = 3.5
			const playerWidth2 = 100
			const playerHeight2 =  100	
				
			const tipOffsetX2 = playerWidth2 / 2; 
			const xOffset2 = Math.cos(player2.rotation) * tipOffsetX2;
			const yOffset2 = Math.sin(player2.rotation) * tipOffsetX2;
			// Adjust the shot's position based on the offset
			const shotX2 = player2.position.x + playerWidth2 / 2 + xOffset2;
			const shotY2 = player2.position.y + playerHeight2 / 2 + yOffset2;
			
			
			shots2.push(new Shot({
			position: {
				x: shotX2,
				y: shotY2,
			},
			velocity: {
				x: Math.cos(player2.rotation) * ShotSpeedPlayer2,
				y: Math.sin(player2.rotation) * ShotSpeedPlayer2
				
			}
			
	}))
	// sound effects
	var shotSFX = new Audio("laser.wav");
	shotSFX.play();
	console.log('right enter input')
	break
	}
})


// keyup stops input after letting go
window.addEventListener('keyup', (event) => {
	switch(event.code) {
		case 'KeyW':
			keys.w.pressed = false
			break
		case 'KeyA':
			keys.a.pressed = false
			break
		case 'KeyD':
			keys.d.pressed = false
			break
			
			// player 2 keyup
		case 'ArrowUp': 
			keys.arrowup.pressed = false
			break
		case 'ArrowRight': 
			keys.arrowright.pressed = false
			break
		case 'ArrowLeft': 
			keys.arrowleft.pressed = false
			break
	}
})

// networking! (send help)
function connectSocket() {
}
	// create instance & connect to server
var socket = new SockJS('/websocket', {
	transports: ['websocket'] // force websockets only?
});
//handler for connection open
	socket.onopen = function() {
	console.log('SockJS connection established. ');
	}
	// handler for message received
	socket.onmessage = function(e) {
		console.log('Message received from server: ', e.data);
	}
	socket.onclose = function() {
		console.log('SockJS connection closed. ')
	}