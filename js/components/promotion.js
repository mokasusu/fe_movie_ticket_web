document.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('promoSlider');
  const items = slider.children;
  const prev = document.getElementById('promoPrev');
  const next = document.getElementById('promoNext');
  const dotsContainer = document.getElementById('promoDots');

  let index = 0;
  const total = items.length;
  let autoSlide;

  // Tạo dot indicator
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('span');
    dot.classList.add('promo-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      stopAuto();
      goToSlide(i);
      startAuto();
    });
    dotsContainer.appendChild(dot);
  }
  const dots = dotsContainer.children;

  function updateDots() {
    [...dots].forEach(d => d.classList.remove('active'));
    dots[index].classList.add('active');
  }

  function goToSlide(i) {
    index = i;
    slider.style.transform = `translateX(-${index * 100}%)`;
    updateDots();
  }

  function nextSlide() {
    index = (index + 1) % total;
    goToSlide(index);
  }

  function prevSlide() {
    index = (index - 1 + total) % total;
    goToSlide(index);
  }

  // Arrow events
  next.addEventListener('click', () => { stopAuto(); nextSlide(); startAuto(); });
  prev.addEventListener('click', () => { stopAuto(); prevSlide(); startAuto(); });

  // Auto slide
  function startAuto() { autoSlide = setInterval(nextSlide, 4000); }
  function stopAuto() { clearInterval(autoSlide); }

  startAuto();

  // Reset slider khi resize
  window.addEventListener('resize', () => {
    slider.style.transition = 'none';
    goToSlide(index);
    setTimeout(() => { slider.style.transition = 'transform 0.6s ease-in-out'; }, 50);
  });
});
