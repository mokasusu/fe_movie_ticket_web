import movies from "../data/phim.js";
import { createLichChieuCard } from "../components/showtime_card.js";

const movieListEl = document.getElementById("movie-list");
const dateButtons = document.querySelectorAll(".date-btn");

function renderLichChieu(ngayChon) {
  movieListEl.innerHTML = "";

  const phimTrongNgay = movies.filter(phim =>
    phim.lichChieu?.some(lc => lc.ngayChieu === ngayChon)
  );

  if (phimTrongNgay.length === 0) {
    movieListEl.innerHTML = `
      <p class="no-movie">Không có suất chiếu trong ngày này.</p>
    `;
    return;
  }

  phimTrongNgay.forEach(phim => {
    const lich = phim.lichChieu.find(lc => lc.ngayChieu === ngayChon);

    const suatChieuList = lich.suatChieu.map(suat => ({
      gio: suat.gioChieu,
      phong: suat.phongChieu,
      maPhim: phim.maPhim,
      ngay: ngayChon
    }));

    const card = createLichChieuCard(phim, suatChieuList);
    movieListEl.appendChild(card);
  });

  bindSuatClick();
}

function bindSuatClick() {
  document.querySelectorAll(".lcc-showtime").forEach(item => {
    item.addEventListener("click", () => {
      const data = {
        maPhim: item.dataset.maphim,
        ngay: item.dataset.ngay,
        gio: item.dataset.gio
      };

      localStorage.setItem(
        "selectedShowtime",
        JSON.stringify(data)
      );

      alert(
        `Đã chọn:\nPhim: ${data.maPhim}\nNgày: ${data.ngay}\nGiờ: ${data.gio}`
      );

      // window.location.href = "/pages/chon_ghe.html";
    });
  });
}

dateButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    dateButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    renderLichChieu(btn.dataset.ngay);
  });
});

dateButtons[0].classList.add("active");
renderLichChieu(dateButtons[0].dataset.ngay);
