const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const input = document.getElementById("imageInput");

// ===== txt =====
const texts = {
  title: {
    text: "",
    x: 250,
    y: 300,
    font: "bold 28px serif",
    color: "black"
  },
  description: {
    text: "",
    x: 55,
    y: 290,
    font: "16px serif",
    color: "black"
  },
  option: {
    text: "",
    x: 250,
    y: 500,
    font: "16px serif",
    color: "white"
  }
};

// ===== 切り抜き領域 =====
  const FRAME_WINDOW = {
  x: 55,
  y: 90,
  width: 404,
  height: 153
};

// ===== 固定背景画像 =====
const background = new Image();
background.src = "image/event_news_bg.png";

// ===== 可動画像一覧 =====
let images = [];

// ===== ドラッグ・選択管理 =====
let draggingImage = null;
let selectedImage = null;
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
      const scale = 1;
      
      const w = img.width * scale;
      const h = img.height * scale;
      
      images.push({
        img,
        scale,
        x: FRAME_WINDOW.x + (FRAME_WINDOW.width - w) / 2,
        y: FRAME_WINDOW.y + (FRAME_WINDOW.height - h) / 2
      });
      draw();
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
});

// 描画

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // ===== 挿入画像（穴の中だけ） =====
  ctx.save();
  ctx.beginPath();
  ctx.rect(
    FRAME_WINDOW.x,
    FRAME_WINDOW.y,
    FRAME_WINDOW.width,
    FRAME_WINDOW.height
  );
  ctx.clip();

  for (const obj of images) {
    const w = obj.img.width * obj.scale;
    const h = obj.img.height * obj.scale;
    ctx.drawImage(obj.img, obj.x, obj.y, w, h);
  }

  ctx.restore(); // clip解除

  // ===== フレームを最前面 =====
  ctx.drawImage(background, 0, 0);

  // ===== テキスト描画 =====
  for (const key in texts) {
    const t = texts[key];
    if (!t.text) continue;
  
    ctx.save();
    ctx.font = t.font;
    ctx.fillStyle = t.color;
    ctx.textBaseline = "top";
    ctx.fillText(t.text, t.x, t.y);
    ctx.restore();
}

}



// マウス押下
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
      selectedImage = obj;
      offsetX = mx - obj.x;
      offsetY = my - obj.y;
      canvas.style.cursor = "grabbing";

      // 最前面へ
      images.splice(i, 1);
      images.push(obj);
      break;
    }
  }
});

// マウス移動
canvas.addEventListener("mousemove", (e) => {
  if (!draggingImage) return;

  const rect = canvas.getBoundingClientRect();
  draggingImage.x = e.clientX - rect.left - offsetX;
  draggingImage.y = e.clientY - rect.top - offsetY;

  draw();
});

// マウス離す
canvas.addEventListener("mouseup", stopDrag);
canvas.addEventListener("mouseleave", stopDrag);

function stopDrag() {
  draggingImage = null;
  canvas.style.cursor = "grab";
}

// ===== ホイールで拡大縮小 =====
canvas.addEventListener("wheel", (e) => {
  if (!selectedImage) return;

  e.preventDefault();

  const zoomSpeed = 0.1;
  if (e.deltaY < 0) {
    selectedImage.scale += zoomSpeed;
  } else {
    selectedImage.scale -= zoomSpeed;
  }

  // 拡大縮小制限
  selectedImage.scale = Math.max(0.1, Math.min(5, selectedImage.scale));

  draw();
}, { passive: false });

// ===== 削除機能 =====
window.addEventListener("keydown", (e) => {
  if (!selectedImage) return;

  if (e.key === "Delete" || e.key === "Backspace") {
    images = images.filter(img => img !== selectedImage);
    selectedImage = null;
    draggingImage = null;
    draw();
  }
});

// ===== txt =====
document.getElementById("titleInput").addEventListener("input", (e) => {
  texts.title.text = e.target.value;
  draw();
});

document.getElementById("descriptionInput").addEventListener("input", (e) => {
  texts.description.text = e.target.value;
  draw();
});

document.getElementById("optionInput").addEventListener("input", (e) => {
  texts.option.text = e.target.value;
  draw();
});


