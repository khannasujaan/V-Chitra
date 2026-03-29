const canvas = document.getElementById("drawCanvas");
const ctx = canvas.getContext('2d');
const toolBar = document.querySelector(".toolbar");
const lineWidthSlider = document.getElementById("lineWidthSlider");
let drawingRn = false;
let canvasDown = false;
var brushArray = [];
var redoStack = [];
var tempCoords = [0, 0];
var selected = -1;
var dragselected = 0;
var sqCoords = [];
var resize = -1;
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
if (lightmode==1){
    document.querySelector("#toggle path").setAttribute("d", "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z");
    document.querySelector("#toggle path").setAttribute("stroke", "#000000");
} else {
    document.querySelector("#toggle path").setAttribute("d", "M12 3V4M12 20V21M4 12H3M6.31412 6.31412L5.5 5.5M17.6859 6.31412L18.5 5.5M6.31412 17.69L5.5 18.5001M17.6859 17.69L18.5 18.5001M21 12H20M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z");
    document.querySelector("#toggle path").setAttribute("stroke", "#FFFFFF");
}

function distanceBtwnPoints(x1, y1, x2, y2){
    return Math.sqrt((x2-x1)**2+(y2-y1)**2);
}
function areaofTriangle(a, b, c){
    let s = (a+b+c)/2;
    return Math.sqrt(Math.abs(s*(s-a)*(s-b)*(s-c)));
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
        ctx.fillStyle = "#202020";
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
                // console.log([stack[i][5][j][0], stack[i][5][j][1]]);
                ctx.lineTo(stack[i][5][j][0], stack[i][5][j][1]);
            }
            ctx.stroke();

        } else if (stack[i][0]=="rect"){
            // console.log("Rect in array");
            ctx.beginPath();
            ctx.strokeStyle = stack[i][3];
            ctx.lineWidth = stack[i][4];
            ctx.moveTo(stack[i][1][0], stack[i][1][1]);
            ctx.strokeRect(stack[i][1][0], stack[i][1][1], stack[i][2][0]-stack[i][1][0], stack[i][2][1]-stack[i][1][1]);
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
            ctx.lineTo(stack[i][2][0], stack[i][2][1]);
            ctx.stroke();
        } else if (stack[i][0]=="square"){
            ctx.beginPath();
            ctx.strokeStyle = stack[i][3];
            ctx.lineWidth = stack[i][4];
            ctx.moveTo(stack[i][1][0], stack[i][1][1]);
            ctx.strokeRect(stack[i][1][0], stack[i][1][1], stack[i][2][0]-stack[i][1][0], stack[i][2][1] - stack[i][1][1]);
            // if (Math.abs(stack[i][2][0] - stack[i][1][0]) > Math.abs(stack[i][2][1] - stack[i][1][1])){
            //     if ((stack[i][2][0] - stack[i][1][0])*((stack[i][2][1] - stack[i][1][1]))>0){
            //         ctx.lineTo(stack[i][1][0], stack[i][2][1]);
            //         ctx.lineTo(stack[i][2][1] - stack[i][1][1] + stack[i][1][0], stack[i][2][1]);
            //         // ctx.moveTo(stack[i][1][0], stack[i][1][1]);
            //         ctx.lineTo(stack[i][2][1] - stack[i][1][1] + stack[i][1][0], stack[i][1][1]);
            //         ctx.lineTo(stack[i][1][0], stack[i][1][1]);
            //         ctx.lineTo(stack[i][1][0], stack[i][2][1]);
            //     } else {
            //         ctx.lineTo(stack[i][1][0], stack[i][2][1]);
            //         ctx.lineTo(-stack[i][2][1] + stack[i][1][1] + stack[i][1][0], stack[i][2][1]);
            //         // ctx.moveTo(stack[i][1][0], stack[i][1][1]);
            //         ctx.lineTo(-stack[i][2][1] + stack[i][1][1] + stack[i][1][0], stack[i][1][1]);
            //         ctx.lineTo(stack[i][1][0], stack[i][1][1]);
            //         ctx.lineTo(stack[i][1][0], stack[i][2][1]);
            //     }
            // } else {
            //     if ((stack[i][2][0] - stack[i][1][0])*((stack[i][2][1] - stack[i][1][1]))>0){
            //         ctx.lineTo(stack[i][2][0], stack[i][1][1]);
            //         ctx.lineTo(stack[i][2][0], stack[i][2][0] - stack[i][1][0] + stack[i][1][1]);
            //         // ctx.moveTo(stack[i][1][0], stack[i][1][1]);
            //         ctx.lineTo(stack[i][1][0], stack[i][1][1] + stack[i][2][0] - stack[i][1][0]);
            //         ctx.lineTo(stack[i][1][0], stack[i][1][1]);
            //         ctx.lineTo(stack[i][2][0], stack[i][1][1]);
            //     } else {
            //         ctx.lineTo(stack[i][2][0], stack[i][1][1]);
            //         ctx.lineTo(stack[i][2][0], -stack[i][2][0] + stack[i][1][0] + stack[i][1][1]);
            //         // ctx.moveTo(stack[i][1][0], stack[i][1][1]);
            //         ctx.lineTo(stack[i][1][0], stack[i][1][1] - stack[i][2][0] + stack[i][1][0]);
            //         ctx.lineTo(stack[i][1][0], stack[i][1][1]);
            //         ctx.lineTo(stack[i][2][0], stack[i][1][1]);
            //     }  
            // }
            ctx.stroke();
        } else if (stack[i][0]=="clear"){
            if (lightmode==1){
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.beginPath();
                ctx.fillStyle = "#202020";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.stroke();
            }
        } else if (stack[i][0]=="text"){
            if (stack[i][5]==""){continue;}
            ctx.beginPath();
            ctx.strokeStyle = stack[i][3];
            // ctx.lineWidth = 1;
            // ctx.moveTo(stack[i][1][0], stack[i][1][1]);
            // ctx.strokeRect(stack[i][1][0], stack[i][1][1], stack[i][2][0]-stack[i][1][0], stack[i][2][1]-stack[i][1][1]);
            ctx.fillStyle = stack[i][3];
            ctx.font = `${4*stack[i][4]}px Arial`;
            ctx.fillText(stack[i][5], stack[i][1][0]+2, stack[i][1][1]-3);
            ctx.stroke();
        } else if (stack[i][0]=="img"){
            const img = new Image();
            img.src = stack[i][3]
            let w = Math.abs(stack[i][2][0]-stack[i][1][0]);
            let h = Math.abs(stack[i][2][1]-stack[i][1][1]);
            if (img.complete) {
                ctx.drawImage(img, Math.min(stack[i][1][0], stack[i][2][0]), Math.min(stack[i][1][1], stack[i][2][1]), w, h);
            } else {
                img.onload = () => {
                    ctx.drawImage(img, Math.min(stack[i][1][0], stack[i][2][0]), Math.min(stack[i][1][1], stack[i][2][1]), w, h);
                }
            }
            ctx.stroke();
        }
    }
    if (selected != -1){
        ctx.beginPath()
        ctx.lineWidth=1;
        ctx.setLineDash([6]);
        if (lightmode==1){
            ctx.strokeStyle = "#000000";
            ctx.fillStyle = "#000000";
        } else {
            ctx.strokeStyle = "#FFFFFF";
            ctx.fillStyle = "#FFFFFF";
        }
        if (stack[selected][0]=="rect" || stack[selected][0]=="tri" || stack[selected][0]=="line" || stack[selected][0]=="img"){
            ctx.strokeRect(stack[selected][1][0], stack[selected][1][1], stack[selected][2][0]-stack[selected][1][0], stack[selected][2][1]-stack[selected][1][1]);
            ctx.beginPath();
            ctx.arc(stack[selected][1][0], stack[selected][1][1], 10, 0, 2*Math.PI);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(stack[selected][2][0], stack[selected][2][1], 10, 0, 2*Math.PI);
            ctx.stroke();
        } else if (stack[selected][0]=="circle"){
            let r0 = Math.sqrt((stack[selected][2][0]-stack[selected][1][0])**2+(stack[selected][2][1]-stack[selected][1][1])**2)/2;
            ctx.strokeRect((stack[selected][1][0]+stack[selected][2][0])/2-r0, (stack[selected][1][1]+stack[selected][2][1])/2-r0, 2*r0, 2*r0);
            ctx.beginPath();
            ctx.arc(stack[selected][1][0], stack[selected][1][1], 10, 0, 2*Math.PI);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(stack[selected][2][0], stack[selected][2][1], 10, 0, 2*Math.PI);
            ctx.stroke();
        } else if (stack[selected][0]=="square"){
            ctx.strokeRect(Math.min(stack[selected][1][0], stack[selected][2][0]), Math.min(stack[selected][1][1], stack[selected][2][1]), Math.min(Math.abs(stack[selected][1][0]-stack[selected][2][0])), Math.min(Math.abs(stack[selected][1][1]-stack[selected][2][1])));
            ctx.beginPath();
            ctx.arc(stack[selected][1][0], stack[selected][1][1], 10, 0, 2*Math.PI);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(stack[selected][2][0], stack[selected][2][1], 10, 0, 2*Math.PI);
            ctx.stroke();
        } else if (stack[selected][0]=="brush"){
            let minX=stack[selected][1][0], minY=stack[selected][1][1], maxX=stack[selected][1][0], maxY=stack[selected][1][1];
            for (let i = 0; i < stack[selected][5].length-1; i++){
                minX = (minX > stack[selected][5][i][0]) ? stack[selected][5][i][0] : minX;
                maxX = (maxX < stack[selected][5][i][0]) ? stack[selected][5][i][0] : maxX;
                minY = (minY > stack[selected][5][i][1]) ? stack[selected][5][i][1] : minY;
                maxY = (maxY < stack[selected][5][i][1]) ? stack[selected][5][i][1] : maxY;
            }
            ctx.strokeRect(minX, minY, (maxX-minX), (maxY-minY));
            console.log(minX, minY, maxX, maxY);
        } else if (stack[selected][0]=="text"){
            ctx.font = `${4*shapes[selected][4]}px Arial`;
            let w = ctx.measureText(stack[selected][5])
            ctx.lineWidth=1;
            ctx.strokeRect(stack[selected][1][0], stack[selected][1][1], w.width, -4*shapes[selected][4]);
        }
        ctx.setLineDash([0]);
    }
}
canvasSize();
window.addEventListener("resize", canvasSize);
// var stateStack = [ctx.getImageData(0, 0, canvas.width, canvas.height)];
window.addEventListener('keydown', (event) => {
    console.log(event.key);
    if ((event.metaKey || event.ctrlKey)&&(event.shiftKey)&&event.key=='z'){
    document.getElementById('redo').click();
    } else if ((event.metaKey || event.ctrlKey)&&event.key=='z'){
        document.getElementById('undo').click();
    } else if ((mode!="text")&&(selected!=-1&&event.key=="Backspace")&&(shapes[selected][0]!="text")){
        shapes.splice(selected, 1);
        localStorage.setItem("stack", JSON.stringify(shapes));
        selected = -1;
        drawCanvas(shapes);
    } else if (selected!=-1&&event.key=="Delete"){
        shapes.splice(selected, 1);
        localStorage.setItem("stack", JSON.stringify(shapes));
        selected = -1;
        drawCanvas(shapes);
    } else if ((event.metaKey || event.ctrlKey)&&event.key=='c'){
        
    }
    else if ((mode=="text" || mode=="pointer")&&(selected!=-1)){
        if ("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-=+!@#$%^&*(){}][\\|;':\"<>?,./`~ ".includes(event.key)){
            shapes[selected][5]+=event.key;
            localStorage.setItem("stack", JSON.stringify(shapes));
            drawCanvas(shapes);
        } else if (event.key == "Backspace"){
            shapes[selected][5]=shapes[selected][5].slice(0, -1);
            localStorage.setItem("stack", JSON.stringify(shapes));
            drawCanvas(shapes);
        }
    } else {
        if (event.key == 'p'){
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
                redoStack.push(shapes[shapes.length-1]);
                if (shapes.length-1==selected){
                    selected=-1;
                }
                shapes.pop();
                drawCanvas(shapes);
                localStorage.setItem("stack", JSON.stringify(shapes));
            }
            console.log(shapes);
        } else if (element.id == "redo"){
            console.log("redo");
            if (redoStack.length > 0){
                shapes.push(redoStack[redoStack.length-1]);
                redoStack.pop();
                drawCanvas(shapes);
                localStorage.setItem("stack", JSON.stringify(shapes));
            }
            console.log(shapes);
        } else if (element.id == "clear"){
            console.log("clear");
            if (shapes.length > 0){
                shapes.push(["clear"]);
                drawCanvas(shapes);
                console.log(shapes);
                localStorage.setItem("stack", JSON.stringify(shapes));
            }
        } else if (element.id == "toggle"){
            console.log("toggle");
            lightmode = 1-lightmode;
            localStorage.setItem("lightmode", lightmode);
            console.log(lightmode);
            drawCanvas(shapes);
            if (lightmode==1){
                document.querySelector("#toggle path").setAttribute("d", "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z");
                document.querySelector("#toggle path").setAttribute("stroke", "#000000");
            } else {
                document.querySelector("#toggle path").setAttribute("d", "M12 3V4M12 20V21M4 12H3M6.31412 6.31412L5.5 5.5M17.6859 6.31412L18.5 5.5M6.31412 17.69L5.5 18.5001M17.6859 17.69L18.5 18.5001M21 12H20M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z");
                document.querySelector("#toggle path").setAttribute("stroke", "#FFFFFF");
            }
        } else {
            document.getElementById(mode).classList.remove("activeMode");
            if (mode=="text"){
                if (shapes[shapes.length-1][5] == ""){
                    shapes.pop();
                    localStorage.setItem("stack", JSON.stringify(shapes));
                }
                selected = -1;
                drawCanvas(shapes);
            } else if (mode=="pointer"){
                selected = -1;
                drawCanvas(shapes);
            }
            mode = element.id;
            document.getElementById(mode).classList.add("activeMode");
            console.log(mode);
            localStorage.setItem("mode", mode);
        }
    }
});
lineWidthSlider.addEventListener('input', (event) => {
    lineWidth = event.target.value;
    document.getElementById("displayLineWidth").innerHTML = lineWidth;
    localStorage.setItem("lineWidth", lineWidth);
    if (selected!=-1){
        shapes[selected][4] = lineWidth;
        drawCanvas(shapes);
    }
});
document.getElementById("color").addEventListener('input', (event) => {
    color = event.target.value;
    localStorage.setItem("color", color);
    lineWidthSlider.style.accentColor=color;
    if (selected!=-1){
        shapes[selected][3] = color;
        drawCanvas(shapes);
    }
});

