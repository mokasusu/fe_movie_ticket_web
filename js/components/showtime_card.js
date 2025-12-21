
import { BASE_URL } from "../config.js";

export function createLichChieuCard(phim, suatChieuList) {
  const card = document.createElement("div");
  card.className = "lcc-card";

  card.innerHTML = `
    <!-- ROW 1: POSTER + INFO -->
    <div class="lcc-row lcc-row-top">
      <div class="lcc-poster">
        <img src="/cop_cinema/${phim.anhPhim.replace(/^.*assets\//, 'assets/') }" alt="${phim.tenPhim}">
        <span class="lcc-age">${phim.doTuoi || "C13"}</span>
      </div>
      <div class="lcc-info">
        <h3 class="lcc-title">${phim.tenPhim}</h3>
        <div class="lcc-meta">
          <span>Thời lượng: ${phim.thoiLuong} phút</span> | <span>Định dạng: ${phim.dinhDang}</span>
        </div>
        ${phim.noiDung ? `<p class="lcc-desc">${phim.noiDung}</p>` : ""}
        <a class="lcc-detail" href="/cop_cinema/pages/chi_tiet_phim.html?maphim=${phim.maPhim}">Xem chi tiết →</a>
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
              <span class="lcc-room">${suat.phong || ''}</span>
              <span class="lcc-price">${phim.giaVe ? phim.giaVe.toLocaleString() + 'đ' : 'Giá: 75.000đ'}</span>
            </div>
          `
          )
          .join("")}
      </div>
    </div>
  `;

  return card;
}
