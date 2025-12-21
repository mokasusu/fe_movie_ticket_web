
import { BASE_PATH } from "../config.js";

export function createLichChieuCard(phim, suatChieuList) {
  const card = document.createElement("div");
  card.className = "lcc-card";

  let posterPath = phim.anhPhim.replace(/^\/+/, '');
  // Luôn render posterPath là `${BASE_PATH}/assets/images/posters/xxx.png` (BASE_PATH có thể rỗng)
  posterPath = `${BASE_PATH}/${posterPath}`.replace(/\/+/g, '/');
  card.innerHTML = `
    <!-- ROW 1: POSTER + INFO -->
    <div class="lcc-row lcc-row-top">
      <div class="lcc-poster">
        <img src="${posterPath}" alt="${phim.tenPhim}">
        <span class="lcc-age">${phim.doTuoi || "C13"}</span>
      </div>
      <div class="lcc-info">
        <h3 class="lcc-title">${phim.tenPhim}</h3>
        <div class="lcc-meta">
          <span>Thời lượng: ${phim.thoiLuong} phút</span> | <span>Định dạng: ${phim.dinhDang}</span>
        </div>
        ${phim.noiDung ? `<p class="lcc-desc">${phim.noiDung}</p>` : ""}
        <a class="lcc-detail" href="${BASE_PATH}/pages/chi_tiet_phim.html?maphim=${phim.maPhim}">Xem chi tiết →</a>
      </div>
    </div>

    <!-- ROW 2: SUẤT CHIẾU -->
    <div class="lcc-row lcc-row-bottom">
      <div class="lcc-showtimes">
        ${suatChieuList
          .map(
            suat => `
            <div class="lcc-showtime-wrap">
              <span
                class="lcc-showtime"
                data-maphim="${phim.maPhim}"
                data-ngay="${suat.ngay}"
                data-gio="${suat.gio}"
              >
                ${suat.gio}
              </span>
            </div>
          `
          )
          .join("")}
      </div>
    </div>
  `;

  return card;
}
