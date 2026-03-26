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
    return Math.sqrt(s*(s-a)*(s-b)*(s-c));
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
                    // ctx.moveTo(stack[i][1][0], stack[i][1][1]);
                    ctx.lineTo(stack[i][2][1] - stack[i][1][1] + stack[i][1][0], stack[i][1][1]);
                    ctx.lineTo(stack[i][1][0], stack[i][1][1]);
                    ctx.lineTo(stack[i][1][0], stack[i][2][1]);
                } else {
                    ctx.lineTo(stack[i][1][0], stack[i][2][1]);
                    ctx.lineTo(-stack[i][2][1] + stack[i][1][1] + stack[i][1][0], stack[i][2][1]);
                    // ctx.moveTo(stack[i][1][0], stack[i][1][1]);
                    ctx.lineTo(-stack[i][2][1] + stack[i][1][1] + stack[i][1][0], stack[i][1][1]);
                    ctx.lineTo(stack[i][1][0], stack[i][1][1]);
                    ctx.lineTo(stack[i][1][0], stack[i][2][1]);
                }
            } else {
                if ((stack[i][2][0] - stack[i][1][0])*((stack[i][2][1] - stack[i][1][1]))>0){
                    ctx.lineTo(stack[i][2][0], stack[i][1][1]);
                    ctx.lineTo(stack[i][2][0], stack[i][2][0] - stack[i][1][0] + stack[i][1][1]);
                    // ctx.moveTo(stack[i][1][0], stack[i][1][1]);
                    ctx.lineTo(stack[i][1][0], stack[i][1][1] + stack[i][2][0] - stack[i][1][0]);
                    ctx.lineTo(stack[i][1][0], stack[i][1][1]);
                    ctx.lineTo(stack[i][2][0], stack[i][1][1]);
                } else {
                    ctx.lineTo(stack[i][2][0], stack[i][1][1]);
                    ctx.lineTo(stack[i][2][0], -stack[i][2][0] + stack[i][1][0] + stack[i][1][1]);
                    // ctx.moveTo(stack[i][1][0], stack[i][1][1]);
                    ctx.lineTo(stack[i][1][0], stack[i][1][1] - stack[i][2][0] + stack[i][1][0]);
                    ctx.lineTo(stack[i][1][0], stack[i][1][1]);
                    ctx.lineTo(stack[i][2][0], stack[i][1][1]);
                }  
            }
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
        ctx.strokeStyle = "#000000";
        if (stack[selected][0]=="rect" || stack[selected][0]=="tri" || stack[selected][0]=="line" || stack[selected][0]=="img"){
            ctx.strokeRect(stack[selected][1][0], stack[selected][1][1], stack[selected][2][0]-stack[selected][1][0], stack[selected][2][1]-stack[selected][1][1]);
        } else if (stack[selected][0]=="circle"){
            let r0 = Math.sqrt((stack[selected][2][0]-stack[selected][1][0])**2+(stack[selected][2][1]-stack[selected][1][1])**2)/2;
            ctx.strokeRect((stack[selected][1][0]+stack[selected][2][0])/2-r0, (stack[selected][1][1]+stack[selected][2][1])/2-r0, 2*r0, 2*r0);
        } else if (stack[selected][0]=="square"){
            ctx.strokeRect(Math.min(stack[selected][1][0], stack[selected][2][0]), Math.min(stack[selected][1][1], stack[selected][2][1]), Math.min(Math.abs(stack[selected][1][0]-stack[selected][2][0])), Math.min(Math.abs(stack[selected][1][1]-stack[selected][2][1])));
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
            ctx.strokeStyle = "#000000";
            ctx.strokeRect(stack[selected][1][0], stack[selected][1][1], w.width, -4*shapes[selected][4]);
        }
    }
    ctx.setLineDash([0]);
}
click_event = new CustomEvent('click');