function getCoords(event) {
    if (event.touches && event.touches.length > 0) {
        return { clientX: event.touches[0].clientX, clientY: event.touches[0].clientY };
    } else if (event.changedTouches && event.changedTouches.length > 0) {
        return { clientX: event.changedTouches[0].clientX, clientY: event.changedTouches[0].clientY };
    }
    return { clientX: event.clientX, clientY: event.clientY };
}

function mouseTouchStart(event) {
    const { clientX, clientY } = getCoords(event);
    drawCanvas(shapes);
    drawingRn = true;
    canvasDown = true;
    redoStack=[];
    if (mode=="pointer"){
        let found = -1;
        if (selected!=-1){
            if (shapes[selected][0]=="line" || shapes[selected][0]=="rect" || shapes[selected][0]=="square" || shapes[selected][0]=="tri" || shapes[selected][0]=="circle"||shapes[selected][0]=="img"){
                if (distanceBtwnPoints(clientX, clientY, shapes[selected][1][0], shapes[selected][1][1]) < 10){
                    resize = 1; //top left
                    found = 1;
                    console.log("resize 1");
                } else if (distanceBtwnPoints(clientX, clientY, shapes[selected][2][0], shapes[selected][2][1]) < 10){
                    resize = 2; // bottomright
                    found = 1;
                    console.log("resize 2");
                }
            }
        }
        if (found==-1){
            for (let i = shapes.length-1; i>=0; i--){
                console.log("pointer");
                if (shapes[i][0]=="clear"){
                    break; 
                } else if (shapes[i][0]=="line"){
                    let a = areaofTriangle(distanceBtwnPoints(shapes[i][1][0], shapes[i][1][1], shapes[i][2][0], shapes[i][2][1]), distanceBtwnPoints(clientX, clientY, shapes[i][1][0], shapes[i][1][1]), distanceBtwnPoints(clientX, clientY, shapes[i][2][0], shapes[i][2][1]));
                    console.log(a);
                    if ((a/distanceBtwnPoints(shapes[i][1][0], shapes[i][1][1], shapes[i][2][0], shapes[i][2][1]))<1){
                        selected = i;
                        found = 1;
                        break;
                    }
                } else if (shapes[i][0]=="brush"){
                    for (let j = shapes[i][5].length-1; j > 0; j--){
                        let a = areaofTriangle(distanceBtwnPoints(shapes[i][5][j][0], shapes[i][5][j][1], shapes[i][5][j - 1][0], shapes[i][5][j - 1][1]), distanceBtwnPoints(clientX, clientY, shapes[i][5][j][0], shapes[i][5][j][1]), distanceBtwnPoints(clientX, clientY, shapes[i][5][j - 1][0], shapes[i][5][j - 1][1]));
                        console.log(a);
                        if ((a/distanceBtwnPoints(shapes[i][5][j][0], shapes[i][5][j][1], shapes[i][5][j - 1][0], shapes[i][5][j - 1][1])) < 1) {
                            selected = i;
                            found = 1;
                            break;
                        }
                    }
                } else if (shapes[i][0]=="square"){
                    if ((clientX)>Math.min(shapes[i][1][0], shapes[i][2][0])&&
                    (clientX)<Math.max(shapes[i][1][0], shapes[i][2][0])&&
                    (clientY)>Math.min(shapes[i][1][1], shapes[i][2][1])&&
                    (clientY)<Math.max(shapes[i][1][1], shapes[i][2][1])){
                        selected = i;
                        found = 1;
                        break;
                    }
                } else if (shapes[i][0]=="rect"){
                    if ((clientX)>Math.min(shapes[i][1][0], shapes[i][2][0])&&
                    (clientX)<Math.max(shapes[i][1][0], shapes[i][2][0])&&
                    (clientY)>Math.min(shapes[i][1][1], shapes[i][2][1])&&
                    (clientY)<Math.max(shapes[i][1][1], shapes[i][2][1])){
                        selected = i;
                        found = 1;
                        break;
                    }
                } else if (shapes[i][0]=="circle"){
                    let r0 = Math.sqrt((shapes[i][2][0]-shapes[i][1][0])**2+(shapes[i][2][1]-shapes[i][1][1])**2)/2;
                    let r = Math.sqrt((clientX - shapes[i][1][0]/2 - shapes[i][2][0]/2)**2+(clientY - shapes[i][1][1]/2 - shapes[i][2][1]/2)**2);
                    if (r<r0){
                        selected = i;
                        found = 1;
                        break;
                    }
                } else if (shapes[i][0]=="tri"){
                    let areaofT = areaofTriangle(shapes[i][2][0] - shapes[i][1][0], distanceBtwnPoints(shapes[i][2][0], shapes[i][2][1], shapes[i][1][0] / 2 + shapes[i][2][0] / 2, shapes[i][1][1]), distanceBtwnPoints(shapes[i][2][0], shapes[i][2][1], shapes[i][1][0] / 2 + shapes[i][2][0] / 2, shapes[i][1][1]));
                    let a1 = areaofTriangle(distanceBtwnPoints(shapes[i][1][0] / 2 + shapes[i][2][0] / 2, shapes[i][1][1], clientX, clientY), distanceBtwnPoints(clientX, clientY, shapes[i][2][0], shapes[i][2][1]), distanceBtwnPoints(shapes[i][2][0], shapes[i][2][1], shapes[i][1][0] / 2 + shapes[i][2][0] / 2, shapes[i][1][1]));
                    let a2 = areaofTriangle(shapes[i][2][0] - shapes[i][1][0], distanceBtwnPoints(clientX, clientY, shapes[i][2][0], shapes[i][2][1]), distanceBtwnPoints(clientX, clientY, shapes[i][1][0], shapes[i][2][1]));
                    let a3 = areaofTriangle(distanceBtwnPoints(shapes[i][1][0] / 2 + shapes[i][2][0] / 2, shapes[i][1][1], clientX, clientY), distanceBtwnPoints(shapes[i][2][0], shapes[i][2][1], shapes[i][1][0] / 2 + shapes[i][2][0] / 2, shapes[i][1][1]), distanceBtwnPoints(clientX, clientY, shapes[i][1][0], shapes[i][2][1]));
                    if ((a1 + a2 + a3 - areaofT)<1){
                        selected = i;
                        found = 1;
                        break;
                    }
                } else if (shapes[i][0]=="text"){
                    ctx.font = `${4*shapes[i][4]}px Arial`;
                    if ((clientX)>shapes[i][1][0]&&
                    (clientX)<(shapes[i][1][0]+ctx.measureText(shapes[i][5]).width)&&
                    (clientY)>(shapes[i][1][1]-4*shapes[i][4])&&
                    (clientY)<shapes[i][1][1]){
                        selected = i;
                        found = 1;
                        break;
                    }
                } else if (shapes[i][0]=="img"){
                    if ((clientX)>Math.min(shapes[i][1][0], shapes[i][2][0])&&
                    (clientX)<Math.max(shapes[i][1][0], shapes[i][2][0])&&
                    (clientY)>Math.min(shapes[i][1][1], shapes[i][2][1])&&
                    (clientY)<Math.max(shapes[i][1][1], shapes[i][2][1])){
                        selected = i;
                        found = 1;
                        break;
                    }
                }
            }
        }
        if (found == 1){
            tempCoords[1] = clientY;
            tempCoords[0] = clientX;
            dragselected = 1;
            if (shapes[selected][0]!="img"){
                lineWidth = shapes[selected][4];
                document.getElementById("lineWidthSlider").value = shapes[selected][4];
                document.getElementById("displayLineWidth").innerHTML = shapes[selected][4];
                localStorage.setItem("lineWidth", lineWidth);
                color = shapes[selected][3];
                document.getElementById("color").value = color;
                localStorage.setItem("color", color);
                lineWidthSlider.style.accentColor=color;
            }

        } else {
            selected = -1;
        }
    } else if (mode == "brush"){
        ctx.beginPath();
        startCoords= [];
        startCoords[0] = clientX;
        startCoords[1] = clientY;
        tempCoords[0] = clientX;
        tempCoords[1] = clientY;
        ctx.moveTo(startCoords[0], startCoords[1]);
        ctx.stroke();
        shapes.push([]);
    } else if (mode == "line" || mode == "rect" || mode == "square" || mode == "circle" || mode == "tri" || mode == "img" || mode == "text") {
        ctx.strokeStyle = color;
        ctx.beginPath();
        tempCoords[0] = clientX;
        tempCoords[1] = clientY;
        ctx.lineWidth = lineWidth;
        if (mode == "line" || mode == "rect" || mode == "square" || mode == "circle") {
            ctx.moveTo(clientX, clientY);
        }
        console.log("Drawing being made");
    }
    drawCanvas(shapes);
}

