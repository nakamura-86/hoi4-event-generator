const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const input = document.getElementById("addImage");

// ===== ベース画像 =====
const baseImage = new Image();
baseImage.src = "event_news_bg.png";
let baseX, baseY;

// ===== 追加画像 =====
const overlays = [];
let activeImage = null;
let offsetX = 0;
let offsetY = 0;

// ベース画像読み込み
baseImage.onload = () => {
  baseX = (canvas.width - baseImage.width) / 2;
  baseY = (canvas.height - baseImage.height) / 2;
  draw();
};

// 再描画
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 固定ベース
  ctx.drawImage(baseImage, baseX, baseY);

  // 追加画像
  overlays.forEach(img => {
    ctx.drawImage(img.image, img.x, img.y);
  });
}

// 追加画像読み込み
input.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      overlays.push({
        image: img,
        x: (canvas.width - img.width) / 2,
        y: (canvas.height - img.height) / 2
      });
      draw();
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);

  input.value = ""; // 同じ画像を再度追加できるように
});

// マウス押下
canvas.addEventListener("mousedown", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  // 上にある画像から判定（逆順）
  for (let i = overlays.length - 1; i >= 0; i--) {
    const o = overlays[i];
    if (
      mx >= o.x &&
      mx <= o.x + o.image.width &&
      my >= o.y &&
      my <= o.y + o.image.height
    ) {
      activeImage = o;
      offsetX = mx - o.x;
      offsetY = my - o.y;

      // 最前面に移動
      overlays.splice(i, 1);
      overlays.push(activeImage);

      canvas.style.cursor = "grabbing";
      break;
    }
  }
});

// マウス移動
canvas.addEventListener("mousemove", (e) => {
  if (!activeImage) return;

  const rect = canvas.getBoundingClientRect();
  activeImage.x = e.clientX - rect.left - offsetX;
  activeImage.y = e.clientY - rect.top - offsetY;

  draw();
});

// マウス離す
canvas.addEventListener("mouseup", () => {
  activeImage = null;
  canvas.style.cursor = "grab";
});

canvas.addEventListener("mouseleave", () => {
  activeImage = null;
  canvas.style.cursor = "grab";
});
