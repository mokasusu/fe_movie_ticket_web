import dsPhim from '../data/phim.js';

/* Lấy ID phim từ URL */
function getMovieIdFromURL() {
  return new URLSearchParams(window.location.search).get('id');
}

/* Render chi tiết phim */
function renderMovieDetail(movie) {
  if (!movie) {
    document.querySelector('main').innerHTML =
      '<p class="text-danger text-center mt-5">Phim không tồn tại.</p>';
    return;
  }

  document.getElementById('movie-poster').src = movie.anhPhim;
  document.getElementById('breadcrumb-movie-name').textContent = movie.tenPhim;
  document.getElementById('movie-title').textContent = movie.tenPhim;
  document.getElementById('movie-description').textContent = movie.noiDung;

  document.getElementById('movie-director').textContent = movie.daoDien;
  document.getElementById('movie-actors').textContent = movie.dienVien || 'Đang cập nhật';
  document.getElementById('movie-genre').textContent = movie.theLoai.join(', ');
  document.getElementById('movie-duration').textContent = movie.thoiLuong + ' phút';
  document.getElementById('movie-release').textContent = movie.ngayKhoiChieu;

  /* Nút xem trailer tại chỗ */
  const trailerBtn = document.getElementById('movie-trailer');
  trailerBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showTrailer(movie.trailerUrl);
  });

  /* Lịch chiếu */
  const scheduleContainer = document.getElementById('movie-schedule');
  scheduleContainer.innerHTML = '';

  if (!movie.lichChieu || movie.lichChieu.length === 0) {
    scheduleContainer.innerHTML = '<p class="text-muted">Chưa có lịch chiếu</p>';
    return;
  }

  movie.lichChieu.forEach(day => {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'schedule-day';

    const dateText = new Date(day.ngayChieu).toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    dayDiv.innerHTML = `
      <h6><i class="far fa-calendar-alt me-2"></i>${dateText}</h6>
      <div class="time-slots-container">
        ${day.suatChieu.map(s => `
          <button class="schedule-time">${s.gioChieu}</button>
        `).join('')}
      </div>
    `;

    scheduleContainer.appendChild(dayDiv);
  });
}

/* INIT */
document.addEventListener('DOMContentLoaded', () => {
  const movieId = getMovieIdFromURL();
  const movie = dsPhim.find(p => p.maPhim === movieId);
  renderMovieDetail(movie);
});
