const canvas = document.getElementById("drawCanvas");
const ctx = canvas.getContext('2d');
const toolBar = document.querySelector(".toolbar")
let drawingRn = false;
var color = "#000000";
var mode = "pointer";
var tempCoords = [0, 0];
var shapes = [];
var stateStack = [canvas.toDataURL()];

function canvasSize(){
    canvas.width = window.innerWidth*7.5/10;
    canvas.height = window.innerHeight;
}

canvasSize();
toolBar.addEventListener('click', (event) => {
    if (event.target.className == "tool"){
        if (event.target.id == "undo"){
            ctx.drawImage(stateStack[0]);
            stateStack.pop();
        } else {
            let toolbarelements = document.getElementsByClassName("tool");
            for (let i = toolbarelements.length - 1; i >= 0; i--){
                toolbarelements[i].style.background = "#FFFFFF";
            }
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
        tempCoords = [event.clientX, event.clientY];
        ctx.moveTo(tempCoords[0], tempCoords[1]);
        console.log("Drawing being made");
    } else if (mode == "line"){
        ctx.fillStyle = color;
        ctx.moveTo(event.clientX, event.clientY);
        console.log("Drawing being made");
    } else if (mode == "rect"){
        ctx.fillStyle = color;
        ctx.moveTo(event.clientX, event.clientY);
        tempCoords[0] = event.clientX;
        tempCoords[1] = event.clientY;
        console.log(tempCoords);
        console.log("Drawing being made");
    } else if (mode == "square"){
        ctx.fillStyle = color;
        ctx.moveTo(event.clientX, event.clientY);
        tempCoords[0] = event.clientX;
        tempCoords[1] = event.clientY;
        console.log(tempCoords);
        console.log("Drawing being made");
    } else if (mode == "circle"){
        ctx.fillStyle = color;
        ctx.beginPath();
        tempCoords[0] = event.clientX;
        tempCoords[1] = event.clientY;
        console.log(tempCoords);
        console.log("Drawing being made");
    } else if (mode == "tri"){
        ctx.fillStyle = color;
        tempCoords[0] = event.clientX;
        tempCoords[1] = event.clientY;
        console.log(tempCoords);
        console.log("Drawing being made");
    }
});
canvas.addEventListener('mouseup', (event) => {
    drawingRn = false;
    console.log("Drawing stopped");
    stateStack.push(canvas.toDataURL());
    if (mode == 'brush'){

    } else if (mode == "line"){
        ctx.lineTo(event.clientX, event.clientY);
        ctx.stroke();
    } else if (mode == "rect"){
        ctx.lineTo(tempCoords[0], event.clientY);
        ctx.lineTo(event.clientX, event.clientY);
        ctx.moveTo(tempCoords[0], tempCoords[1]);
        ctx.lineTo(event.clientX, tempCoords[1]);
        ctx.lineTo(event.clientX, event.clientY);
        ctx.stroke();
    } else if (mode == "square"){
        if (Math.abs(event.clientX - tempCoords[0]) > Math.abs(event.clientY - tempCoords[1])){
            ctx.lineTo(tempCoords[0], event.clientY);
            ctx.lineTo(event.clientY - tempCoords[1] + tempCoords[0], event.clientY);
            ctx.moveTo(tempCoords[0], tempCoords[1]);
            ctx.lineTo(event.clientY - tempCoords[1] + tempCoords[0], tempCoords[1]);
            ctx.lineTo(event.clientY - tempCoords[1] + tempCoords[0], event.clientY);
        } else {
            ctx.lineTo(event.clientX, tempCoords[1]);
            ctx.lineTo(event.clientX, event.clientX - tempCoords[0] + tempCoords[1]);
            ctx.moveTo(tempCoords[0], tempCoords[1]);
            ctx.lineTo(tempCoords[0], tempCoords[1] + event.clientX - tempCoords[0]);
            ctx.lineTo(event.clientX, event.clientX - tempCoords[0] + tempCoords[1]);
            
        }
        ctx.stroke();

    } else if (mode == "circle"){
        let radius = Math.sqrt((event.clientX - tempCoords[0])**2 + (event.clientY - tempCoords[1])**2);
        ctx.arc(tempCoords[0], tempCoords[1], radius, 0, 2*Math.PI);
        ctx.stroke();
    } else if (mode == "tri"){
        ctx.moveTo(tempCoords[0], event.clientY);
        ctx.lineTo(event.clientX, event.clientY);
        ctx.lineTo((event.clientX+tempCoords[0])/2, tempCoords[1]);
        ctx.lineTo(tempCoords[0], event.clientY);
        ctx.stroke();
    }
});
canvas.addEventListener('mousemove', (event) => {
    if (drawingRn){
        if (mode=="pointer"){
            
        } else if (mode == "brush"){
            ctx.fillStyle = color;
            ctx.lineTo(event.clientX, event.clientY, 2, 2);
            ctx.stroke();
            tempCoords = [event.clientX, event.clientY];
            console.log("Drawing being made");
        } 
    }
});
