const canvas = document.getElementById("drawCanvas");
const ctx = canvas.getContext('2d');
const toolBar = document.querySelector(".toolbar");
const lineWidthSlider = document.getElementById("lineWidthSlider");
let drawingRn = false;
var lineWidth = 1;
var color = "#000000";
var mode = "pointer";
var tempCoords = [0, 0];
var shapes = [];
var brushArray = new Array();
function canvasSize(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function drawCanvas(stack){
    // console.log(stack);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < stack.length; i++){
        if (stack[i].get("type")=="line"){
            ctx.beginPath();
            ctx.strokeStyle = stack[i].get("color");
            ctx.lineWidth = stack[i].get("linewidth");
            ctx.moveTo(stack[i].get("initial")[0], stack[i].get("initial")[1]);
            ctx.lineTo(stack[i].get("final")[0], stack[i].get("final")[1]);
            ctx.stroke();
        } else if (stack[i].get("type")=="brush"){
            console.log("brushhh");
            ctx.beginPath();
            ctx.strokeStyle = stack[i].get("color");
            ctx.lineWidth = stack[i].get("linewidth");
            ctx.moveTo(stack[i].get("initial")[0], stack[i].get("initial")[1]);
            for (let j = 0;  j < stack[i].get("drawArray").length; j++){
                console.log([stack[i].get("drawArray")[j][0], stack[i].get("drawArray")[j][1]]);
                ctx.lineTo(stack[i].get("drawArray")[j][0], stack[i].get("drawArray")[j][1]);
            }
            ctx.stroke();

        } else if (stack[i].get("type")=="rect"){
            // console.log("Rect in array");
            ctx.beginPath();
            ctx.strokeStyle = stack[i].get("color");
            ctx.lineWidth = stack[i].get("linewidth");
            ctx.moveTo(stack[i].get("initial")[0], stack[i].get("initial")[1])
            ctx.lineTo(stack[i].get("initial")[0], stack[i].get("final")[1]);
            ctx.lineTo(stack[i].get("final")[0], stack[i].get("final")[1]);
            ctx.moveTo(stack[i].get("initial")[0], stack[i].get("initial")[1])
            ctx.lineTo(stack[i].get("final")[0], stack[i].get("initial")[1]);
            ctx.lineTo(stack[i].get("final")[0], stack[i].get("final")[1]);
            ctx.stroke();
        } else if (stack[i].get("type")=="circle"){
            ctx.beginPath();
            ctx.strokeStyle = stack[i].get("color");
            ctx.lineWidth = stack[i].get("linewidth");
            let radius = Math.sqrt((stack[i].get("final")[0]- stack[i].get("initial")[0])**2 + (stack[i].get("final")[1]- stack[i].get("initial")[1])**2);
            ctx.arc(stack[i].get("initial")[0], stack[i].get("initial")[1], radius, 0, 2*Math.PI);
            ctx.stroke();
        } else if (stack[i].get("type")=="tri"){
            ctx.beginPath();
            ctx.strokeStyle = stack[i].get("color");
            ctx.lineWidth = stack[i].get("linewidth");
            ctx.moveTo(stack[i].get("initial")[0], stack[i].get("final")[1]);
            ctx.lineTo(stack[i].get("final")[0], stack[i].get("final")[1]);
            ctx.lineTo((stack[i].get("final")[0]+stack[i].get("initial")[0])/2, stack[i].get("initial")[1]);
            ctx.lineTo(stack[i].get("initial")[0], stack[i].get("final")[1]);
            ctx.stroke();
        } else if (stack[i].get("type")=="square"){
            ctx.beginPath();
            ctx.strokeStyle = stack[i].get("color");
            ctx.lineWidth = stack[i].get("linewidth");
            ctx.moveTo(stack[i].get("initial")[0], stack[i].get("initial")[1]);
            if (Math.abs(stack[i].get("final")[0] - stack[i].get("initial")[0]) > Math.abs(stack[i].get("final")[1] - stack[i].get("initial")[1])){
                ctx.lineTo(stack[i].get("initial")[0], stack[i].get("final")[1]);
                ctx.lineTo(stack[i].get("final")[1] - stack[i].get("initial")[1] + stack[i].get("initial")[0], stack[i].get("final")[1]);
                ctx.moveTo(stack[i].get("initial")[0], stack[i].get("initial")[1]);
                ctx.lineTo(stack[i].get("final")[1] - stack[i].get("initial")[1] + stack[i].get("initial")[0], stack[i].get("initial")[1]);
                ctx.lineTo(stack[i].get("final")[1] - stack[i].get("initial")[1] + stack[i].get("initial")[0], stack[i].get("final")[1]);
            } else {
                ctx.lineTo(stack[i].get("final")[0], stack[i].get("initial")[1]);
                ctx.lineTo(stack[i].get("final")[0], stack[i].get("final")[0] - stack[i].get("initial")[0] + stack[i].get("initial")[1]);
                ctx.moveTo(stack[i].get("initial")[0], stack[i].get("initial")[1]);
                ctx.lineTo(stack[i].get("initial")[0], stack[i].get("initial")[1] + stack[i].get("final")[0] - stack[i].get("initial")[0]);
                ctx.lineTo(stack[i].get("final")[0], stack[i].get("final")[0] - stack[i].get("initial")[0] + stack[i].get("initial")[1]);
                
            }
            ctx.stroke();
        }
    }
}

