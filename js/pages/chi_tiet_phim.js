import dsPhim from '../data/phim.js';

/* Lấy ID phim từ URL */
function getMovieIdFromURL() {
  return new URLSearchParams(window.location.search).get('maphim');
}

/* Render chi tiết phim */
function renderMovieDetail(movie) {
  if (!movie) {
    document.querySelector('main').innerHTML =
      '<div class="container mt-5"><p class="text-danger text-center">Phim không tồn tại hoặc đã bị gỡ bỏ.</p></div>';
    return;
  }

  // Cập nhật thông tin cơ bản
  document.getElementById('movie-poster').src = '../' + movie.anhPhim;
  document.getElementById('breadcrumb-movie-name').textContent = movie.tenPhim;
  document.getElementById('movie-title').textContent = movie.tenPhim;
  document.getElementById('movie-description').textContent = movie.noiDung;

  document.getElementById('movie-director').textContent = movie.daoDien;
  document.getElementById('movie-actors').textContent = movie.dienVien || 'Đang cập nhật';
  document.getElementById('movie-genre').textContent = movie.theLoai.join(', ');
  document.getElementById('movie-duration').textContent = movie.thoiLuong + ' phút';
  document.getElementById('movie-release').textContent = movie.ngayKhoiChieu;

  /* Nút xem trailer */
  const trailerBtn = document.getElementById('movie-trailer');
  if (trailerBtn) {
    trailerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof showTrailer === 'function') {
        showTrailer(movie.trailerUrl);
      } else {
        window.open(movie.trailerUrl, '_blank');
      }
    });
  }

  /* Render Lịch chiếu */
  const scheduleContainer = document.getElementById('movie-schedule');
  scheduleContainer.innerHTML = '';

  if (!movie.lichChieu || movie.lichChieu.length === 0) {
    scheduleContainer.innerHTML = '<p class="text-muted mt-3">Hiện chưa có lịch chiếu cho phim này.</p>';
    return;
  }

  movie.lichChieu.forEach(day => {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'schedule-day mb-4';

    const dateText = new Date(day.ngayChieu).toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    dayDiv.innerHTML = `
      <h6 class="fw-bold mb-3"><i class="far fa-calendar-alt me-2 text-danger"></i>${dateText}</h6>
      <div class="time-slots-container d-flex flex-wrap gap-2">
        ${day.suatChieu.map(s => `
          <button class="btn btn-outline-light schedule-time" 
                  data-gio="${s.gioChieu}" 
                  data-phong="${s.phongChieu}" 
                  data-ngay="${day.ngayChieu}">
            ${s.gioChieu}
          </button>
        `).join('')}
      </div>
    `;
    scheduleContainer.appendChild(dayDiv);
  });

  // Sau khi render xong các nút giờ, ta gán sự kiện click
  bindBookingEvents(movie);
}

/* Xử lý khi click chọn giờ chiếu */
function bindBookingEvents(movie) {
  const timeButtons = document.querySelectorAll('.schedule-time');
  
  timeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Kiểm tra đăng nhập
      const currentUser = localStorage.getItem('currentUser');
      if (!currentUser) {
        alert('Vui lòng đăng nhập để đặt vé!');
        window.location.href = '/cop_cinema/pages/login.html';
        return;
      }
      // Đóng gói dữ liệu chuẩn để trang Booking (booking.js) có thể đọc được
      const bookingData = {
        maPhim: movie.maPhim,
        tenPhim: movie.tenPhim,
        anhPhim: movie.anhPhim,
        doTuoi: movie.doTuoi,
        thoiLuong: movie.thoiLuong,
        dinhDang: movie.dinhDang || "2D Digital",
        ngayChieu: btn.dataset.ngay,
        gioChieu: btn.dataset.gio,
        phongChieu: btn.dataset.phong
      };

      // Lưu vào localStorage với key 'currentBooking' (trùng với logic trong booking.js)
      localStorage.setItem('currentBooking', JSON.stringify(bookingData));

      // Chuyển hướng sang màn hình chọn ghế
      window.location.href = '/cop_cinema/pages/booking.html';
    });
  });
}

/* KHỞI CHẠY */
document.addEventListener('DOMContentLoaded', () => {
  const movieId = getMovieIdFromURL();
  const movie = dsPhim.find(p => p.maPhim === movieId);
  
  renderMovieDetail(movie);
});