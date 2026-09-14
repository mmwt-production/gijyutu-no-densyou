// 「染み抜きの伝承」ページ: なぞった部分のシミが消えていく演出
(function () {
  const canvas = document.getElementById('stainCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  // 生地に見立てた背景と、シミの色
  const paperColor = '#efe9dc';
  const stainColors = [
    'rgba(120, 78, 46, 0.55)',  // 茶シミ
    'rgba(168, 60, 50, 0.45)',  // 赤ワイン系
    'rgba(90, 90, 60, 0.40)',   // 皮脂・黄ばみ系
  ];

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(ratio, ratio);
    paintStains();
  }

  function paintStains() {
    const rect = canvas.getBoundingClientRect();
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = paperColor;
    ctx.fillRect(0, 0, rect.width, rect.height);

    const blots = [
      { x: 0.28, y: 0.35, r: 0.22 },
      { x: 0.62, y: 0.55, r: 0.28 },
      { x: 0.45, y: 0.75, r: 0.16 },
      { x: 0.75, y: 0.25, r: 0.14 },
    ];
    blots.forEach((b, i) => {
      const color = stainColors[i % stainColors.length];
      const cx = rect.width * b.x;
      const cy = rect.height * b.y;
      const r = Math.min(rect.width, rect.height) * b.r;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, color);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    if (e.touches && e.touches[0]) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  let erasing = false;
  let last = null;

  function eraseTo(pos) {
    if (!last) {
      last = pos;
      return;
    }
    ctx.globalCompositeOperation = 'destination-out';
    ctx.globalAlpha = 0.9;
    ctx.strokeStyle = 'rgba(0,0,0,1)';
    ctx.lineWidth = 30;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    last = pos;
  }

  function start(e) {
    erasing = true;
    last = getPos(e);
  }

  function move(e) {
    if (!erasing) return;
    e.preventDefault();
    eraseTo(getPos(e));
  }

  function end() {
    erasing = false;
    last = null;
  }

  canvas.addEventListener('mousedown', start);
  canvas.addEventListener('mousemove', move);
  window.addEventListener('mouseup', end);

  canvas.addEventListener('touchstart', start, { passive: true });
  canvas.addEventListener('touchmove', move, { passive: false });
  canvas.addEventListener('touchend', end);

  window.addEventListener('resize', resize);
  resize();

  // 初回に、少しだけなぞって見せる簡単なデモアニメーション
  window.requestAnimationFrame(() => {
    const rect = canvas.getBoundingClientRect();
    const demoPoints = [
      { x: rect.width * 0.62, y: rect.height * 0.55 },
      { x: rect.width * 0.5, y: rect.height * 0.5 },
      { x: rect.width * 0.4, y: rect.height * 0.45 },
    ];
    let i = 0;
    const step = () => {
      if (i >= demoPoints.length) return;
      eraseTo(demoPoints[i]);
      i += 1;
      setTimeout(step, 260);
    };
    setTimeout(() => {
      last = null;
      step();
    }, 500);
  });
})();
