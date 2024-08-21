const canvas = document.getElementById('drawing-board');
const colorPicker = document.getElementById('color');
const ctx = canvas.getContext('2d');

// Function to set the canvas size according to the containing div
function resizeCanvas() {
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
}

// Call resizeCanvas initially to set the canvas size
resizeCanvas();

// Redraw canvas if window is resized
window.addEventListener('resize', resizeCanvas);

let isPainting = false;
let lineWidth = 10;
let lastX = 0;
let lastY = 0;
let recStartX = 0;
let recStartY = 0;
// line=1 rectangle=2 circle=3 eraser=4
let tool = 1; 
let isShiftPressed = false;

// Initialize the default stroke color
ctx.strokeStyle = colorPicker.value;

const draw = (e) => {
    if (!isPainting) {
        return;
    }

    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Get the bounding rectangle of the canvas
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Draw a smooth line by moving from the last position to the current position
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    
    // Update the last position
    lastX = x;
    lastY = y;
}

function calculateRectangle(startX, startY, endX, endY) {
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    let heightX = Math.abs(endX-startX);
    if(isShiftPressed) {
        heightX = (Math.abs(endX-startX) + Math.abs(endY-startY))/2;
    }
    let heightY = Math.abs(endY-startY);
    if(isShiftPressed) {
        heightY = (Math.abs(endX-startX) + Math.abs(endY-startY))/2;
    }
    ctx.beginPath();
    ctx.strokeRect(startX, startY, heightX, heightY); // Add a rectangle to the current path
    ctx.fill(); // Render the path
    console.log(startX + ", " + startY + ", " + endX + ", " + endY);
}

function calculateElipse(startX, startY, endX, endY) {
    let orginX = (Math.abs(endX-startX)/2+startX);
    let orginY = (Math.abs(endY-startY)/2+startY);
    let heightX = Math.abs(endX-startX);
    if(isShiftPressed) {
        heightX = (Math.abs(endX-startX) + Math.abs(endY-startY))/2;
    }
    let heightY = Math.abs(endY-startY);
    if(isShiftPressed) {
        heightY = (Math.abs(endX-startX) + Math.abs(endY-startY))/2;
    }
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.ellipse(orginX, orginY, heightX, heightY, 0, 0, 2 * Math.PI)
    ctx.stroke();
    console.log(startX + ", " + startY + ", " + endX + ", " + endY);
    console.log(orginX + ", " + orginY) ;
}



// Start painting
canvas.addEventListener('mousedown', (e) => {
    isPainting = true;
    const rect = canvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
    recStartX = lastX;
    recStartY = lastY;
});

// Stop painting
canvas.addEventListener('mouseup', (e) => {
    isPainting = false;
    ctx.beginPath();  // Reset the path to prevent drawing a line from the last point
    const rect = canvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
    if (tool === 2) {
        calculateRectangle(recStartX, recStartY, lastX, lastY);
    }
    if (tool === 3) {
        calculateElipse(recStartX, recStartY, lastX, lastY);;
    }
});



// Update the drawing color when the color input changes
colorPicker.addEventListener('input', (e) => {
    ctx.strokeStyle = e.target.value;
});


canvas.addEventListener('mousemove', startDraw);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Shift') {
        isShiftPressed = true;
        console.log('Shift key is held down');
        document.getElementById('toolbar').style.backgroundColor = "#39434d"
    }
});

// Event listener for when any key is released
document.addEventListener('keyup', (e) => {
    if (e.key === 'Shift') {
        isShiftPressed = false;
        console.log('Shift key is released');
        document.getElementById('toolbar').style.backgroundColor = "#778899"
    }
});


function startDraw(e) {
    if (tool === 1) {
        draw(e);
    }
    if (tool === 2) {
        return;
    }
    if (tool === 3) {
        return;
    }
    if (tool === 4) {
        ctx.strokeStyle = 'white';
        draw(e);
    }
}

function changeTool(newTool) {
    tool = newTool;
}
