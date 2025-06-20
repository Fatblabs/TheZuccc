// ── QUERY SELECTORS & GLOBALS ─────────────────────────────────────────────────
const canvas       = document.querySelector("canvas");
const ctx          = canvas.getContext("2d");

const sizeSlider   = document.querySelector("#size-slider");
const toolBtns     = document.querySelectorAll(".tool");
const colorBtns    = document.querySelectorAll(".colors .option");
const colorPicker  = document.querySelector("#color-picker");
const clearCanvas  = document.querySelector(".clear-canvas");
const saveImageBtn = document.querySelector(".save-img");
const loadImageBtn = document.querySelector(".load-img");

const paintingsContainer = document.getElementById("paintingsContainer");

// Replace this with your actual ngrok (or production) domain:
const API_BASE = "https://1639-2601-600-8d82-2480-ed12-278c-7d89-4b61.ngrok-free.app";

// ── STATE VARIABLES ───────────────────────────────────────────────────────────
let isDrawing     = false;
let prevMouseX    = 0;
let prevMouseY    = 0;
let brushWidth    = 5;
let selectedTool  = "brush";
let selectedColor = "#000";

// ── CANVAS INITIALIZATION ────────────────────────────────────────────────────
// On window.load, size the canvas to its CSS‐defined width/height and fill white
window.addEventListener("load", () => {
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  // Fill background white so that eraser (white brush) effectively erases
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle    = selectedColor;
  ctx.strokeStyle  = selectedColor;
  ctx.lineWidth    = brushWidth;
  ctx.lineCap      = "round";
});

// ── DRAWING FUNCTIONS ─────────────────────────────────────────────────────────
function startDraw(e) {
  isDrawing = true;
  prevMouseX = e.offsetX;
  prevMouseY = e.offsetY;
  ctx.beginPath();
  ctx.moveTo(prevMouseX, prevMouseY);
  ctx.lineWidth   = brushWidth;
  ctx.strokeStyle = (selectedTool === "eraser" ? "#fff" : selectedColor);
}

function drawing(e) {
  if (!isDrawing) return;
  if (selectedTool === "brush" || selectedTool === "eraser") {
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  }
}

function stopDraw() {
  isDrawing = false;
}

// ── TOOL & COLOR SWITCHING ─────────────────────────────────────────────────────
toolBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".options .active").classList.remove("active");
    btn.classList.add("active");
    selectedTool = btn.id; // either "brush" or "eraser"
  });
});

sizeSlider.addEventListener("change", () => {
  brushWidth = sizeSlider.value;
});

colorBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".colors .selected").classList.remove("selected");
    btn.classList.add("selected");
    selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    ctx.strokeStyle = selectedColor;
  });
});

colorPicker.addEventListener("change", () => {
  // when user picks a custom color, apply it
  colorPicker.parentElement.style.background = colorPicker.value;
  selectedColor = colorPicker.value;
  ctx.strokeStyle = selectedColor;
});

// ── CANVAS EVENT LISTENERS ────────────────────────────────────────────────────
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", stopDraw);
canvas.addEventListener("mouseleave", stopDraw);

// ── CLEAR CANVAS BUTTON ───────────────────────────────────────────────────────
clearCanvas.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle   = selectedColor;
  ctx.strokeStyle = selectedColor;
});

// ── SAVE TO SERVER BUTTON ─────────────────────────────────────────────────────
// Converts the current canvas into a PNG Blob and posts it (with creds/title) to /savePainting
saveImageBtn.addEventListener("click", () => {
  const username = prompt("Username:");
  const password = prompt("Password:");
  const title    = prompt("Title for this painting:") || `Canvas-${Date.now()}`;

  if (!username || !password) {
    return alert("Username and password are required.");
  }

  canvas.toBlob(blob => {
    if (!blob) return alert("Couldn't capture canvas as image.");

    const fd = new FormData();
    fd.append("username", username);
    fd.append("password", password);
    fd.append("title", title);
    fd.append("image", blob, `${Date.now()}.png`);

    fetch(`${API_BASE}/savePainting`, {
      method: "POST",
      body: fd
    })
    .then(res => res.json())
    .then(json => {
      if (json.status === "ok") {
        alert("Painting saved to server!");
      } else {
        alert("Server error: " + JSON.stringify(json));
      }
    })
    .catch(err => {
      console.error("Upload failed:", err);
      alert("Upload failed: " + err.message);
    });
  }, "image/png");
});

// ── LOAD EXISTING BUTTON ──────────────────────────────────────────────────────
// Fetches /getPaintings, displays thumbnails, and lets user click one to draw it on canvas
loadImageBtn.addEventListener("click", async () => {
  const username = prompt("Username:");
  const password = prompt("Password:");

  if (!username || !password) {
    return alert("Username and password are required.");
  }

  let paintings;
  try {
    const resp = await fetch(`${API_BASE}/getPaintings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    paintings = await resp.json();
  } catch (err) {
    console.error("Failed to fetch paintings:", err);
    return alert("Failed to load paintings: " + err.message);
  }

  // Clear out previous thumbnails:
  paintingsContainer.innerHTML = paintings.length 
    ? "" 
    : "<p>No saved paintings.</p>";

  paintings.forEach(p => {
    // Build a thumbnail <img>
    const thumb = document.createElement("img");
    thumb.src   = `${API_BASE}${p.imagePath}`; 
    thumb.alt   = p.title;
    thumb.title = `Click to load: ${p.title}`;
    thumb.style = "max-width: 100px; margin: 5px; cursor: pointer; border: 2px solid #ccc;";

    // When thumbnail is clicked → draw onto canvas
    thumb.addEventListener("click", () => {
      loadPaintingOntoCanvas(thumb.src);
    });

    paintingsContainer.appendChild(thumb);
  });
});

function loadPaintingOntoCanvas(url) {
  const img = new Image();
  img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.onerror = () => {
      alert("Error: Could not load the painting from: " + url);
      console.error("Image load failed for URL:", url);
    };
    img.src = url;
    img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const canvasAspect = canvas.width / canvas.height;
    const imgAspect = img.width / img.height;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (imgAspect > canvasAspect) {
      // Image is wider than canvas
      drawWidth = canvas.width;
      drawHeight = canvas.width / imgAspect;
      offsetX = 0;
      offsetY = (canvas.height - drawHeight) / 2;
    } else {
      // Image is taller than canvas
      drawHeight = canvas.height;
      drawWidth = canvas.height * imgAspect;
      offsetX = (canvas.width - drawWidth) / 2;
      offsetY = 0;
    }
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };
}


