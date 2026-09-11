// トップページのカルーセル(横スクロール)の矢印操作
(function () {
  const track = document.getElementById('carouselTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (!track || !prevBtn || !nextBtn) return;

  const scrollByCard = (direction) => {
    const card = track.querySelector('.app-card');
    const gap = 24;
    const distance = card ? card.getBoundingClientRect().width + gap : 320;
    track.scrollBy({ left: direction * distance, behavior: 'smooth' });
  };

  prevBtn.addEventListener('click', () => scrollByCard(-1));
  nextBtn.addEventListener('click', () => scrollByCard(1));
})();
