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
    // Kiểm tra đăng nhập
    const currentUser = localStorage.getItem('currentUser');
    if (!isSapChieu) {
      if (!currentUser) {
        alert('Vui lòng đăng nhập để đặt vé!');
        window.location.href = `${BASE_URL}/pages/login.html`;
        return;
      }
      // Lấy suất chiếu đầu tiên nếu có
      let ngayChieu = '', gioChieu = '', phongChieu = '';
      if (Array.isArray(movie.lichChieu) && movie.lichChieu.length > 0) {
        const firstDay = movie.lichChieu[0];
        ngayChieu = firstDay.ngayChieu || '';
        if (Array.isArray(firstDay.suatChieu) && firstDay.suatChieu.length > 0) {
          gioChieu = firstDay.suatChieu[0].gioChieu || '';
          phongChieu = firstDay.suatChieu[0].phongChieu || '';
        }
      }
      const data = {
        maPhim: movie.maPhim,
        tenPhim: movie.tenPhim,
        anhPhim: movie.anhPhim,
        doTuoi: movie.doTuoi,
        thoiLuong: movie.thoiLuong,
        dinhDang: movie.dinhDang,
        ngayChieu,
        gioChieu,
        phongChieu
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
