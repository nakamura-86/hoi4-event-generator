const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const input = document.getElementById("imageInput");

let img = new Image();
let imgX = 100;
let imgY = 100;

let isDragging = false;
let offsetX = 0;
let offsetY = 0;

// 画像読み込み
input.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
});

// 描画
img.onload = () => {
  draw();
};

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, imgX, imgY);
}

// マウス押下
canvas.addEventListener("mousedown", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  if (
    mouseX >= imgX &&
    mouseX <= imgX + img.width &&
    mouseY >= imgY &&
    mouseY <= imgY + img.height
  ) {
    isDragging = true;
    offsetX = mouseX - imgX;
    offsetY = mouseY - imgY;
    canvas.style.cursor = "grabbing";
  }
});

// マウス移動
canvas.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  const rect = canvas.getBoundingClientRect();
  imgX = e.clientX - rect.left - offsetX;
  imgY = e.clientY - rect.top - offsetY;

  draw();
});

// マウス離す
canvas.addEventListener("mouseup", () => {
  isDragging = false;
  canvas.style.cursor = "grab";
});

canvas.addEventListener("mouseleave", () => {
  isDragging = false;
  canvas.style.cursor = "grab";
});
