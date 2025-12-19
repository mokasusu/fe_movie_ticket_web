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
            const maPhim = item.dataset.maphim;
            
            // 1. Tìm phim trong mảng movies bạn vừa cung cấp
            // Giả sử mảng movies đã được import vào file này
            const phimInfo = movies.find(p => p.maPhim === maPhim);

            if (!phimInfo) {
                console.error("Không tìm thấy phim với mã:", maPhim);
                return;
            }

            // 2. Đóng gói dữ liệu cực kỳ chi tiết để trang Booking dùng luôn
            const data = {
                maPhim: phimInfo.maPhim,
                tenPhim: phimInfo.tenPhim,
                anhPhim: phimInfo.anhPhim,   // Khớp với 'assets/images/posters/...'
                doTuoi: phimInfo.doTuoi,     // Khớp với 'K', 'C13', 'C16'
                thoiLuong: phimInfo.thoiLuong,
                dinhDang: phimInfo.dinhDang,
                ngayChieu: item.dataset.ngay,
                gioChieu: item.dataset.gio,
                phongChieu: item.dataset.phong || "Phòng chiếu"
            };

            // 3. Lưu vào localStorage với key 'currentBooking' 
            // (Vì file booking.js của bạn đang dùng key này)
            localStorage.setItem("currentBooking", JSON.stringify(data));

            // 4. Chuyển hướng sang màn hình chọn ghế
            window.location.href = "/pages/booking.html"; 
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
