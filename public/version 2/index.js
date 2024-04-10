// made using HTML Canvas API
// creates canvas
const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d') 
// sets up canvas size & background color
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
context.fillStyle = 'black'
context.fillRect(0, 0, canvas.width, canvas.height)

// player class + constructor
class Player {
	constructor({position, velocity}) {
		this.position = position; // uses {x,y}
		this.velocity = velocity; // same deal
		this.rotation = 0
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
	}
	// calls draw, updates position based on velocity
	update() {
		this.draw()
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y
	}
}
// player
const player = new Player({
	position: {x: canvas.width / 2 - 50, y: canvas.height / 2 - 50},
	velocity: {x: 0, y: 0},
})

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
	}
}

// calls update, creates animation loop
function animation() {
	window.requestAnimationFrame(animation)
	player.update()
	
	player.velocity.x = 0;
	player.velocity.y = 0;
	
	// determines speed when key is pressed
	if (keys.w.pressed) {
		player.velocity.x = Math.cos(player.rotation)
		player.velocity.y = Math.sin(player.rotation)
	}
	//rotates right
	if (keys.d.pressed) player.rotation += 0.01
	// rotates left
		else if (keys.a.pressed) player.rotation -= 0.01
}
animation();

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
	}
})
// keyup stops input after letting go
window.addEventListener('keyup', (event) => {
	switch(event.code) {
		case 'KeyW':
			keys.w.pressed = false
			console.log('Z input');
			break
		case 'KeyA':
			keys.a.pressed = false
			console.log('Q input');
			break
		case 'KeyD':
			keys.d.pressed = false
			console.log('D input');
			break
	}
})
