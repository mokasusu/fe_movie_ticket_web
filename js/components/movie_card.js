import { BASE_URL } from "../config.js";

export function createMovieCard(movie, isSapChieu = false) {
  const ageClass = movie.doTuoi.toLowerCase();
  const genreText = movie.theLoai.join(', ');

  // Nút hiển thị
  let buttonHTML = document.createElement('button');
  if (isSapChieu) {
    const ngayChieu = new Date(movie.ngayKhoiChieu);
    const ngayChieuFormat = ngayChieu.toLocaleDateString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
    buttonHTML.className = 'btn btn-outline-light btn-sm mt-2 schedule-btn';
    buttonHTML.textContent = ngayChieuFormat;
  } else {
    buttonHTML.className = 'btn btn-primary btn-sm mt-2 schedule-btn';
    buttonHTML.innerHTML = '<i class="fas fa-ticket-alt me-1"></i> ĐẶT VÉ NGAY';
  }

  // Card container
  const colDiv = document.createElement('div');
  colDiv.className = 'col-6 col-md-4 col-lg-3 mb-4';

  const card = document.createElement('div');
  card.className = 'movie-card shadow-sm';

  // Poster
  const posterDiv = document.createElement('div');
  posterDiv.className = 'movie-poster position-relative';
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
  trailerBtn.innerHTML = `<i class="fas fa-play-circle me-2"></i> Xem Trailer`;
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

  // Click card -> detail page
  card.addEventListener('click', () => {
    window.location.href = `${BASE_URL}/pages/chi_tiet_phim.html?maphim=${movie.maPhim}`;
  });

  // Trailer click
  trailerBtn.addEventListener('click', e => {
    e.stopPropagation();
    showTrailer(movie.trailerUrl);
  });

  // Nút đặt vé/ngày chiếu không bắn click card
  buttonHTML.addEventListener('click', (e) => {
    e.stopPropagation();
    // Nếu là phim đang chiếu thì chuyển thẳng sang booking
    if (!isSapChieu) {
      // Lưu thông tin phim vào localStorage cho booking
      const data = {
        maPhim: movie.maPhim,
        tenPhim: movie.tenPhim,
        anhPhim: movie.anhPhim,
        doTuoi: movie.doTuoi,
        thoiLuong: movie.thoiLuong,
        dinhDang: movie.dinhDang,
        ngayChieu: movie.ngayChieu || '',
        gioChieu: movie.gioChieu || '',
        phongChieu: movie.phongChieu || 'Phòng chiếu'
      };
      localStorage.setItem('currentBooking', JSON.stringify(data));
      window.location.href = `${BASE_URL}/pages/booking.html`;
    } else {
      window.location.href = `${BASE_URL}/pages/chi_tiet_phim.html?maphim=${movie.maPhim}`;
    }
  });

  colDiv.appendChild(card);
  return colDiv;
}
