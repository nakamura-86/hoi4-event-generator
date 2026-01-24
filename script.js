// ===============================
// Canvas 初期設定
// ===============================
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const input = document.getElementById("addImage");

// ===============================
// ベース画像（固定）
// ===============================
const baseImage = new Image();
baseImage.src = "images/base.png"; // 初期表示したい画像

let baseX = 0;
let baseY = 0;

// ===============================
// 追加画像（ドラッグ可能）
// ===============================
const overlays = [];
let active = null;
let offsetX = 0;
let offsetY = 0;

// ===============================
// ベース画像読み込み完了
// ===============================
baseImage.onload = () => {
  baseX = (canvas.width - baseImage.width) / 2;
  baseY = (canvas.height - baseImage.height) / 2;
  draw();
};

// ===============================
// 再描画処理
// ===============================
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 固定ベース画像
  ctx.drawImage(baseImage, baseX, baseY);

  // 追加画像
  overlays.forEach(o => {
    ctx.drawImage(o.image, o.x, o.y);
  });
}

// ===============================
// 追加画像の読み込み
// ===============================
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

  // 同じ画像を連続で追加できるように
  input.value = "";
});

// ===============================
// マウス操作（ドラッグ）
// ===============================
canvas.addEventListener("mousedown", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  // 上にある画像から判定
  for (let i = overlays.length - 1; i >= 0; i--) {
    const o = overlays[i];
    if (
      mx >= o.x &&
      mx <= o.x + o.image.width &&
      my >= o.y &&
      my <= o.y + o.image.height
    ) {
      active = o;
      offsetX = mx - o.x;
      offsetY = my - o.y;

      // 最前面に移動
      overlays.splice(i, 1);
      overlays.push(active);

      canvas.style.cursor = "grabbing";
      break;
    }
  }
});

canvas.addEventListener("mousemove", (e) => {
  if (!active) return;

  const rect = canvas.getBoundingClientRect();
  active.x = e.clientX - rect.left - offsetX;
  active.y = e.clientY - rect.top - offsetY;

  draw();
});

canvas.addEventListener("mouseup", () => {
  active = null;
  canvas.style.cursor = "grab";
});

canvas.addEventListener("mouseleave", () => {
  active = null;
  canvas.style.cursor = "grab";
});
