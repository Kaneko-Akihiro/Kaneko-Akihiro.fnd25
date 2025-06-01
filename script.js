
document.addEventListener('DOMContentLoaded', () => {
  const canvasMain    = new fabric.Canvas('canvasMain');
  const canvasPreview = new fabric.Canvas('canvasPreview');

  let wheelImgOriginal = null;
  let previewImage     = null;
  let clipCircle       = null;

  //──────────────────────────────────────────────────────────────
  // 車両画像アップロード用のドロップ＆クリック
  //──────────────────────────────────────────────────────────────
  const carDropArea = document.getElementById('carDropArea');
  const carUpload   = document.getElementById('carUpload');

  // クリックでファイル選択ダイアログを開く
  carDropArea.addEventListener('click', () => {
    carUpload.click();
  });
  // ファイルが選択された直後
  carUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) loadCarImage(file);
  });
  // ドラッグオーバー
  ['dragenter','dragover'].forEach(evName => {
    carDropArea.addEventListener(evName, e => {
      e.preventDefault();
      carDropArea.classList.add('dragover');
    });
  });
  // ドラッグリーブ＆ドロップ
  ['dragleave','drop'].forEach(evName => {
    carDropArea.addEventListener(evName, e => {
      e.preventDefault();
      carDropArea.classList.remove('dragover');
    });
  });
  // ドロップされたとき
  carDropArea.addEventListener('drop', e => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) loadCarImage(file);
  });

  //──────────────────────────────────────────────────────────────
  // ホイール画像アップロード用のドロップ＆クリック
  //──────────────────────────────────────────────────────────────
  const wheelDropArea = document.getElementById('wheelDropArea');
  const wheelUpload   = document.getElementById('wheelUpload');

  // クリックでファイル選択ダイアログを開く
  wheelDropArea.addEventListener('click', () => {
    wheelUpload.click();
  });
  // ファイルが選択された直後
  wheelUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) loadWheelImage(file);
  });
  // ドラッグオーバー
  ['dragenter','dragover'].forEach(evName => {
    wheelDropArea.addEventListener(evName, e => {
      e.preventDefault();
      wheelDropArea.classList.add('dragover');
    });
  });
  // ドラッグリーブ＆ドロップ
  ['dragleave','drop'].forEach(evName => {
    wheelDropArea.addEventListener(evName, e => {
      e.preventDefault();
      wheelDropArea.classList.remove('dragover');
    });
  });
  // ドロップされたとき
  wheelDropArea.addEventListener('drop', e => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) loadWheelImage(file);
  });

  //──────────────────────────────────────────────────────────────
  // 車両画像を読み込んで background に設定
  //──────────────────────────────────────────────────────────────
  function loadCarImage(file) {
    const reader = new FileReader();
    reader.onload = evt => {
      fabric.Image.fromURL(evt.target.result, img => {
        // キャンバスいっぱいにフィットするように縮小
        const scale = Math.min(
          canvasMain.width / img.width,
          canvasMain.height / img.height
        );
        img.scale(scale);
        canvasMain.setBackgroundImage(
          img,
          canvasMain.renderAll.bind(canvasMain),
          {
            left:    (canvasMain.width  - img.width  * scale) / 2,
            top:     (canvasMain.height - img.height * scale) / 2,
            originX: 'left',
            originY: 'top'
          }
        );
      });
    };
    reader.readAsDataURL(file);
  }

  //──────────────────────────────────────────────────────────────
  // ホイール画像を読み込んでプレビューに表示
  //──────────────────────────────────────────────────────────────
  function loadWheelImage(file) {
    const reader = new FileReader();
    reader.onload = evt => {
      fabric.Image.fromURL(evt.target.result, img => {
        wheelImgOriginal = img;
        canvasPreview.clear();

        // (A) プレビューキャンバス内に収まるように縮小
        const maxW = canvasPreview.width  - 40;
        const maxH = canvasPreview.height - 40;
        const scale = Math.min(maxW / img.width, maxH / img.height, 1);
        img.scale(scale);

        // (B) プレビューキャンバス中央に配置
        const left = (canvasPreview.width  - img.getScaledWidth())  / 2;
        const top  = (canvasPreview.height - img.getScaledHeight()) / 2;
        img.set({
          left: left,
          top:  top,
          selectable: false,
          hasControls: false,
          lockUniScaling: true,
          lockMovementX: true,
          lockMovementY: true,
          lockRotation: true
        });
        previewImage = img;
        canvasPreview.add(img);
        canvasPreview.requestRenderAll();

        // (C) 初期切り抜き円の半径を「画像の最小辺÷2」に合わせる
        const initRadius = Math.min(
          img.getScaledWidth(),
          img.getScaledHeight()
        ) / 2;

        clipCircle = new fabric.Circle({
          radius: initRadius,
          left:   canvasPreview.width / 2,
          top:    canvasPreview.height / 2,
          originX: 'center',
          originY: 'center',
          fill:    'rgba(255,255,255,0.2)',
          stroke:  'red',
          strokeWidth: 1,
          hasControls:    true,
          hasBorders:     true,
          selectable:     true,
          lockRotation:   true,
          lockScalingFlip:true
        });
        canvasPreview.add(clipCircle);
        clipCircle.bringToFront();
        canvasPreview.requestRenderAll();
        canvasPreview.setActiveObject(clipCircle);
      });
    };
    reader.readAsDataURL(file);
  }

  //──────────────────────────────────────────────────────────────
  // 切り抜き＆合成処理
  //──────────────────────────────────────────────────────────────
  document.getElementById('confirmClip').addEventListener('click', () => {
    if (!previewImage || !clipCircle) return;

    const scale       = previewImage.scaleX;
    const imgElement  = wheelImgOriginal.getElement();

    const clipCenterX     = clipCircle.left;
    const clipCenterY     = clipCircle.top;
    const displayedRadius = clipCircle.radius * clipCircle.scaleX;

    const imgLeft = previewImage.left;
    const imgTop  = previewImage.top;

    const offsetX = (clipCenterX - imgLeft) / scale;
    const offsetY = (clipCenterY - imgTop)  / scale;

    const radiusOriginal = displayedRadius / scale;
    const size = radiusOriginal * 2;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width  = size;
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
      resultImg.scaleToWidth(50);
      resultImg.set({
        left: 100,
        top:  100,
        selectable: true,
        isWheel: true
      });
      canvasMain.add(resultImg);
      canvasMain.setActiveObject(resultImg);
      canvasMain.renderAll();
    });
  });

  //──────────────────────────────────────────────────────────────
  // 保存処理
  //──────────────────────────────────────────────────────────────
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

  //──────────────────────────────────────────────────────────────
  // 削除処理
  //──────────────────────────────────────────────────────────────
  document.getElementById('deleteSelected').addEventListener('click', () => {
    const active = canvasMain.getActiveObject();
    if (!active) {
      return alert("削除するホイール画像を選択してください");
    }
    if (!active.isWheel) {
      return alert("これは削除対象ではありません（ホイール画像を選んでください）");
    }
    canvasMain.remove(active);
    canvasMain.discardActiveObject();
    canvasMain.renderAll();
  });

  //──────────────────────────────────────────────────────────────
  // アフィリエイト検索機能
  //──────────────────────────────────────────────────────────────
  document.getElementById('searchAmazonBtn').addEventListener('click', () => {
    const keyword = document.getElementById('searchKeyword').value.trim();
    if (!keyword) return;
    const tag = 'kirihasu-22';
    window.open(`https://www.amazon.co.jp/s?k=${encodeURIComponent(keyword)}&tag=${tag}`, '_blank');
  });
  document.getElementById('searchRakutenBtn').addEventListener('click', () => {
    const keyword = document.getElementById('searchKeyword').value.trim();
    if (!keyword) return;
    const id = '1ea2874e.9ad94166.1ea2874f.154a7c81';
    window.open(`https://hb.afl.rakuten.co.jp/hgc/${id}/?pc=https://search.rakuten.co.jp/search/mall/${encodeURIComponent(keyword)}/`, '_blank');
  });

});
