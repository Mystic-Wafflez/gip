// creates canvas
// (learning canvas instead to implement drawing more efficiently)
const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d') 
// sets up canvas size & background color
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
context.fillStyle = 'black'
context.fillRect(0, 0, canvas.width, canvas.height)