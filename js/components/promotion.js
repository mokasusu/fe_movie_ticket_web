import { BASE_PATH } from "../config.js";
export function initPromotion() {
  const slider = document.getElementById('promoSlider');
  const prev = document.getElementById('promoPrev');
  const next = document.getElementById('promoNext');
  const dotsContainer = document.getElementById('promoDots');

  if (!slider || !prev || !next || !dotsContainer) return;

  // Ensure promo images use BASE_PATH
  const promoImgs = [
    { id: 'promo-img-1', src: 'assets/images/banners/hoang_tu_quy_n.jpg' },
    { id: 'promo-img-2', src: 'assets/images/banners/chu_thuat_hoi_chien_bien_co_shibuya_tu_diet_hoi_du_n.jpg' },
    { id: 'promo-img-3', src: 'assets/images/banners/5_cm_tren_giay_n.jpg' }
  ];
  promoImgs.forEach(function(img) {
    const el = document.getElementById(img.id);
    if (el) el.src = BASE_PATH + '/' + img.src;
  });

  const items = slider.children;
  const total = items.length;
  let index = 0;
  let autoSlide;

  dotsContainer.innerHTML = '';

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

  next.addEventListener('click', () => { stopAuto(); nextSlide(); startAuto(); });
  prev.addEventListener('click', () => { stopAuto(); prevSlide(); startAuto(); });

  function startAuto() { autoSlide = setInterval(nextSlide, 4000); }
  function stopAuto() { clearInterval(autoSlide); }

  startAuto();

  window.addEventListener('resize', () => {
    slider.style.transition = 'none';
    goToSlide(index);
    setTimeout(() => { slider.style.transition = 'transform 0.6s ease-in-out'; }, 50);
  });
}
