const canvas = document.getElementById("drawCanvas");
const ctx = canvas.getContext('2d');
const toolBar = document.querySelector(".toolbar")
let drawingRn = false;
var color = "#000000";
var mode = "pointer";
var shapes = [];

function canvasSize(){
    canvas.width = window.innerWidth*7.5/10;
    canvas.height = window.innerHeight;
}

canvasSize();
window.addEventListener('resize', canvasSize);
toolBar.addEventListener('click', (event) => {
    if (event.target.className == "tool"){
        let toolbarelements = document.getElementsByClassName("tool");
        for (let i = toolbarelements.length - 1; i >= 0; i--){
            toolbarelements[i].style.background = "#FFFFFF";
        }
        if (event.target.id == "undo"){
            ctx.restore();
            ctx.restore();
        } else {
            mode = event.target.id;
            event.target.style.background = "#a1a1a1";
            console.log(mode);
        }
    }
});

canvas.addEventListener('mousedown', (event) => {
    drawingRn = true;
    if (mode=="pointer"){
    
    } else if (mode == "brush"){
        ctx.fillStyle = color;
        ctx.fillRect(event.clientX, event.clientY, 2, 2);
        console.log("Drawing being made");
    } else if (mode == "line"){
            ctx.fillStyle = color;
            ctx.moveTo(event.clientX, event.clientY);
            console.log("Drawing being made");
    }
});
canvas.addEventListener('mouseup', (event) => {
    drawingRn = false;
    console.log("Drawing stopped");
    ctx.save();
    if (mode == "line"){
        ctx.lineTo(event.clientX, event.clientY);
        ctx.stroke();
    }
});
canvas.addEventListener('mousemove', (event) => {
    if (drawingRn){
        if (mode=="pointer"){
            
        } else if (mode == "brush"){
            ctx.fillStyle = color;
            ctx.fillRect(event.clientX, event.clientY, 2, 2);
            console.log("Drawing being made");
        } 
    }
});
