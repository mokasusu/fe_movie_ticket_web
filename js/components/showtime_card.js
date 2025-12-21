
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
        <a
          class="lcc-detail"
          href="/cop_cinema/pages/chi_tiet_phim.html?maphim=${phim.maPhim}"
        >
          Xem chi tiết →
        </a>
        </p>

        ${phim.noiDung ? `<p class="lcc-desc">${phim.noiDung}</p>` : ""}

        <a
          class="lcc-detail"
          href="chi_tiet_phim.html?maphim=${phim.maPhim}"
        >
          Xem chi tiết →
        </a>
      </div>
    </div>

    <!-- ROW 2: SUẤT CHIẾU -->
    <div class="lcc-row lcc-row-bottom">
      <div class="lcc-showtimes">
        ${suatChieuList
          .map(
            suat => `
            <span
              class="lcc-showtime"
              data-maphim="${phim.maPhim}"
              data-ngay="${suat.ngay}"
              data-gio="${suat.gio}"
            >
              ${suat.gio}
            </span>
          `
          )
          .join("")}
      </div>
    </div>
  `;

  return card;
}
