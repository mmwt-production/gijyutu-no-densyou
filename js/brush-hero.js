// 「色掛けの伝承」ページ: マウス/指でなぞると、和の色が重なっていく筆の演出
(function () {
  const canvas = document.getElementById('brushCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  // 日本の伝統色を中心とした、少し華やかめのパレット
  const colors = [
    '#a83c32', // 紅
    '#2f4858', // 藍
    '#b8944f', // 山吹
    '#5c7a5e', // 若草
    '#7a4b6b', // 江戸紫
    '#c76b3f', // 柿色
    '#3c7a7f', // 青竹
  ];
  let colorIndex = 0;
  let drawing = false;
  let last = null;
  let strokeCount = 0;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    ctx.scale(ratio, ratio);
    paintBackground();
  }

  function paintBackground() {
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = '#e3dbc8';
    ctx.fillRect(0, 0, rect.width, rect.height);
  }

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    if (e.touches && e.touches[0]) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function strokeTo(pos) {
    if (!last) {
      last = pos;
      return;
    }
    ctx.globalAlpha = 0.35;
    ctx.strokeStyle = colors[colorIndex % colors.length];
    ctx.lineWidth = 22;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    last = pos;
  }

  function start(e) {
    drawing = true;
    strokeCount += 1;
    colorIndex = strokeCount;
    last = getPos(e);
  }

  function move(e) {
    if (!drawing) return;
    e.preventDefault();
    strokeTo(getPos(e));
  }

  function end() {
    drawing = false;
    last = null;
  }

  canvas.addEventListener('mousedown', start);
  canvas.addEventListener('mousemove', move);
  window.addEventListener('mouseup', end);

  canvas.addEventListener('touchstart', start, { passive: true });
  canvas.addEventListener('touchmove', move, { passive: false });
  canvas.addEventListener('touchend', end);

  // なめらかな曲線を、細かい点列に分解して描く(交互作用なしの背景用ストローク)
  function paintCurve(pointsThrough, color, width, alpha) {
    if (pointsThrough.length < 2) return;
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(pointsThrough[0].x, pointsThrough[0].y);
    for (let i = 1; i < pointsThrough.length - 1; i++) {
      const mid = {
        x: (pointsThrough[i].x + pointsThrough[i + 1].x) / 2,
        y: (pointsThrough[i].y + pointsThrough[i + 1].y) / 2,
      };
      ctx.quadraticCurveTo(pointsThrough[i].x, pointsThrough[i].y, mid.x, mid.y);
    }
    ctx.stroke();
  }

  function randomStrokePoints(rect, seed) {
    // 画面を横切る、ゆるやかにうねる一筆分の点列を作る
    const startY = rect.height * (0.15 + 0.7 * seed.a);
    const endY = rect.height * (0.15 + 0.7 * seed.b);
    const midY = rect.height * (0.15 + 0.7 * seed.c);
    return [
      { x: -rect.width * 0.05, y: startY },
      { x: rect.width * 0.35, y: midY },
      { x: rect.width * 0.65, y: rect.height - midY },
      { x: rect.width * 1.05, y: endY },
    ];
  }

  window.addEventListener('resize', resize);
  resize();

  // 初回に、いろいろな色の筆致を重ねて、彩り豊かな背景として見せる
  window.requestAnimationFrame(() => {
    const rect = canvas.getBoundingClientRect();
    const strokes = [
      { seed: { a: 0.10, b: 0.30, c: 0.55 }, width: 46, alpha: 0.30 },
      { seed: { a: 0.75, b: 0.55, c: 0.20 }, width: 34, alpha: 0.30 },
      { seed: { a: 0.40, b: 0.80, c: 0.65 }, width: 40, alpha: 0.28 },
      { seed: { a: 0.60, b: 0.15, c: 0.45 }, width: 26, alpha: 0.32 },
      { seed: { a: 0.20, b: 0.65, c: 0.85 }, width: 30, alpha: 0.28 },
      { seed: { a: 0.85, b: 0.90, c: 0.35 }, width: 20, alpha: 0.30 },
    ];

    let i = 0;
    const step = () => {
      if (i >= strokes.length) return;
      const s = strokes[i];
      const color = colors[i % colors.length];
      paintCurve(randomStrokePoints(rect, s.seed), color, s.width, s.alpha);
      i += 1;
      setTimeout(step, 220);
    };
    setTimeout(step, 300);
  });
})();