canvasSize();
// var stateStack = [ctx.getImageData(0, 0, canvas.width, canvas.height)];
window.addEventListener('keydown', (event) => {
    console.log(event.key);
    if ((event.metaKey || event.ctrlKey)&&(event.shiftKey)&&event.key=='z'){
    document.getElementById('redo').click();
    } else if ((event.metaKey || event.ctrlKey)&&event.key=='z'){
        document.getElementById('undo').click();
    } else if ((mode!="text")&&(selected!=-1&&event.key=="Backspace")&&(shapes[selected][0]!="text")){
        shapes.splice(selected, 1);
        localStorage.setItem("stack", shapes)
        selected = -1;
        drawCanvas(shapes);
    } else if (selected!=-1&&event.key=="Delete"){
        shapes.splice(selected, 1);
        localStorage.setItem("stack", shapes)
        selected = -1;
        drawCanvas(shapes);
    } else if ((event.metaKey || event.ctrlKey)&&event.key=='c'){
        
    }
    else if ((mode=="text" || mode=="pointer")&&(selected!=-1)){
        if ("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-=+!@#$%^&*(){}][\\|;':\"<>?,./`~ ".includes(event.key)){
            shapes[selected][5]+=event.key;
            drawCanvas(shapes);
        } else if (event.key == "Backspace"){
            shapes[selected][5]=shapes[selected][5].slice(0, -1);
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
            } else if (mode=="pointer"){
                selected = -1;
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
});
document.getElementById("color").addEventListener('input', (event) => {
    color = event.target.value;
    localStorage.setItem("color", color);
    lineWidthSlider.style.accentColor=color;
});

canvas.addEventListener('mousedown', (event) => {
    // console.log(event.clientX, event.clientY);
    drawCanvas(shapes);
    drawingRn = true;
    canvasDown = true;
    redoStack=[];
    if (mode=="pointer"){
        let found = -1;
        // if ((selected!=-1)&&(shapes[selected]))
        for (let i = shapes.length-1; i>=0; i--){
            console.log("pointer");
            if (shapes[i][0]=="clear"){
                continue;
            } else if (shapes[i][0]=="line"){
                let a = areaofTriangle(distanceBtwnPoints(shapes[i][1][0], shapes[i][1][1], shapes[i][2][0], shapes[i][2][1]), distanceBtwnPoints(event.clientX, event.clientY, shapes[i][1][0], shapes[i][1][1]), distanceBtwnPoints(event.clientX, event.clientY, shapes[i][2][0], shapes[i][2][1]));
                console.log(a);
                if ((a/distanceBtwnPoints(shapes[i][1][0], shapes[i][1][1], shapes[i][2][0], shapes[i][2][1]))<1){
                    selected = i;
                    found = 1;
                    break;
                }
            } else if (shapes[i][0]=="brush"){
                for (let j = shapes[i][5].length-1; j > 0; j--){
                    let a = areaofTriangle(distanceBtwnPoints(shapes[i][5][j][0], shapes[i][5][j][1], shapes[i][5][j-1][0], shapes[i][5][j-1][1]), distanceBtwnPoints(event.clientX, event.clientY, shapes[i][5][j][0], shapes[i][5][j][1]), distanceBtwnPoints(event.clientX, event.clientY, shapes[i][5][j-1][0], shapes[i][5][j-1][1]));
                    console.log(a);
                    if ((a/distanceBtwnPoints(shapes[i][5][j][0], shapes[i][5][j][1], shapes[i][5][j-1][0], shapes[i][5][j-1][1]))<1){
                        selected = i;
                        found = 1;
                        break;
                    }

                }
            } else if (shapes[i][0]=="square"){
                if ((event.clientX)>Math.min(shapes[i][1][0], shapes[i][2][0])&&
                (event.clientX)<Math.max(shapes[i][1][0], shapes[i][2][0])&&
                (event.clientY)>Math.min(shapes[i][1][1], shapes[i][2][1])&&
                (event.clientY)<Math.max(shapes[i][1][1], shapes[i][2][1])){
                    selected = i;
                    found =1 ;
                    break;
                }
            } else if (shapes[i][0]=="rect"){
                if ((event.clientX)>Math.min(shapes[i][1][0], shapes[i][2][0])&&
                (event.clientX)<Math.max(shapes[i][1][0], shapes[i][2][0])&&
                (event.clientY)>Math.min(shapes[i][1][1], shapes[i][2][1])&&
                (event.clientY)<Math.max(shapes[i][1][1], shapes[i][2][1])){
                    selected = i;
                    found =1 ;
                    break;
                }
            } else if (shapes[i][0]=="circle"){
                let r0 = Math.sqrt((shapes[i][2][0]-shapes[i][1][0])**2+(shapes[i][2][1]-shapes[i][1][1])**2)/2;
                let r = Math.sqrt((event.clientX-shapes[i][1][0]/2-shapes[i][2][0]/2)**2+(event.clientY-shapes[i][1][1]/2-shapes[i][2][1]/2)**2);
                if (r<r0){
                    selected = i;
                    found = 1;
                    break;
                }
            } else if (shapes[i][0]=="tri"){
                let areaofT = areaofTriangle(shapes[i][2][0]-shapes[i][1][0], distanceBtwnPoints(shapes[i][2][0], shapes[i][2][1], shapes[i][1][0]/2+shapes[i][2][0]/2, shapes[i][1][1]), distanceBtwnPoints(shapes[i][2][0], shapes[i][2][1], shapes[i][1][0]/2+shapes[i][2][0]/2, shapes[i][1][1]));
                let a1 = areaofTriangle(distanceBtwnPoints(shapes[i][1][0]/2+shapes[i][2][0]/2, shapes[i][1][1], event.clientX, event.clientY), distanceBtwnPoints(event.clientX, event.clientY, shapes[i][2][0], shapes[i][2][1]), distanceBtwnPoints(shapes[i][2][0], shapes[i][2][1], shapes[i][1][0]/2+shapes[i][2][0]/2, shapes[i][1][1]));
                let a2 = areaofTriangle(shapes[i][2][0]-shapes[i][1][0], distanceBtwnPoints(event.clientX, event.clientY, shapes[i][2][0], shapes[i][2][1]), distanceBtwnPoints(event.clientX, event.clientY, shapes[i][1][0], shapes[i][2][1]));
                let a3 = areaofTriangle(distanceBtwnPoints(shapes[i][1][0]/2+shapes[i][2][0]/2, shapes[i][1][1], event.clientX, event.clientY), distanceBtwnPoints(shapes[i][2][0], shapes[i][2][1], shapes[i][1][0]/2+shapes[i][2][0]/2, shapes[i][1][1]), distanceBtwnPoints(event.clientX, event.clientY, shapes[i][1][0], shapes[i][2][1]));
                if ((a1+a2+a3-areaofT) < 1){
                    selected = i;
                    found = 1;
                    break;
                }
            } else if (shapes[i][0]=="text"){
                ctx.font = `${4*shapes[i][4]}px Arial`;
                if ((event.clientX)>shapes[i][1][0]&&
                (event.clientX)<(shapes[i][1][0]+ctx.measureText(shapes[i][5]).width)&&
                (event.clientY)>(shapes[i][1][1]-4*shapes[i][4])&&
                (event.clientY)<shapes[i][1][1]){
                    selected = i;
                    found = 1 ;
                    break;
                }
            } else if (shapes[i][0]=="img"){
                if ((event.clientX)>Math.min(shapes[i][1][0], shapes[i][2][0])&&
                (event.clientX)<Math.max(shapes[i][1][0], shapes[i][2][0])&&
                (event.clientY)>Math.min(shapes[i][1][1], shapes[i][2][1])&&
                (event.clientY)<Math.max(shapes[i][1][1], shapes[i][2][1])){
                    selected = i;
                    found =1 ;
                    break;
                }
            }
        
        }
        if (found == 1){
            tempCoords[0] = event.clientX;
            tempCoords[1] = event.clientY;
            dragselected = 1;
        } else {
            selected = -1;
        }
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
    } else if (mode == "img"){
        ctx.strokeStyle = color;
        tempCoords[0] = event.clientX;
        tempCoords[1] = event.clientY;
        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        console.log(tempCoords);
        console.log("Drawing being made");
    } else if (mode == "text"){
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
window.addEventListener('mouseup', (event) => {
    if (canvasDown){
        canvasDown = false;
    } else {
        return;
    }
    drawingRn = false;
    drawCanvas(shapes);
    console.log("Drawing stopped");
    // console.log(stateStack[0]);
    // console.log(stateStack[1]);
    // console.log(stateStack[2]);
    // console.log(stateStack[3]);
    if (mode=="pointer"){
        if (dragselected==1){
            // shapes[selected][1][0] += (event.clientX-tempCoords[0]);
            // shapes[selected][1][1] += (event.clientY-tempCoords[1]);
            // shapes[selected][2][0] += (event.clientX-tempCoords[0]);
            // shapes[selected][2][1] += (event.clientY-tempCoords[1]);
            dragselected = 0;
            console.log("dragslected zero");
            drawCanvas(shapes);
        }
    } else if (mode == 'brush'){
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
        imgArr.push([event.clientX, event.clientY]);
        imgArr.push(`https://picsum.photos/id/${(Math.floor(Math.random() * 101)+1)}/${Math.abs(tempCoords[0]-event.clientX)}/${Math.abs(tempCoords[1]-event.clientY)}`);
        shapes.push(imgArr);
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
        if (mode=="pointer"){
            if (dragselected==1){
                if (shapes[selected][0]!="brush"){
                    shapes[selected][1][0] += (event.clientX-tempCoords[0]);
                    shapes[selected][1][1] += (event.clientY-tempCoords[1]);
                    shapes[selected][2][0] += (event.clientX-tempCoords[0]);
                    shapes[selected][2][1] += (event.clientY-tempCoords[1]);
                    tempCoords[0]=event.clientX;
                    tempCoords[1]=event.clientY;
                    drawCanvas(shapes);
                } else {
                    shapes[selected][1][0] += (event.clientX-tempCoords[0]);
                    shapes[selected][1][1] += (event.clientY-tempCoords[1]);
                    for (let j = shapes[selected][5].length-1; j >= 0; j--){
                        shapes[selected][5][j][0] += (event.clientX-tempCoords[0]);
                        shapes[selected][5][j][1] += (event.clientY-tempCoords[1]);
                    }
                    tempCoords[0]=event.clientX;
                    tempCoords[1]=event.clientY;
                }
            }
        } else if (mode == 'brush'){
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
            ctx.strokeRect(tempCoords[0], tempCoords[1], event.clientX-tempCoords[0], event.clientY-tempCoords[1]);
        } else if (mode == "square"){
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
            ctx.moveTo(tempCoords[0], tempCoords[1]);
            if (Math.abs(event.clientX - tempCoords[0]) > Math.abs(event.clientY - tempCoords[1])){
                if ((event.clientX - tempCoords[0])*((event.clientY - tempCoords[1]))>0){
                    ctx.lineTo(tempCoords[0], event.clientY);
                    ctx.lineTo(event.clientY - tempCoords[1] + tempCoords[0], event.clientY);
                    ctx.lineTo(event.clientY - tempCoords[1] + tempCoords[0], tempCoords[1]);
                    ctx.lineTo(tempCoords[0], tempCoords[1]);
                    ctx.lineTo(tempCoords[0], event.clientY);
                } else {
                    ctx.lineTo(tempCoords[0], event.clientY);
                    ctx.lineTo(-event.clientY + tempCoords[1] + tempCoords[0], event.clientY);
                    ctx.lineTo(-event.clientY + tempCoords[1] + tempCoords[0], tempCoords[1]);
                    ctx.lineTo(tempCoords[0], tempCoords[1]);
                    ctx.lineTo(tempCoords[0], event.clientY);
                }
            } else {
                if ((event.clientX - tempCoords[0])*((event.clientY - tempCoords[1]))>0){
                    ctx.lineTo(event.clientX, tempCoords[1]);
                    ctx.lineTo(event.clientX, event.clientX - tempCoords[0] + tempCoords[1]);
                    ctx.lineTo(tempCoords[0], tempCoords[1] + event.clientX - tempCoords[0]);
                    ctx.lineTo(tempCoords[0], tempCoords[1]);
                    ctx.lineTo(event.clientX, tempCoords[1]);
                } else {
                    ctx.lineTo(event.clientX, tempCoords[1]);
                    ctx.lineTo(event.clientX, -event.clientX + tempCoords[0] + tempCoords[1]);
                    ctx.lineTo(tempCoords[0], tempCoords[1] - event.clientX + tempCoords[0]);
                    ctx.lineTo(tempCoords[0], tempCoords[1]);
                    ctx.lineTo(event.clientX, tempCoords[1]);
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
        } else if (mode == "img"){
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
            ctx.moveTo(tempCoords[0], tempCoords[1]);
            ctx.strokeRect(tempCoords[0], tempCoords[1], event.clientX-tempCoords[0], event.clientY-tempCoords[1]);
        }
    }
});
