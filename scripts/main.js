const canvas = document.getElementById("drawCanvas");
const ctx = canvas.getContext('2d');
const toolBar = document.querySelector(".toolbar");
const colors = document.querySelector(".colorGrid");
const lineWidthSlider = document.getElementById("lineWidthSlider");
let drawingRn = false;
var lineWidth = 1;
var color = "#000000";
var mode = "pointer";
var tempCoords = [0, 0];
var shapes = [];
function canvasSize(){
    canvas.width = window.innerWidth*7.5/10;
    canvas.height = window.innerHeight;
}

canvasSize();
var stateStack = [ctx.getImageData(0, 0, canvas.width, canvas.height)];
window.addEventListener('keydown', (event) => {
    console.log(event.key);
    if ((event.metaKey || event.ctrlKey)&&event.key=='z'){
        document.getElementById('undo').click();
    } else if (event.key == 'p'){
        document.getElementById('pointer').click();
    } else if (event.key == 'b'){
        document.getElementById('brush').click();
    } else if (event.key == 'l'){
        document.getElementById('line').click();
    } else if (event.key == 's'){
        document.getElementById('square').click();
    } else if (event.key == 'c'){
        document.getElementById('circle').click();
    } else if (event.key == 'r'){
        document.getElementById('rect').click();
    } else if (event.key == 't'){
        document.getElementById('tri').click();
    } else if (event.key == '+'){
        if (lineWidthSlider.value<16){
            lineWidthSlider.value++;
            lineWidth++;
            document.getElementById("displayLineWidth").innerHTML = lineWidth;
        }
    } else if (event.key == '-'){
        if (lineWidthSlider.value>1){
            lineWidthSlider.value--;
            lineWidth--;
            document.getElementById("displayLineWidth").innerHTML = lineWidth;
        }
    } else if (event.key == '1'){
        document.getElementById('red').click()
    } else if (event.key == '2'){
        document.getElementById('orange').click()
    } else if (event.key == '3'){
        document.getElementById('yellow').click()
    } else if (event.key == '4'){
        document.getElementById('green').click()
    } else if (event.key == '5'){
        document.getElementById('cyan').click()
    } else if (event.key == '6'){
        document.getElementById('blue').click()
    } else if (event.key == '7'){
        document.getElementById('voilet').click()
    } else if (event.key == '8'){
        document.getElementById('white').click()
    } else if (event.key == '9'){
        document.getElementById('black').click()
    }
});
toolBar.addEventListener('click', (event) => {
    if (event.target.className == "tool"){
        if (event.target.id == "undo"){
            console.log("undo");
            if (stateStack.length >= 2){
                stateStack.pop();
                ctx.putImageData(stateStack[stateStack.length-1], 0, 0);
            } else {
                ctx.putImageData(stateStack[0], 0, 0);
            }
            console.log(stateStack);
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
lineWidthSlider.addEventListener('input', (event) => {
    lineWidth = event.target.value;
    document.getElementById("displayLineWidth").innerHTML = lineWidth;
});
colors.addEventListener('click', (event) => {
    console.log("Colors clicked");
    if (event.target.className == "color"){
        let allcolors = document.getElementsByClassName("color");
        for (let i = allcolors.length - 1; i >= 0; i--){
            allcolors[i].style.border = "0.15rem solid transparent";
        }
        color = event.target.id;
        if (color == "black"){
            event.target.style.border = "0.15rem solid white";
        } else {
            event.target.style.border = "0.15rem solid";
        }
    }
    console.log(event.target.id);
    console.log(color);
});

canvas.addEventListener('mousedown', (event) => {
    drawingRn = true;
    if (mode=="pointer"){
    
    } else if (mode == "brush"){
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        ctx.fillRect(event.clientX, event.clientY, 2, 2);
        tempCoords = [event.clientX, event.clientY];
        ctx.moveTo(tempCoords[0], tempCoords[1]);
        console.log("Drawing being made");
    } else if (mode == "line"){
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        ctx.moveTo(event.clientX, event.clientY);
        console.log("Drawing being made");
    } else if (mode == "rect"){
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        ctx.moveTo(event.clientX, event.clientY);
        tempCoords[0] = event.clientX;
        tempCoords[1] = event.clientY;
        console.log(tempCoords);
        console.log("Drawing being made");
    } else if (mode == "square"){
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        ctx.moveTo(event.clientX, event.clientY);
        tempCoords[0] = event.clientX;
        tempCoords[1] = event.clientY;
        console.log(tempCoords);
        console.log("Drawing being made");
    } else if (mode == "circle"){
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        tempCoords[0] = event.clientX;
        tempCoords[1] = event.clientY;
        console.log(tempCoords);
        console.log("Drawing being made");
    } else if (mode == "tri"){
        ctx.strokeStyle = color;
        tempCoords[0] = event.clientX;
        tempCoords[1] = event.clientY;
        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        console.log(tempCoords);
        console.log("Drawing being made");
    }
});
canvas.addEventListener('mouseup', (event) => {
    drawingRn = false;
    console.log("Drawing stopped");
    console.log(stateStack[0]);
    console.log(stateStack[1]);
    console.log(stateStack[2]);
    console.log(stateStack[3]);
    if (mode == 'brush'){
        stateStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    } else if (mode == "line"){
        ctx.lineTo(event.clientX, event.clientY);
        ctx.stroke();
        stateStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    } else if (mode == "rect"){
        ctx.lineTo(tempCoords[0], event.clientY);
        ctx.lineTo(event.clientX, event.clientY);
        ctx.moveTo(tempCoords[0], tempCoords[1]);
        ctx.lineTo(event.clientX, tempCoords[1]);
        ctx.lineTo(event.clientX, event.clientY);
        ctx.stroke();
        stateStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
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
        stateStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        
    } else if (mode == "circle"){
        let radius = Math.sqrt((event.clientX - tempCoords[0])**2 + (event.clientY - tempCoords[1])**2);
        ctx.arc(tempCoords[0], tempCoords[1], radius, 0, 2*Math.PI);
        ctx.stroke();
        stateStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    } else if (mode == "tri"){
        ctx.moveTo(tempCoords[0], event.clientY);
        ctx.lineTo(event.clientX, event.clientY);
        ctx.lineTo((event.clientX+tempCoords[0])/2, tempCoords[1]);
        ctx.lineTo(tempCoords[0], event.clientY);
        ctx.stroke();
        stateStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
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
