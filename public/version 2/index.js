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
	}
	draw(){
		// player image variables
		const playerHeight = 100;
		const playerWidth = 100;
		// loading image
		const playerImg = new Image()
		playerImg.src = "./char.png"
		playerImg.onload = () => {
			context.drawImage(
				// Image to be drawn
				playerImg,
				// Drawing coordinates
				this.position.x,
				this.position.y,
				// player image size
				playerHeight,
				playerWidth)
		}
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
	
	console.log(animation);
	player.update()
	// determines speed when key is pressed
	if (keys.w.pressed) player.velocity.x = 1.64
	
}
player.draw()
console.log(player);
animation();

window.addEventListener('keydown', (event) => {
	// switch = cleaner if/else, uses cases. better readability.
	switch(event.code) {
		case 'KeyW':
			keys.w.pressed = true
			console.log('Z input');
			break
		case 'KeyA':
			console.log('Q input');
			break
		case 'KeyD':
			console.log('D input');
			break
	}
})