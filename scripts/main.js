const canvas = document.getElementById("drawCanvas");
const ctx = canvas.getContext('2d');
const toolBar = document.querySelector(".toolbar")
let drawingRn = false;
var color = "#000000";
var mode = "pointer";

function canvasSize(){
    canvas.width = window.innerWidth*7.5/10;
    canvas.height = window.innerHeight;
}

canvasSize();
window.addEventListener('resize', canvasSize);
toolBar.addEventListener('click', (event) => {
    if (event.target.className == "tool"){
        if (event.target.id == "undo"){
            ctx.restore();
        } else {
            mode = event.target.id;
            console.log(mode);
        }
    }
});

canvas.addEventListener('mousedown', (event) => {
    drawingRn = true;
    if (mode=="pointer"){
    
    } else if (mode == "brush"){
        ctx.fillStyle = color;
        ctx.fillRect(event.clientX, event.clientY, 7, 7);
        console.log("Drawing being made");
    }
});
canvas.addEventListener('mouseup', (event) => {
    drawingRn = false;
    console.log("Drawing stopped");
    ctx.save();
});
canvas.addEventListener('mousemove', (event) => {
    if (drawingRn){
        if (mode=="pointer"){
            
        } else if (mode == "brush"){
            ctx.fillStyle = color;
            ctx.fillRect(event.clientX, event.clientY, 7, 7);
            console.log("Drawing being made");
        }
    }
});
