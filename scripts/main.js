const canvas = document.getElementById("drawCanvas");
const ctx = canvas.getContext('2d');
let drawingRn = false;
var color = "#000000";
var mode = "pointer";

function canvasSize(){
    canvas.width = window.innerWidth*7.5/10;
    canvas.height = window.innerHeight;
}

canvasSize();
window.addEventListener('resize', canvasSize);
canvas.addEventListener('mousedown', (event) => {
    drawingRn = true;
    if (mode=="pointer"){
    
    } else {
        ctx.fillStyle = color;
        ctx.fillRect(event.clientX, event.clientY, 7, 7);
        console.log("Drawing being made");
    }
})
canvas.addEventListener('mouseup', (event) => {
    drawingRn = false;
    console.log("Drawing stopped");
})
canvas.addEventListener('mousemove', (event) => {
    if (drawingRn){
        if (mode=="pointer"){

        } else {
            ctx.fillStyle = color;
            ctx.fillRect(event.clientX, event.clientY, 7, 7);
            console.log("Drawing being made");
        }
    }
})