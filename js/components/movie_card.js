export function createMovieCard(movie, isSapChieu = false) {
  const ageClass = movie.doTuoi.toLowerCase();
  const genreText = movie.theLoai.join(', ');

  let buttonHTML;
  if (isSapChieu) {
    const ngayChieu = new Date(movie.ngayKhoiChieu);
    const ngayChieuFormat = ngayChieu.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    buttonHTML = `<button class="btn btn-outline-light btn-sm px-4" disabled>${ngayChieuFormat}</button>`;
  } else {
    buttonHTML = `<button class="btn btn-primary btn-sm px-4">ĐẶT VÉ</button>`;
  }

  return `
    <div class="col-6 col-md-4 col-lg-3">
      <div class="movie-card">
        <div class="movie-poster">
          <img src="${movie.anhPhim}" alt="${movie.tenPhim}" loading="lazy">
          <span class="age-badge badge-${ageClass}">${movie.doTuoi}</span>
          <span class="format-badge">${movie.dinhDang}</span>
          <div class="movie-overlay">
            <a href="${movie.trailerUrl}" target="_blank" class="btn-trailer mb-2">
              <i class="fas fa-play-circle"></i> Trailer
            </a>
            ${buttonHTML}
          </div>
        </div>
        <div class="movie-content">
          <h5 class="movie-title">${movie.tenPhim}</h5>
          <div class="movie-meta">
            <span><i class="far fa-clock"></i> ${movie.thoiLuong}p</span>
            <span class="genre">${genreText}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}
