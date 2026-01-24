const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const input = document.getElementById("imageInput");

// ===== 固定背景画像 =====
const background = new Image();
background.src = "image/event_news_bg.png"; // 最初から表示したい画像

// ===== 可動画像一覧 =====
let images = [];

images.push({
  img,
  x: 100,
  y: 100,
  scale: 1
});

// ===== ドラッグ管理 =====
let draggingImage = null;
let offsetX = 0;
let offsetY = 0;

// 背景ロード
background.onload = () => {
  canvas.width = background.naturalWidth;
  canvas.height = background.naturalHeight;
  draw();
};


// 画像追加
input.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      images.push({
        img,
        x: 100,
        y: 100
      });
      draw();
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
});

// 描画関数
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(background, 0, 0);

  for (const obj of images) {
    const w = obj.img.width * obj.scale;
    const h = obj.img.height * obj.scale;
    ctx.drawImage(obj.img, obj.x, obj.y, w, h);
  }
}

// マウス押下
canvas.addEventListener("wheel", (e) => {
  if (!draggingImage) return;

  e.preventDefault();

  const scaleAmount = 0.1;
  if (e.deltaY < 0) {
    draggingImage.scale += scaleAmount;
  } else {
    draggingImage.scale -= scaleAmount;
  }

  // 拡大縮小の下限
  draggingImage.scale = Math.max(0.1, draggingImage.scale);

  draw();
}, { passive: false });


// マウス移動
canvas.addEventListener("mousedown", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  for (let i = images.length - 1; i >= 0; i--) {
    const obj = images[i];
    const w = obj.img.width * obj.scale;
    const h = obj.img.height * obj.scale;

    if (
      mx >= obj.x &&
      mx <= obj.x + w &&
      my >= obj.y &&
      my <= obj.y + h
    ) {
      draggingImage = obj;
      offsetX = mx - obj.x;
      offsetY = my - obj.y;
      canvas.style.cursor = "grabbing";
      break;
    }
  }
});


// マウス離す
canvas.addEventListener("mouseup", stopDrag);
canvas.addEventListener("mouseleave", stopDrag);

function stopDrag() {
  draggingImage = null;
  canvas.style.cursor = "grab";
}
