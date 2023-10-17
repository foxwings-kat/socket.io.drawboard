window.addEventListener('resize', onResize, false); 
onResize(); 
		 
		 
function onResize() { 
	console.log("rez"); 
	document.getElementById('myCanvas').width = window.innerWidth/3; 
	document.getElementById('myCanvas').height = window.innerWidth/3; 
	document.getElementById('chatFrame').width = window.innerWidth/3; 
	document.getElementById('chatFrame').height = window.innerHeight - 50; 
} 
		
var canvas = document.getElementById("myCanvas");
var curColor = $('#colorInput').val();
var lineWidth = $('#lineWidthSlider').val();
var context = myCanvas.getContext("2d");
var drawing = false;

$('#colorInput').change(function () {
	curColor = $('#colorInput').val();
	current.color = curColor;
});

$('#lineWidthSlider').change(function () {
	lineWidth = $('#lineWidthSlider').val();
	document.getElementById('lineWidthInput').value = lineWidth;
});

$('#lineWidthInput').change(function () {
	lineWidth = $('#lineWidthInput').val();
	document.getElementById('lineWidthSlider').value = lineWidth;
});

var current = {
	color: 'black'
};

canvas.addEventListener('mousedown', onMouseDown, false);
canvas.addEventListener('mouseup', onMouseUp, false);
canvas.addEventListener('mouseout', onMouseUp, false);
canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false);

//Touch support for mobile devices
canvas.addEventListener('touchstart', onMouseDown, false);
canvas.addEventListener('touchend', onMouseUp, false);
canvas.addEventListener('touchcancel', onMouseUp, false);
canvas.addEventListener('touchmove', throttle(onMouseMove, 10), false);

var socket = io();
var roomNumber;
var messages = document.getElementById('messages');
		
window.addEventListener('message', event => {
	if (event.origin !== window.origin) {
	return; // 验证消息来源
	}
	
	const data = event.data;
	
	if(roomNumber != data.roomNumber){
		socket.emit('leave_room', roomNumber);
		roomNumber = data.roomNumber;
		socket.emit('join_room', roomNumber);
	}
	
});
		
socket.on('drawing', onDrawingEvent);



function drawLine(x0, y0, x1, y1, color, lineWidth, emit) {
	context.imageSmoothingEnabled = true;
	context.beginPath();
	context.moveTo(x0, y0);
	context.lineTo(x1, y1);
	
	context.strokeStyle = color;
	context.lineWidth = lineWidth;
	context.stroke();
	context.closePath();

	if (!emit) { return; }
	var w = canvas.width;
	var h = canvas.height;

	socket.emit('drawing', {
		x0: x0 / w,
		y0: y0 / h,
		x1: x1 / w,
		y1: y1 / h,
		color: color,
		lineWidth: lineWidth
	},roomNumber);
}

function onMouseDown(e) {
	drawing = true;
	
	current.x = e.clientX - canvas.getBoundingClientRect().left || e.touches[0].clientX - canvas.getBoundingClientRect().left;
	current.y = e.clientY - canvas.getBoundingClientRect().top 	|| e.touches[0].clientY - canvas.getBoundingClientRect().top;
	
}

function onMouseUp(e) {
	if (!drawing) { return; }
	drawing = false;
	
	let nextX = e.clientX - canvas.getBoundingClientRect().left || e.touches[0].clientX - canvas.getBoundingClientRect().left;
	let nextY = e.clientY - canvas.getBoundingClientRect().top 	|| e.touches[0].clientY - canvas.getBoundingClientRect().top;
	
	drawLine(current.x, current.y, nextX, nextY, current.color, lineWidth, true);
}

function onMouseMove(e) {
	if (!drawing) { return; }
	
	let nextX = e.clientX - canvas.getBoundingClientRect().left || e.touches[0].clientX - canvas.getBoundingClientRect().left;
	let nextY = e.clientY - canvas.getBoundingClientRect().top 	|| e.touches[0].clientY - canvas.getBoundingClientRect().top;
	
	drawLine(current.x, current.y, nextX, nextY, current.color, lineWidth, true);
	
	current.x = e.clientX - canvas.getBoundingClientRect().left || e.touches[0].clientX - canvas.getBoundingClientRect().left;
	current.y = e.clientY - canvas.getBoundingClientRect().top 	|| e.touches[0].clientY - canvas.getBoundingClientRect().top;
}

function onColorUpdate(e) {
	current.color = e.target.className.split(' ')[1];
}

// limit the number of events per second
function throttle(callback, delay) {
	var previousCall = new Date().getTime();
	return function () {
		var time = new Date().getTime();

		if ((time - previousCall) >= delay) {
			previousCall = time;
			callback.apply(null, arguments);
		}
	};
}

function onDrawingEvent(data) {
	var w = canvas.width;
	var h = canvas.height;
	console.log("draw data");
	drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color, data.lineWidth);
}

// make the canvas fill its parent