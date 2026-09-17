// トップページのカルーセル(横スクロール)の矢印操作 + 自動再生
(function () {
  const track = document.getElementById('carouselTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (!track || !prevBtn || !nextBtn) return;

  const GAP = 24;
  const AUTOPLAY_MS = 4200;
  const RESUME_DELAY_MS = 6000;
  const EDGE_MARGIN = 4;

  const cardStep = () => {
    const card = track.querySelector('.app-card');
    return card ? card.getBoundingClientRect().width + GAP : 320;
  };

  const atEnd = () => track.scrollLeft + track.clientWidth >= track.scrollWidth - EDGE_MARGIN;
  const atStart = () => track.scrollLeft <= EDGE_MARGIN;

  // 端まで来たら反対側へ折り返し、そうでなければ1枚分スクロールする
  const scrollByCard = (direction) => {
    if (direction > 0 && atEnd()) {
      track.scrollTo({ left: 0, behavior: 'smooth' });
    } else if (direction < 0 && atStart()) {
      track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
    } else {
      track.scrollBy({ left: direction * cardStep(), behavior: 'smooth' });
    }
  };

  let autoplayTimer = null;
  let resumeTimer = null;

  const stopAutoplay = () => {
    if (autoplayTimer) clearInterval(autoplayTimer);
    autoplayTimer = null;
  };

  // OSの「アニメーションを減らす」設定に関わらず、常に自動再生する
  const startAutoplay = () => {
    stopAutoplay();
    autoplayTimer = setInterval(() => scrollByCard(1), AUTOPLAY_MS);
  };

  // 手動操作の直後はしばらく自動再生を止め、一定時間後に再開する
  const pauseAutoplay = () => {
    stopAutoplay();
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(startAutoplay, RESUME_DELAY_MS);
  };

  prevBtn.addEventListener('click', () => {
    scrollByCard(-1);
    pauseAutoplay();
  });
  nextBtn.addEventListener('click', () => {
    scrollByCard(1);
    pauseAutoplay();
  });

  track.addEventListener('mouseenter', stopAutoplay);
  track.addEventListener('mouseleave', startAutoplay);
  track.addEventListener('touchstart', stopAutoplay, { passive: true });
  track.addEventListener('touchend', pauseAutoplay, { passive: true });
  track.addEventListener('focusin', stopAutoplay);
  track.addEventListener('focusout', startAutoplay);

  startAutoplay();
})();
