let trailerLoaded = false;

async function loadTrailerComponent() {
  if (trailerLoaded) return;

  const res = await fetch('/cop_cinema/pages/components/trailer.html');
  document.body.insertAdjacentHTML('beforeend', await res.text());

  initTrailerEvents();
  trailerLoaded = true;
}

/* Init */
function initTrailerEvents() {
  const overlay = document.getElementById('trailer-overlay');
  const iframe = document.getElementById('trailer-iframe');
  const closeBtn = document.getElementById('close-trailer');

  closeBtn.addEventListener('click', closeTrailer);
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeTrailer();
  });

  function closeTrailer() {
    overlay.classList.remove('active');
    iframe.src = '';
  }
}

function toEmbedUrl(url) {
  if (!url) return '';

  if (url.includes('youtube.com/embed/')) return url;

  if (url.includes('watch?v=')) {
    const id = url.split('watch?v=')[1].split('&')[0];
    return `https://www.youtube.com/embed/${id}?autoplay=1`;
  }

  if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1].split('?')[0];
    return `https://www.youtube.com/embed/${id}?autoplay=1`;
  }

  return url;
}

/* GLOBAL */
window.showTrailer = async function (url) {
  await loadTrailerComponent();

  const overlay = document.getElementById('trailer-overlay');
  const iframe = document.getElementById('trailer-iframe');

  iframe.src = toEmbedUrl(url);
  overlay.classList.add('active');
};
