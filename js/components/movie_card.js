export function createMovieCard(movie, isSapChieu = false) {
  const ageClass = movie.doTuoi.toLowerCase();
  const genreText = movie.theLoai.join(', ');

  // Xác định nút hiển thị
  let buttonHTML;
  if (isSapChieu) {
    const ngayChieu = new Date(movie.ngayKhoiChieu);
    const ngayChieuFormat = ngayChieu.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    buttonHTML = document.createElement('button');
    buttonHTML.className = 'btn btn-outline-light btn-sm mt-2 schedule-btn';
    buttonHTML.textContent = ngayChieuFormat;
  } else {
    buttonHTML = document.createElement('button');
    buttonHTML.className = 'btn btn-primary btn-sm mt-2 schedule-btn';
    buttonHTML.textContent = 'ĐẶT VÉ NGAY';
  }

  // Tạo card element
  const colDiv = document.createElement('div');
  colDiv.className = 'col-6 col-md-4 col-lg-3 mb-4';

  const card = document.createElement('div');
  card.className = 'movie-card shadow-sm';

  // Poster
  const posterDiv = document.createElement('div');
  posterDiv.className = 'movie-poster';
  const img = document.createElement('img');
  img.src = movie.anhPhim;
  img.alt = movie.tenPhim;
  img.loading = 'lazy';
  posterDiv.appendChild(img);

  const ageBadge = document.createElement('span');
  ageBadge.className = `age-badge badge-${ageClass}`;
  ageBadge.textContent = movie.doTuoi;
  posterDiv.appendChild(ageBadge);

  const formatBadge = document.createElement('span');
  formatBadge.className = 'format-badge';
  formatBadge.textContent = movie.dinhDang;
  posterDiv.appendChild(formatBadge);

  card.appendChild(posterDiv);

  // Overlay
  const overlay = document.createElement('div');
  overlay.className = 'movie-overlay d-flex flex-column justify-content-center align-items-center';

  const trailerBtn = document.createElement('button');
  trailerBtn.className = 'btn-trailer mb-2';
  trailerBtn.innerHTML = `
    <i class="fas fa-play-circle me-2"></i>
    <span>Xem Trailer</span>
  `;
  overlay.appendChild(trailerBtn);

  overlay.appendChild(buttonHTML);
  card.appendChild(overlay);

  // Content
  const contentDiv = document.createElement('div');
  contentDiv.className = 'movie-content';
  contentDiv.innerHTML = `
    <h5 class="movie-title">${movie.tenPhim}</h5>
    <div class="movie-meta">
      <span class="duration"><i class="far fa-clock"></i> ${movie.thoiLuong} phút</span>
      <span class="genre">${genreText}</span>
    </div>
  `;
  card.appendChild(contentDiv);

  // Click card
  card.addEventListener('click', () => {
    window.location.href = `./pages/chi_tiet_phim.html?id=${movie.maPhim}`;
  });

  trailerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showTrailer(movie.trailerUrl);
  });

  // Nút đặt vé/ngày chiếu
  buttonHTML.addEventListener('click', (e) => e.stopPropagation());

  colDiv.appendChild(card);
  return colDiv;
}
