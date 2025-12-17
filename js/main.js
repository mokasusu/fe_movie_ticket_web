import { PhimService } from './services/movie_service.js';
import { createMovieCard } from './components/movie_card.js';

function renderMoviesToContainer(movies, containerId, isSapChieu = false) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (movies.length === 0) {
    container.innerHTML = `<p class="text-muted ps-3">Hiện chưa có phim trong mục này.</p>`;
    return;
  }

  container.innerHTML = movies.map(movie => createMovieCard(movie, isSapChieu)).join('');
}

function renderPhimDangChieu() {
  const phim = PhimService.layPhimDangChieu();
  renderMoviesToContainer(phim, 'movie-list-dang-chieu');
}

function renderPhimSapChieu() {
  const phim = PhimService.layPhimSapChieu();
  renderMoviesToContainer(phim, 'movie-list-sap-chieu', true);
}

function initApp() {
  renderPhimDangChieu();
  renderPhimSapChieu();
}

document.addEventListener('DOMContentLoaded', initApp);
