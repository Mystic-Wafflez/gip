// made using HTML Canvas API
// TODO: pretty titlescreen, DB connection, netcode (multiplayer)
// NOTE: circular hitreg uses Pythagorean theorem (maybe i DO have a use for it in life after all?)
// DONE: player, full 360 movement, shooting, shot culling, targets, hitreg
// basic canvas setup
const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d') 
// sets up canvas size, scalable
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


// player class + constructor
class Player {
	constructor({position, velocity}) {
		this.position = position; // uses {x,y}
		this.velocity = velocity; // same deal
		this.rotation = 0 // starting value
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
		context.beginPath()
		context.arc(this.position.x,this.position.y,this.radius,0,Math.PI*2,false)
		context.closePath()
		context.strokeStyle = '#39FF14'
		context.stroke()
	}
	update(){
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

const shots = []
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
	}
}
// speed values
const PlayerSpeed = 2.5
const PlayerRotation = 0.015
const ShotSpeed = 3.5
// creates targets every X milliseconds
window.setInterval(() => {
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
},3000)

function hitReg(circle1, circle2) {
	// get distance between x & y positions of both circles
	const xDiff  = circle2.position.x - circle1.position.x
	const yDiff = circle2.position.y - circle1.position.y
	// Square root of xDiff² + yDiff²
	const distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff)
	// check if touching
	if (distance <= circle1.radius + circle2.radius ){
		console.log('hit')
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
	// starts loop
	window.requestAnimationFrame(animation)
	player.update()
	// loops backwards through shots array every frame
	for (let i = shots.length - 1; i >= 0; i--) {
		const shot =  shots[i]
		shot.tickTimer -= 1
		shot.update()
		if (shot.tickTimer < 0) {
			shots.splice(i,1)
		} // culls shots after 60 frames
	}
	// target rendering? also loops backwards yadda yadda
	for (let i = targets.length - 1; i >= 0; i--){
		const target = targets[i]
		target.tickTimer -= 1
		target.update()
		//shots
			for (let i = shots.length - 1; i >= 0; i--) {
			const shot = shots[i]
			
			if (hitReg(target, shot)) {
				shots.splice(i,1)
				console.log('HIT')
				targets.splice(i,1)
			}
			}
		if (target.tickTimer < 0) {
			targets.splice(i,1)
		}
	} // cull targets after longer time has passed bc resources
	
	// resets velocity
	player.velocity.x = 0;
	player.velocity.y = 0;
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
		case 'Space':
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
				x: Math.cos(player.rotation) * ShotSpeed,
				y: Math.sin(player.rotation) * ShotSpeed
			}
			
	}))
			console.log('Spacebar input')
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
	}
})