const canvas = document.querySelector("canvas"),
sizeSlider = document.querySelector("#size-slider"),
toolBtns = document.querySelectorAll(".tool")
fillColor = document.querySelector("#fill-color")
colorBtns = document.querySelectorAll(".colors .option"),
colorPicker = document.querySelector("#color-picker"),
clearCanvas = document.querySelector(".clear-canvas"),
saveImage = document.querySelector(".save-img"),
ctx = canvas.getContext("2d");
const link = document.createElement("a");
const img = new Image();
//try to set an image as a background, or use image bit data 

let prevMouseX, prevMouseY, snapshot,
isDrawing = false,
brushWidth = 5,
selectedTool = "brush",
selectedColor = "#000";

const setCanvasBackground = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor;
}
const setDrawingBackground = () => {
    img.onload = () => {
        ctx.drawImage(img,0,0);
    }
    img.src = "file:///C:/Users/s-khuum/Downloads/2077150.webp"; //random image
    //ctx.fillRect(0, 0, canvas.width, canvas.height);
    //ctx.fillStyle = link.ImageData;
    //ctx.drawImage = (Image, 0, 0);
}

window.addEventListener("load", () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
    //setDrawingBackground();
});

const startDraw = (e) =>{
    isDrawing = true;
    ctx.beginPath();
    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;
    ctx.lineWidth=brushWidth;
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    //snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

const drawing = (e) => {
    if (!isDrawing) return;
    
    //ctx.putImageData(snapshot, 0, 0);
    if(selectedTool === "brush" || selectedTool === "eraser"){
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    
    }
    
}
toolBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
        console.log(selectedTool);
    });
});

sizeSlider.addEventListener("change", () =>brushWidth = sizeSlider.value )

colorBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
        //console.log(window.getComputedStyle(btn).getPropertyValue("background-color"));

    });
});

colorPicker.addEventListener("change", () => {
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

clearCanvas.addEventListener("click", () =>{
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    setCanvasBackground();
});

saveImage.addEventListener("click", () =>{
    const link = document.createElement("a");
    link.download = `${Date.now()}.jpg`;
    link.href = canvas.toDataURL();
    link.click();
});

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false);