function mouseTouchEnd(event) {
    if (canvasDown){
        canvasDown = false;
    } else {
        return;
    }
    const { clientX, clientY } = getCoords(event);
    drawingRn = false;
    drawCanvas(shapes);
    console.log("Drawing stopped");
    if (mode=="pointer"){
        if (resize!=-1){
            resize = -1;
            drawCanvas(shapes);
        }
        if (dragselected==1){
            dragselected = 0;
            console.log("dragslected zero");
            drawCanvas(shapes);
        }
    } else if (mode == 'brush'){
        brushArray = [];
    } else if (mode == "line"){
        const lineArr = [];
        lineArr.push("line");
        lineArr.push([tempCoords[0], tempCoords[1]]);
        lineArr.push([clientX, clientY]);
        lineArr.push(color);
        lineArr.push(lineWidth);
        shapes.push(lineArr);
    } else if (mode == "rect"){
        console.log("Pushing rect");
        const rectArr = [];
        rectArr.push("rect");
        rectArr.push([tempCoords[0], tempCoords[1]]);
        rectArr.push([clientX, clientY]);
        rectArr.push(color);
        rectArr.push(lineWidth);
        shapes.push(rectArr);
    } else if (mode == "square"){
        console.log("Pushing square");
        const sqArr = [];
        sqArr.push("square");
        sqArr.push([tempCoords[0], tempCoords[1]]);
        sqArr.push([sqCoords[0], sqCoords[1]]);
        sqArr.push(color);
        sqArr.push(lineWidth);
        shapes.push(sqArr);
    } else if (mode == "circle"){
        console.log("Pushing circle");
        const cirArr = [];
        cirArr.push("circle");
        cirArr.push([tempCoords[0], tempCoords[1]]);
        cirArr.push([clientX, clientY]);
        cirArr.push(color);
        cirArr.push(lineWidth);
        shapes.push(cirArr);
    } else if (mode == "tri"){
        console.log("Pushing tri");
        const triArr = [];
        triArr.push("tri");
        triArr.push([tempCoords[0], tempCoords[1]]);
        triArr.push([clientX, clientY]);
        triArr.push(color);
        triArr.push(lineWidth);
        shapes.push(triArr);
    } else if (mode == "text"){
        console.log("Pushing text");
        const textArr = [];
        textArr.push("text");
        textArr.push([tempCoords[0], tempCoords[1]]);
        textArr.push([tempCoords[0]+200, tempCoords[1]-4*lineWidth]);
        textArr.push(color);
        textArr.push(lineWidth);
        textArr.push("");
        shapes.push(textArr);
        selected = shapes.length-1;
    } else if (mode == "img"){
        console.log("Pushing img");
        const imgArr = [];
        imgArr.push("img");
        imgArr.push([tempCoords[0], tempCoords[1]]);
        imgArr.push([clientX, clientY]);
        imgArr.push(`https://picsum.photos/id/${(Math.floor(Math.random() * 101) + 1)}/${Math.abs(tempCoords[0] - clientX)}/${Math.abs(tempCoords[1] - clientY)}`);
        shapes.push(imgArr);
    }
    console.log(JSON.stringify(shapes));
    drawCanvas(shapes);
    localStorage.setItem("stack", JSON.stringify(shapes));
    localStorage.setItem("mode", mode);
    localStorage.setItem("color", color);
    localStorage.setItem("lineWidth", lineWidth);
}

