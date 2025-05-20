const canvasMain = new fabric.Canvas('canvasMain');
const canvasPreview = new fabric.Canvas('canvasPreview');

let wheelImgOriginal = null;
let previewImage = null;
let clipCircle = null;

// ==================== 車画像の読み込み ====================
function loadCarImage(file) {
  const reader = new FileReader();
  reader.onload = evt => {
    fabric.Image.fromURL(evt.target.result, img => {
      const scale = Math.min(
        canvasMain.width / img.width,
        canvasMain.height / img.height
      );
      img.scale(scale);
      canvasMain.setBackgroundImage(img, canvasMain.renderAll.bind(canvasMain), {
        left: (canvasMain.width - img.width * scale) / 2,
        top: (canvasMain.height - img.height * scale) / 2,
        originX: 'left',
        originY: 'top'
      });
    });
  };
  reader.readAsDataURL(file);
}

document.getElementById('carUpload').addEventListener('change', e => {
  const file = e.target.files[0];
  if (file) loadCarImage(file);
});

// ==================== ホイール画像の読み込み ====================
function loadWheelImage(file) {
  const reader = new FileReader();
  reader.onload = evt => {
    fabric.Image.fromURL(evt.target.result, img => {
      wheelImgOriginal = img;
      canvasPreview.clear();

      img.scaleToWidth(250);
      img.set({ left: 25, top: 25, selectable: false });
      previewImage = img;
      canvasPreview.add(img);

      clipCircle = new fabric.Circle({
        radius: 100,
        left: img.left + img.width * img.scaleX / 2,
        top: img.top + img.height * img.scaleY / 2,
        originX: 'center',
        originY: 'center',
        fill: 'rgba(255,255,255,0.2)',
        stroke: 'red',
        strokeWidth: 1,
        hasControls: false,
        hasBorders: false,
        selectable: true
      });
      canvasPreview.add(clipCircle);
      canvasPreview.setActiveObject(clipCircle);
    });
  };
  reader.readAsDataURL(file);
}

document.getElementById('wheelUpload').addEventListener('change', e => {
  const file = e.target.files[0];
  if (file) loadWheelImage(file);
});

// ==================== 切り抜き半径調整 ====================
document.getElementById('clipRadius').addEventListener('input', function () {
  const radius = parseInt(this.value, 10);
  document.getElementById('clipRadiusValue').textContent = radius;
  if (clipCircle) {
    clipCircle.set({ radius });
    canvasPreview.requestRenderAll();
  }
});

// ==================== 切り抜き処理 ====================
document.getElementById('confirmClip').addEventListener('click', () => {
  if (!previewImage || !clipCircle) return;

  const scale = previewImage.scaleX;
  const img = wheelImgOriginal;
  const imgElement = img.getElement();
  const clipCenterX = clipCircle.left;
  const clipCenterY = clipCircle.top;
  const radius = clipCircle.radius;
  const offsetX = (clipCenterX - previewImage.left) / scale;
  const offsetY = (clipCenterY - previewImage.top) / scale;
  const radiusOriginal = radius / scale;
  const size = radiusOriginal * 2;

  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = size;
  tempCanvas.height = size;
  const ctx = tempCanvas.getContext('2d');

  ctx.beginPath();
  ctx.arc(radiusOriginal, radiusOriginal, radiusOriginal, 0, Math.PI * 2);
  ctx.clip();

  ctx.drawImage(
    imgElement,
    offsetX - radiusOriginal,
    offsetY - radiusOriginal,
    size, size,
    0, 0,
    size, size
  );

  const clippedURL = tempCanvas.toDataURL();
  fabric.Image.fromURL(clippedURL, resultImg => {
    resultImg.set({
      left: 100,
      top: 100,
      scaleX: 0.3,
      scaleY: 0.3,
      selectable: true,
      isWheel: true
    });
    canvasMain.add(resultImg);
    canvasMain.setActiveObject(resultImg);
    canvasMain.renderAll();
  });
});

// ==================== 保存処理 ====================
document.getElementById('saveImage').addEventListener('click', () => {
  const dataURL = canvasMain.toDataURL({
    format: 'png',
    quality: 1.0,
    multiplier: 3
  });

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    document.getElementById('savedImage').src = dataURL;
    document.getElementById('saveTip').style.display = 'block';
    window.scrollTo(0, document.body.scrollHeight);
  } else {
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'wheel_composite_highres.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
});

// ==================== 削除処理 ====================
document.getElementById('deleteSelected').addEventListener('click', () => {
  const active = canvasMain.getActiveObject();
  if (!active) return alert("削除するホイール画像を選択してください");
  if (!active.isWheel) return alert("これは削除対象ではありません（ホイール画像を選んでください）");

  canvasMain.remove(active);
  canvasMain.discardActiveObject();
  canvasMain.renderAll();
});



// ==================== 画像ペースト対応 ====================
document.addEventListener('paste', event => {
  const items = (event.clipboardData || event.originalEvent.clipboardData).items;
  for (let item of items) {
    if (item.type.indexOf('image') !== -1) {
      const file = item.getAsFile();
      if (!canvasMain.backgroundImage) {
        loadCarImage(file);
      } else {
        loadWheelImage(file);
      }
    }
  }
});
