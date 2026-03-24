const canvas = document.getElementById("drawCanvas");
const ctx = canvas.getContext('2d');
const toolBar = document.querySelector(".toolbar");
const lineWidthSlider = document.getElementById("lineWidthSlider");
let drawingRn = false;
var brushArray = [];
var tempCoords = [0, 0];
if(localStorage.getItem("stack")==null){
    var shapes=[];
    var mode = "pointer";
    var color = "#000000";
    var lineWidth = 1;
    var lightmode = 1;
} else {
    var shapes = JSON.parse(localStorage.getItem("stack"));
    var mode = localStorage.getItem("mode");
    var color = localStorage.getItem("color");
    var lineWidth = localStorage.getItem("lineWidth");
    var lightmode = localStorage.getItem("lightmode");
}
document.getElementById(mode).classList.add("activeMode");
document.getElementById("color").value = color;
document.getElementById("lineWidthSlider").value = lineWidth;
document.getElementById("displayLineWidth").innerHTML = lineWidth;
lineWidthSlider.style.accentColor=color;
function canvasSize(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawCanvas(shapes);
}

function drawCanvas(stack){
    // console.log(stack);
    if (lightmode==1){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.stroke();
    }
    for (let i = 0; i < stack.length; i++){
        if (stack[i][0]=="line"){
            ctx.beginPath();
            ctx.strokeStyle = stack[i][3];
            ctx.lineWidth = stack[i][4];
            ctx.moveTo(stack[i][1][0], stack[i][1][1]);
            ctx.lineTo(stack[i][2][0], stack[i][2][1]);
            ctx.stroke();
        } else if (stack[i][0]=="brush"){
            console.log("brushhh");
            ctx.beginPath();
            ctx.strokeStyle = stack[i][3];
            ctx.lineWidth = stack[i][4];
            ctx.moveTo(stack[i][1][0], stack[i][1][1]);
            for (let j = 0;  j < stack[i][5].length; j++){
                console.log([stack[i][5][j][0], stack[i][5][j][1]]);
                ctx.lineTo(stack[i][5][j][0], stack[i][5][j][1]);
                ctx.moveTo(stack[i][5][j][0], stack[i][5][j][1]);
            }
            ctx.stroke();

        } else if (stack[i][0]=="rect"){
            // console.log("Rect in array");
            ctx.beginPath();
            ctx.strokeStyle = stack[i][3];
            ctx.lineWidth = stack[i][4];
            ctx.moveTo(stack[i][1][0], stack[i][1][1])
            ctx.lineTo(stack[i][1][0], stack[i][2][1]);
            ctx.lineTo(stack[i][2][0], stack[i][2][1]);
            ctx.moveTo(stack[i][1][0], stack[i][1][1])
            ctx.lineTo(stack[i][2][0], stack[i][1][1]);
            ctx.lineTo(stack[i][2][0], stack[i][2][1]);
            ctx.stroke();
        } else if (stack[i][0]=="circle"){
            ctx.beginPath();
            ctx.strokeStyle = stack[i][3];
            ctx.lineWidth = stack[i][4];
            let diameter = Math.sqrt((stack[i][2][0]- stack[i][1][0])**2 + (stack[i][2][1]- stack[i][1][1])**2);
            ctx.arc((stack[i][1][0]+stack[i][2][0])/2, (stack[i][1][1]+stack[i][2][1])/2, diameter/2, 0, 2*Math.PI);
            ctx.stroke();
        } else if (stack[i][0]=="tri"){
            ctx.beginPath();
            ctx.strokeStyle = stack[i][3];
            ctx.lineWidth = stack[i][4];
            ctx.moveTo(stack[i][1][0], stack[i][2][1]);
            ctx.lineTo(stack[i][2][0], stack[i][2][1]);
            ctx.lineTo((stack[i][2][0]+stack[i][1][0])/2, stack[i][1][1]);
            ctx.lineTo(stack[i][1][0], stack[i][2][1]);
            ctx.stroke();
        } else if (stack[i][0]=="square"){
            ctx.beginPath();
            ctx.strokeStyle = stack[i][3];
            ctx.lineWidth = stack[i][4];
            ctx.moveTo(stack[i][1][0], stack[i][1][1]);
            if (Math.abs(stack[i][2][0] - stack[i][1][0]) > Math.abs(stack[i][2][1] - stack[i][1][1])){
                if ((stack[i][2][0] - stack[i][1][0])*((stack[i][2][1] - stack[i][1][1]))>0){
                    ctx.lineTo(stack[i][1][0], stack[i][2][1]);
                    ctx.lineTo(stack[i][2][1] - stack[i][1][1] + stack[i][1][0], stack[i][2][1]);
                    ctx.moveTo(stack[i][1][0], stack[i][1][1]);
                    ctx.lineTo(stack[i][2][1] - stack[i][1][1] + stack[i][1][0], stack[i][1][1]);
                    ctx.lineTo(stack[i][2][1] - stack[i][1][1] + stack[i][1][0], stack[i][2][1]);
                } else {
                    ctx.lineTo(stack[i][1][0], stack[i][2][1]);
                    ctx.lineTo(-stack[i][2][1] + stack[i][1][1] + stack[i][1][0], stack[i][2][1]);
                    ctx.moveTo(stack[i][1][0], stack[i][1][1]);
                    ctx.lineTo(-stack[i][2][1] + stack[i][1][1] + stack[i][1][0], stack[i][1][1]);
                    ctx.lineTo(-stack[i][2][1] + stack[i][1][1] + stack[i][1][0], stack[i][2][1]);
                }
            } else {
                if ((stack[i][2][0] - stack[i][1][0])*((stack[i][2][1] - stack[i][1][1]))>0){
                    ctx.lineTo(stack[i][2][0], stack[i][1][1]);
                    ctx.lineTo(stack[i][2][0], stack[i][2][0] - stack[i][1][0] + stack[i][1][1]);
                    ctx.moveTo(stack[i][1][0], stack[i][1][1]);
                    ctx.lineTo(stack[i][1][0], stack[i][1][1] + stack[i][2][0] - stack[i][1][0]);
                    ctx.lineTo(stack[i][2][0], stack[i][2][0] - stack[i][1][0] + stack[i][1][1]);
                } else {
                    ctx.lineTo(stack[i][2][0], stack[i][1][1]);
                    ctx.lineTo(stack[i][2][0], -stack[i][2][0] + stack[i][1][0] + stack[i][1][1]);
                    ctx.moveTo(stack[i][1][0], stack[i][1][1]);
                    ctx.lineTo(stack[i][1][0], stack[i][1][1] - stack[i][2][0] + stack[i][1][0]);
                    ctx.lineTo(stack[i][2][0], -stack[i][2][0] + stack[i][1][0] + stack[i][1][1]);
                }  
            }
            ctx.stroke();
        }
    }
}
click_event = new CustomEvent('click');