function mouseTouchMove(event) {
    if (drawingRn!=1) return;
    
    const {clientX, clientY} = getCoords(event);
    console.log("pointer moving");
    drawCanvas(shapes);

    if (mode=="pointer"){
        if (resize!=-1){
            if (shapes[selected][0]=="square"){
                if (resize==1){
                    shapes[selected][1][0] += (clientX-tempCoords[0]);
                    shapes[selected][1][1] += (clientX-tempCoords[0]);
                    tempCoords[0]=clientX;
                    tempCoords[1]=clientY;
                    drawCanvas(shapes);
                } else if (resize==2){
                    shapes[selected][2][0] += (clientX-tempCoords[0]);
                    shapes[selected][2][1] += (clientX-tempCoords[0]);
                    tempCoords[0]=clientX;
                    tempCoords[1]=clientY;
                    drawCanvas(shapes);
                }
            } else {
                if (resize==1){
                    shapes[selected][1][0] += (clientX-tempCoords[0]);
                    shapes[selected][1][1] += (clientY-tempCoords[1]);
                    tempCoords[0]=clientX;
                    tempCoords[1]=clientY;
                    drawCanvas(shapes);
                } else if (resize==2){
                    shapes[selected][2][0] += (clientX-tempCoords[0]);
                    shapes[selected][2][1] += (clientY-tempCoords[1]);
                    tempCoords[0]=clientX;
                    tempCoords[1]=clientY;
                    drawCanvas(shapes);
                }
            }
        } else if (dragselected==1){
            if (shapes[selected][0]!="brush") {
                shapes[selected][1][0] += (clientX-tempCoords[0]);
                shapes[selected][1][1] += (clientY-tempCoords[1]);
                shapes[selected][2][0] += (clientX-tempCoords[0]);
                shapes[selected][2][1] += (clientY-tempCoords[1]);
                tempCoords[0]=clientX;
                tempCoords[1]=clientY;
                drawCanvas(shapes);
            } else {
                shapes[selected][1][0] += (clientX-tempCoords[0]);
                shapes[selected][1][1] += (clientY-tempCoords[1]);
                for (let j = shapes[selected][5].length - 1; j >= 0; j--) {
                    shapes[selected][5][j][0] += (clientX-tempCoords[0]);
                    shapes[selected][5][j][1] += (clientY-tempCoords[1]);
                }
                tempCoords[0]=clientX;
                tempCoords[1]=clientY;
            }
        }
    } else if (mode == 'brush'){
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.moveTo(tempCoords[0], tempCoords[1]);
        ctx.lineTo(clientX, clientY);
        tempCoords[0] = clientX;
        tempCoords[1] = clientY;
        brushArray.push([clientX, clientY]);
        ctx.stroke();

        shapes.pop();
        const brushShapeArr = [];
        brushShapeArr.push("brush");
        brushShapeArr.push([startCoords[0], startCoords[1]]);
        brushShapeArr.push([clientX, clientY]);
        brushShapeArr.push(color);
        brushShapeArr.push(lineWidth);
        brushShapeArr.push(brushArray);
        shapes.push(brushShapeArr);

    } else if (mode == "line"){
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.moveTo(tempCoords[0], tempCoords[1]);
        ctx.lineTo(clientX, clientY);
        ctx.stroke();
    } else if (mode == "rect"){
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.moveTo(tempCoords[0], tempCoords[1]);
        ctx.strokeRect(tempCoords[0], tempCoords[1], clientX - tempCoords[0], clientY - tempCoords[1]);
    } else if (mode == "square"){
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.moveTo(tempCoords[0], tempCoords[1]);
        if (Math.abs(clientX - tempCoords[0]) > Math.abs(clientY - tempCoords[1])){
            if ((clientX - tempCoords[0]) * ((clientY - tempCoords[1])) > 0) {
                ctx.lineTo(tempCoords[0], clientY);
                ctx.lineTo(clientY - tempCoords[1] + tempCoords[0], clientY);
                ctx.lineTo(clientY - tempCoords[1] + tempCoords[0], tempCoords[1]);
                ctx.lineTo(tempCoords[0], tempCoords[1]);
                ctx.lineTo(tempCoords[0], clientY);
                sqCoords[0] = clientY - tempCoords[1] + tempCoords[0];
                sqCoords[1] = clientY;
            } else {
                ctx.lineTo(tempCoords[0], clientY);
                ctx.lineTo(-clientY + tempCoords[1] + tempCoords[0], clientY);
                ctx.lineTo(-clientY + tempCoords[1] + tempCoords[0], tempCoords[1]);
                ctx.lineTo(tempCoords[0], tempCoords[1]);
                ctx.lineTo(tempCoords[0], clientY);
                sqCoords[0] = -clientY + tempCoords[1] + tempCoords[0];
                sqCoords[1] = clientY;
            }
        } else {
            if ((clientX - tempCoords[0]) * ((clientY - tempCoords[1])) > 0){
                ctx.lineTo(clientX, tempCoords[1]);
                ctx.lineTo(clientX, clientX - tempCoords[0] + tempCoords[1]);
                ctx.lineTo(tempCoords[0], tempCoords[1] + clientX - tempCoords[0]);
                ctx.lineTo(tempCoords[0], tempCoords[1]);
                ctx.lineTo(clientX, tempCoords[1]);
                sqCoords[0] = clientX;
                sqCoords[1] = clientX - tempCoords[0] + tempCoords[1];
            } else {
                ctx.lineTo(clientX, tempCoords[1]);
                ctx.lineTo(clientX, -clientX + tempCoords[0] + tempCoords[1]);
                ctx.lineTo(tempCoords[0], tempCoords[1] - clientX + tempCoords[0]);
                ctx.lineTo(tempCoords[0], tempCoords[1]);
                ctx.lineTo(clientX, tempCoords[1]);
                sqCoords[0] = clientX;
                sqCoords[1] = -clientX + tempCoords[0] + tempCoords[1];
            }
        }
        ctx.stroke();

    } else if (mode == "circle"){
        ctx.moveTo(tempCoords[0], tempCoords[1]);
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        let diameter = Math.sqrt((clientX - tempCoords[0])**2+(clientY - tempCoords[1])**2);
        ctx.arc((tempCoords[0] + clientX)/2, (tempCoords[1] + clientY)/2, diameter/2, 0, 2*Math.PI);
        ctx.stroke();
    } else if (mode == "tri"){
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.moveTo(tempCoords[0], clientY);
        ctx.lineTo(clientX, clientY);
        ctx.lineTo((clientX + tempCoords[0]) / 2, tempCoords[1]);
        ctx.lineTo(tempCoords[0], clientY);
        ctx.lineTo(clientX, clientY);
        ctx.stroke();
    } else if (mode == "img"){
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.moveTo(tempCoords[0], tempCoords[1]);
        ctx.strokeRect(tempCoords[0], tempCoords[1], clientX - tempCoords[0], clientY - tempCoords[1]);
    }
}


canvas.addEventListener('mousedown', mouseTouchStart);
window.addEventListener('mousemove', mouseTouchMove);
window.addEventListener('mouseup', mouseTouchEnd);

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault(); 
    mouseTouchStart(e);
});

window.addEventListener('touchmove', (e) => {
    if (drawingRn) e.preventDefault(); 
    mouseTouchMove(e);
});

window.addEventListener('touchend', (e) => {
    mouseTouchEnd(e);
});