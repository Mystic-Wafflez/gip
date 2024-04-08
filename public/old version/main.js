var positionH = 50;
var positionV = 85;
var moveX = 0;
var moveY = 0;
var rotating = 0;

// refresh stuff
window.onload = function(){
	console.log('loaded')
	setInterval(tickRate, 14)
	shotCollision();
	//setInterval(shotCollision,14)
	// remove comment to enable enemy spawning
	//setInterval(spawnEnemy, 3000)
	
}

function tickRate(){
	if (moveX == 0) {
		
	}else if (moveX == -1) {
		moveLeft();
	}else if (moveX == 1) {
		moveRight();
	}
	if (moveY == 0) {
	}else if (moveY == 1) {
		moveUp();
	}else if (moveY == -1) {
		moveDown();
	}else if (rotating == 1){
		rotateClockwise();
	}
moveShots();	
}
// player controls
function keydown(event) {
	console.log(event.code)
	if (event.code == "ArrowLeft") {
		moveX = -1;
		
	}
	else if (event.code == "ArrowRight") {
		moveX = 1;
		
	}
	else if (event.code == "ArrowUp") {
		moveY = 1;
		moveUp();
	}
	else if (event.code =="ArrowDown"){
		moveY = -1;
		moveDown();
	}
	else if (event.code == "Space"){
		shoot();
	}else if (event.code == "KeyE"){
		console.log("elseif")
		rotating = 1;
		rotateClockwise();
	}else if (event.code == "KeyP"){
		spawnEnemy();
	}
}
function keyup(event){
	if (event.code == "ArrowLeft") {
		moveX = 0;
	}else if (event.code == "ArrowRight") {
		moveX = 0;
	}else if (event.code == "ArrowUp"){
		moveY = 0;
	}else if (event.code == "ArrowDown"){
		moveY = 0;
	}else if (event.code == "KeyE"){
		rotating = 0;
	}
}

// plr movement functions
function moveLeft() {
	if (positionH > 0 ) {
		positionH = positionH - 1;
		document.getElementById("char").style.left = positionH + "%"
	}
}
function moveRight(){
	if (positionH < 95) {
		positionH = positionH + 1;
		document.getElementById("char").style.left = positionH + "%"
	}
}
function moveUp() {
	if (positionV >= 0){
		positionV = positionV - 1;
		document.getElementById("char").style.top = positionV + "%"
	}
}
function moveDown() {
	if (positionV < 95){
		positionV = positionV + 1;
		document.getElementById("char").style.top = positionV + "%"
	}
}
// only rotates once? needs fix/workaround
function rotateClockwise(){
	char = document.getElementById("char");
	rotateAngle = 0;
  	rotateAngle = rotateAngle + 90;
	char.setAttribute("style", "transform: rotate(" + rotateAngle + "deg)");
	console.log(rotateAngle);
}
// combat stuff, creates shots & plays SFX
// todo: shot collision & culling(?)
function shoot() {
	var shotSFX = new Audio("laser.wav");
	var shot = document.createElement("img")
	shot.classList.add("shot")
	shot.src="Shot.png"
	shot.style.left = positionH + 1 + '%';
	shot.style.top = positionV + 1 + "%";
	document.body.appendChild(shot);
	shotSFX.play();
}
// note to self: use tickRate 
function moveShots(){
	var shots = document.getElementsByClassName("shot")
	for (var i = 0; i < shots.length; i++) {
		var h = parseInt(shots[i].style.top)
		h = h - 1.5;
		shots[i].style.top = h + "%"
		}
	for (var i = 0; i < shots.length; i++) {
		if (parseInt(shots[i].style.top <= 0)) {
			removeImg(shots[i]);
			}
		}
}
// unfinished culling
function removeImg(img) {
	img.parentNode.removeChild(img)
}
function spawnEnemy(){
	var enemy = document.createElement("img");
	enemy.classList.add("enemies");
	enemy.src="enemy.png";
	document.body.appendChild(enemy);
}
function shotCollision(){
	var shots = document.getElementsByClassName("shot");
	var enemy = document.getElementsByClassName("enemies");
	return(		
	shots.positionH + shots.width >= enemy.positionH &&
	shots.positionH <= enemy.positionH + enemy.width &&
	shots.positionY + shots.height >= enemy.positionY &&
	shots.positiony<= enemy.positionY + enemy.height
	);		
}