canvasSize();
// var stateStack = [ctx.getImageData(0, 0, canvas.width, canvas.height)];
window.addEventListener('keydown', (event) => {
    console.log(event.key);
    if ((event.metaKey || event.ctrlKey)&&event.key=='z'){
        document.getElementById('undo').click();
    } else if ((event.metaKey || event.ctrlKey)&&event.key=='c'){
        lightmode = 1-lightmode;
        console.log(lightmode);
        drawCanvas(shapes);
        if (lightmode==1){
            let tools = document.getElementsByClassName("tool");
            Array.prototype.forEach.call(tools, function(tool) {
                console.log(tool);
                tool.childNode[1].stroke = "#FFFFFF";
            });
            
        } else {
            let tools = document.getElementsByClassName("tool");
            Array.prototype.forEach.call(tools, function(tool) {
                console.log(tool);
                tool.childNode[1].stroke = "#000000";
            });
        }
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
    console.log(event.target.parentElement);
    if (event.target.parentElement.tagName == "svg"){
        console.log(event.target.parentElement.parentElement);
        var element = event.target.parentElement.parentElement;
    } else if(event.target.className == "tool"){
        var element = event.target;
    } else {
        var element = event.target.parentElement;
    }
    if (element.className == "tool"){
        if (element.id == "undo"){
            console.log("undo");
            if (shapes.length > 0){
                shapes.pop();
                drawCanvas(shapes);
                localStorage.setItem("stack", JSON.stringify(shapes));
            }
            console.log(shapes);
        } else if (element.id == "clear"){
            console.log("clear");
            if (shapes.length > 0){
                shapes = [];
                drawCanvas(shapes);
                localStorage.setItem("stack", JSON.stringify(shapes));
            }
            console.log(shapes);
        } else {
            document.getElementById(mode).classList.remove("activeMode");
            mode = element.id;
            document.getElementById(mode).classList.add("activeMode");
            console.log(mode);
        }
    }
});
lineWidthSlider.addEventListener('input', (event) => {
    lineWidth = event.target.value;
    document.getElementById("displayLineWidth").innerHTML = lineWidth;
    localStorage.setItem("lineWidth", lineWidth);
});
document.getElementById("color").addEventListener('input', (event) => {
    color = event.target.value;
    localStorage.setItem("color", color);
    lineWidthSlider.style.accentColor=color;
});

canvas.addEventListener('mousedown', (event) => {
    console.log(event.clientX, event.clientY);
    drawCanvas(shapes);
    drawingRn = true;
    if (mode=="pointer"){

    } else if (mode == "brush"){
        // ctx.strokeStyle = color;
        ctx.beginPath();
        // ctx.lineWidth = lineWidth;
        // ctx.fillRect(event.clientX, event.clientY, 2, 2);
        startCoords= [];
        startCoords[0] = event.clientX;
        startCoords[1] = event.clientY;
        tempCoords[0] = event.clientX;
        tempCoords[1] = event.clientY;
        ctx.moveTo(startCoords[0], startCoords[1]);
        ctx.stroke();
        // console.log("Drawing being made");
        shapes.push([]);
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
        ctx.moveTo(event.clientX, event.clientY);
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
        // const brushShapeArr = [];
        // brushShapeArr.push("brush");
        // brushShapeArr.push([tempCoords[0], tempCoords[1]]);
        // brushShapeArr.push([event.clientX, event.clientY]);
        // brushShapeArr.push(color);
        // brushShapeArr.push(lineWidth);
        // brushShapeArr.push(brushArray);
        // shapes.push(brushShapeArr);
        brushArray = [];
    } else if (mode == "line"){
        const lineArr = [];
        lineArr.push("line");
        lineArr.push([tempCoords[0], tempCoords[1]]);
        lineArr.push([event.clientX, event.clientY]);
        lineArr.push(color);
        lineArr.push(lineWidth);
        shapes.push(lineArr);
    } else if (mode == "rect"){
        console.log("Pushing rect");
        const rectArr = [];
        rectArr.push("rect");
        rectArr.push([tempCoords[0], tempCoords[1]]);
        rectArr.push([event.clientX, event.clientY]);
        rectArr.push(color);
        rectArr.push(lineWidth);
        shapes.push(rectArr);
    } else if (mode == "square"){
        console.log("Pushing square");
        const sqArr = [];
        sqArr.push("square");
        sqArr.push([tempCoords[0], tempCoords[1]]);
        sqArr.push([event.clientX, event.clientY]);
        sqArr.push(color);
        sqArr.push(lineWidth);
        shapes.push(sqArr);
    } else if (mode == "circle"){
        console.log("Pushing circle");
        const cirArr = [];
        cirArr.push("circle");
        cirArr.push([tempCoords[0], tempCoords[1]]);
        cirArr.push([event.clientX, event.clientY]);
        cirArr.push(color);
        cirArr.push(lineWidth);
        shapes.push(cirArr);
    } else if (mode == "tri"){
        console.log("Pushing tri");
        const triArr = [];
        triArr.push("tri");
        triArr.push([tempCoords[0], tempCoords[1]]);
        triArr.push([event.clientX, event.clientY]);
        triArr.push(color);
        triArr.push(lineWidth);
        shapes.push(triArr);
    }
    console.log(JSON.stringify(shapes));
    drawCanvas(shapes);
    localStorage.setItem("stack", JSON.stringify(shapes));
    localStorage.setItem("mode", mode);
    localStorage.setItem("color", color);
    localStorage.setItem("lineWidth", lineWidth);
    
    
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
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
            ctx.moveTo(tempCoords[0], tempCoords[1]);
            ctx.lineTo(event.clientX, event.clientY);
            tempCoords[0] = event.clientX;
            tempCoords[1] = event.clientY;
            brushArray.push([event.clientX, event.clientY]);
            ctx.stroke();
            
            shapes.pop();
            const brushShapeArr = [];
            brushShapeArr.push("brush");
            brushShapeArr.push([startCoords[0], startCoords[1]]);
            brushShapeArr.push([event.clientX, event.clientY]);
            brushShapeArr.push(color);
            brushShapeArr.push(lineWidth);
            brushShapeArr.push(brushArray);
            shapes.push(brushShapeArr);
            
        } else if (mode == "line"){
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
            ctx.moveTo(tempCoords[0], tempCoords[1]);
            ctx.lineTo(event.clientX, event.clientY);
            ctx.stroke();
        } else if (mode == "rect"){
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
            ctx.moveTo(tempCoords[0], tempCoords[1]);
            ctx.lineTo(tempCoords[0], event.clientY);
            ctx.lineTo(event.clientX, event.clientY);
            ctx.moveTo(tempCoords[0], tempCoords[1]);
            ctx.lineTo(event.clientX, tempCoords[1]);
            ctx.lineTo(event.clientX, event.clientY);
            ctx.stroke();
        } else if (mode == "square"){
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
            ctx.moveTo(tempCoords[0], tempCoords[1]);
            if (Math.abs(event.clientX - tempCoords[0]) > Math.abs(event.clientY - tempCoords[1])){
                if ((event.clientX - tempCoords[0])*((event.clientY - tempCoords[1]))>0){
                    ctx.lineTo(tempCoords[0], event.clientY);
                    ctx.lineTo(event.clientY - tempCoords[1] + tempCoords[0], event.clientY);
                    ctx.moveTo(tempCoords[0], tempCoords[1]);
                    ctx.lineTo(event.clientY - tempCoords[1] + tempCoords[0], tempCoords[1]);
                    ctx.lineTo(event.clientY - tempCoords[1] + tempCoords[0], event.clientY);
                } else {
                    ctx.lineTo(tempCoords[0], event.clientY);
                    ctx.lineTo(-event.clientY + tempCoords[1] + tempCoords[0], event.clientY);
                    ctx.moveTo(tempCoords[0], tempCoords[1]);
                    ctx.lineTo(-event.clientY + tempCoords[1] + tempCoords[0], tempCoords[1]);
                    ctx.lineTo(-event.clientY + tempCoords[1] + tempCoords[0], event.clientY);
                }
            } else {
                if ((event.clientX - tempCoords[0])*((event.clientY - tempCoords[1]))>0){
                    ctx.lineTo(event.clientX, tempCoords[1]);
                    ctx.lineTo(event.clientX, event.clientX - tempCoords[0] + tempCoords[1]);
                    ctx.moveTo(tempCoords[0], tempCoords[1]);
                    ctx.lineTo(tempCoords[0], tempCoords[1] + event.clientX - tempCoords[0]);
                    ctx.lineTo(event.clientX, event.clientX - tempCoords[0] + tempCoords[1]);
                } else {
                    ctx.lineTo(event.clientX, tempCoords[1]);
                    ctx.lineTo(event.clientX, -event.clientX + tempCoords[0] + tempCoords[1]);
                    ctx.moveTo(tempCoords[0], tempCoords[1]);
                    ctx.lineTo(tempCoords[0], tempCoords[1] - event.clientX + tempCoords[0]);
                    ctx.lineTo(event.clientX, -event.clientX + tempCoords[0] + tempCoords[1]);
                }  
            }
            ctx.stroke();
            
        } else if (mode == "circle"){
            ctx.moveTo(tempCoords[0], tempCoords[1]);
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
            let diameter = Math.sqrt((event.clientX - tempCoords[0])**2 + (event.clientY - tempCoords[1])**2);
            ctx.arc((tempCoords[0]+event.clientX)/2, (tempCoords[1]+event.clientY)/2, diameter/2, 0, 2*Math.PI);
            ctx.stroke();
        } else if (mode == "tri"){
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
            ctx.moveTo(tempCoords[0], event.clientY);
            ctx.lineTo(event.clientX, event.clientY);
            ctx.lineTo((event.clientX+tempCoords[0])/2, tempCoords[1]);
            ctx.lineTo(tempCoords[0], event.clientY);
            ctx.stroke();
        }
    }
});