canvasSize();
// var stateStack = [ctx.getImageData(0, 0, canvas.width, canvas.height)];
window.addEventListener('keydown', (event) => {
    console.log(event.key);
    if ((event.metaKey || event.ctrlKey)&&event.key=='z'){
        document.getElementById('undo').click();
    } else if ((event.metaKey || event.ctrlKey)&&event.key=='c'){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
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
    }
});
toolBar.addEventListener('click', (event) => {
    if (event.target.className == "tool"){
        if (event.target.id == "undo"){
            console.log("undo");
            if (shapes.length > 0){
                shapes.pop();
                drawCanvas(shapes);
            }
            console.log(shapes);
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
document.getElementById("color").addEventListener('input', (event) => {
    color = event.target.value;
});

canvas.addEventListener('mousedown', (event) => {
    drawCanvas(shapes);
    drawingRn = true;
    if (mode=="pointer"){

    } else if (mode == "brush"){
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        ctx.fillRect(event.clientX, event.clientY, 2, 2);
        tempCoords[0] = event.clientX;
        tempCoords[1] = event.clientY;
        ctx.moveTo(tempCoords[0], tempCoords[1]);
        console.log("Drawing being made");
    } else if (mode == "line"){
        ctx.strokeStyle = color;
        ctx.beginPath();
        tempCoords[0] = event.clientX;
        tempCoords[1] = event.clientY;
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
    drawCanvas(shapes);
});
canvas.addEventListener('mouseup', (event) => {
    drawingRn = false;
    drawCanvas(shapes);
    console.log("Drawing stopped");
    // console.log(stateStack[0]);
    // console.log(stateStack[1]);
    // console.log(stateStack[2]);
    // console.log(stateStack[3]);
    
    if (mode == 'brush'){
        const brushMap = new Map();
        brushMap.set("type","brush");
        brushMap.set("initial",[tempCoords[0], tempCoords[1]]);
        brushMap.set("final",[event.clientX, event.clientY]);
        brushMap.set("color",color);
        brushMap.set("linewidth",lineWidth);
        brushMap.set("drawArray",brushArray);
        shapes.push(brushMap);
        brushArray = [];
    } else if (mode == "line"){
        const lineMap = new Map();
        lineMap.set("type","line");
        lineMap.set("initial",[tempCoords[0], tempCoords[1]]);
        lineMap.set("final",[event.clientX, event.clientY]);
        lineMap.set("color",color);
        lineMap.set("linewidth",lineWidth);
        shapes.push(lineMap);
    } else if (mode == "rect"){
        console.log("Pushing rect");
        const rectMap = new Map();
        rectMap.set("type","rect");
        rectMap.set("initial",[tempCoords[0], tempCoords[1]]);
        rectMap.set("final",[event.clientX, event.clientY]);
        rectMap.set("color",color);
        rectMap.set("linewidth",lineWidth);
        shapes.push(rectMap);
    } else if (mode == "square"){
        console.log("Pushing square");
        const sqMap = new Map();
        sqMap.set("type","square");
        sqMap.set("initial",[tempCoords[0], tempCoords[1]]);
        sqMap.set("final",[event.clientX, event.clientY]);
        sqMap.set("color",color);
        sqMap.set("linewidth",lineWidth);
        shapes.push(sqMap);
    } else if (mode == "circle"){
        console.log("Pushing circle");
        const cirMap = new Map();
        cirMap.set("type","circle");
        cirMap.set("initial",[tempCoords[0], tempCoords[1]]);
        cirMap.set("final",[event.clientX, event.clientY]);
        cirMap.set("color",color);
        cirMap.set("linewidth",lineWidth);
        shapes.push(cirMap);
    } else if (mode == "tri"){
        console.log("Pushing tri");
        const triMap = new Map();
        triMap.set("type","tri");
        triMap.set("initial",[tempCoords[0], tempCoords[1]]);
        triMap.set("final",[event.clientX, event.clientY]);
        triMap.set("color",color);
        triMap.set("linewidth",lineWidth);
        shapes.push(triMap);
    }
    console.log(shapes);
    drawCanvas(shapes);
    
});
window.addEventListener('mousemove', (event) => {
    if (drawingRn){
        console.log("pointer moving");
        drawCanvas(shapes);
    //     if (mode=="pointer"){
        
    //     } else if (mode == "brush"){
    //         ctx.fillStyle = color;
    //         ctx.lineTo(event.clientX, event.clientY, 2, 2);
    //         ctx.stroke();
    //         tempCoords = [event.clientX, event.clientY];
    //         console.log("Drawing being made");
    //     } 
    // }
            
        if (mode == 'brush'){
            
            brushArray.push([event.clientX, event.clientY]);


        } else if (mode == "line"){
            ctx.lineTo(event.clientX, event.clientY);
            ctx.stroke();
        } else if (mode == "rect"){
            drawCanvas(shapes);
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
        drawCanvas(shapes);
    }
});
