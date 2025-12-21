document.addEventListener('DOMContentLoaded', () => {
    // Nếu có ?justPaid=1 trên URL thì chỉ hiển thị bill vừa tạo, ngược lại hiển thị toàn bộ lịch sử
    const urlParams = new URLSearchParams(window.location.search);
    const justPaid = urlParams.get('justPaid') === '1';
    const lastBooking = JSON.parse(localStorage.getItem('lastBooking'));
    const historyData = justPaid && lastBooking ? [lastBooking] : (JSON.parse(localStorage.getItem('bookingHistory')) || []);

    // Update selector for new brand-text class if used
    const pageTitle = document.querySelector('.bill-brand-text');
    if (lastBooking && pageTitle) {
        pageTitle.innerHTML = "VÉ VỪA ĐẶT";
    }

    // Update to new container IDs
    const ticketContainer = document.getElementById('bill-ticket-container');
    const invoiceContainer = document.getElementById('bill-invoice-container');

    if (historyData.length === 0) {
        const emptyHTML = `
            <div class="bill-empty-state">
                <i class="fas fa-folder-open fa-3x mb-3"></i>
                <p>Bạn chưa có giao dịch nào.</p>
            </div>`;
        ticketContainer.innerHTML = emptyHTML;
        invoiceContainer.innerHTML = emptyHTML;
        return;
    }

    // Hiển thị từng vé và hóa đơn
    ticketContainer.innerHTML = '';
    invoiceContainer.innerHTML = '';
      historyData.forEach((booking, idx) => {
        // TÍNH TOÁN user, foods, hóa đơn như cũ
        let totalSeatPrice = 0;
        let totalFoodPrice = 0;
        let foodsHTML = '';
        let discountValue = 0;
        let finalTotal = 0;
        let userInfoHTML = '';
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
          userInfoHTML = `
            <div class="bill-receipt-line"><span>Khách:</span><span>${currentUser.fullName || currentUser.username || ''}</span></div>
            <div class="bill-receipt-line"><span>Email:</span><span>${currentUser.email || ''}</span></div>
            <div class="bill-receipt-divider"></div>
          `;
        }
        let bookingDateStr = '';
        if (booking.bookingDate) {
          const d = new Date(booking.bookingDate);
          const date = d.toLocaleDateString('vi-VN');
          const hour = d.getHours().toString().padStart(2, '0');
          const min = d.getMinutes().toString().padStart(2, '0');
          bookingDateStr = `${hour}:${min}, ${date}`;
        }
        if (booking.seats) {
          if (Array.isArray(booking.seatPrices)) {
            totalSeatPrice = booking.seatPrices.reduce((sum, p) => sum + p, 0);
          } else if (typeof booking.seatPrices === 'number') {
            totalSeatPrice = booking.seatPrices;
          } else {
            totalSeatPrice = booking.totalPrice || 0;
          }
        }
        if (booking.foods && booking.foods.length > 0) {
          foodsHTML = `<div class="bill-receipt-line"><span>Đồ ăn đã đặt:</span></div>`;
          totalFoodPrice = 0;
          if (Array.isArray(booking.foods)) {
            booking.foods.forEach(f => {
              if (typeof f === 'object' && f.name && f.qty) {
                let foodTotal = (typeof f.total === 'number') ? f.total : (f.qty * f.price);
                totalFoodPrice += foodTotal;
                foodsHTML += `<div class="bill-receipt-line" style="padding-left:24px; display:flex; justify-content:space-between;"><span>${f.qty}x ${f.name}</span><span>${foodTotal.toLocaleString()}đ</span></div>`;
              }
            });
          } else if (typeof booking.foods === 'string') {
            let foodsArr = booking.foods.split(',').map(f => f.trim());
            foodsArr.forEach(f => {
              let match = f.match(/(\d+)x ([^\(]+)(?:\(([^)]+)\))?/);
              if (match) {
                let qty = parseInt(match[1]);
                let name = match[2].trim();
                let price = match[3] ? parseInt(match[3].replace(/[^\d]/g, '')) : 0;
                let foodTotal = qty * price;
                totalFoodPrice += foodTotal;
                foodsHTML += `<div class="bill-receipt-line" style="padding-left:24px; display:flex; justify-content:space-between;"><span>${qty}x ${name}</span><span>${foodTotal.toLocaleString()}đ</span></div>`;
              } else {
                foodsHTML += `<div class="bill-receipt-line" style="padding-left:24px"><span>${f}</span></div>`;
              }
            });
          }
          foodsHTML += `<div class="bill-receipt-line fw-bold" style="padding-left:24px; display:flex; justify-content:space-between;"><span>Tổng tiền đồ ăn</span><span>${totalFoodPrice.toLocaleString()}đ</span></div>`;
        }
        if (booking.discount && !isNaN(booking.discount)) {
          discountValue = Math.round((totalSeatPrice + totalFoodPrice) * booking.discount);
        }
        finalTotal = totalSeatPrice + totalFoodPrice - discountValue;
        // HIỂN THỊ HÓA ĐƠN
        invoiceContainer.innerHTML += `
        <div class="d-flex justify-content-center w-100">
          <div class="bill-invoice-item-wrapper">
            <div class="bill-thermal-receipt">
              <div class="text-center mb-3">
                <h6 class="mb-1 text-dark">COP CINEMAS PREMIUM</h6>
                <p style="font-size: 10px;" class="mb-0">COP Cinemas Chùa Bộc, Hà Nội</p>
                <p style="font-size: 10px;">ID: <strong>${booking.transactionId || ''}</strong></p>
              </div>
              <div class="bill-receipt-line"><span>Thời gian đặt:</span><span>${bookingDateStr}</span></div>
              ${userInfoHTML}
              <div class="bill-receipt-line"><span class="movie-title-invoice" style="max-width:220px;display:block;margin:0 auto;word-break:break-word;white-space:pre-line;font-weight:bold;text-align:center;">${booking.tenPhim}</span></div>
              <div class="bill-receipt-line"><span>Thời gian chiếu:</span><span>${booking.ngayChieu} - ${booking.gioChieu}</span></div>
              <div class="bill-receipt-line"><span>Ghế:</span><span>${booking.seats}</span></div>
              <div class="bill-receipt-line"><span>Phòng chiếu:</span><span>${booking.phongChieu}</span></div>
              <div class="bill-receipt-line"><span>Định dạng:</span><span>${booking.dinhDang || '2D Digital'}</span></div>
              <div class="bill-receipt-divider"></div>
              <div class="bill-receipt-line" style="display:flex; justify-content:space-between;"><span>Tổng tiền ghế đã đặt</span><span>${totalSeatPrice.toLocaleString()}đ</span></div>
              ${foodsHTML}
              <div class="bill-receipt-line" style="display:flex; justify-content:space-between;"><span>Giảm giá</span><span>-${discountValue.toLocaleString()}đ</span></div>
              <div class="bill-receipt-line fw-bold" style="font-size: 1rem; display:flex; justify-content:space-between;"><span>TỔNG TOÀN BỘ</span><span>${finalTotal.toLocaleString()}đ</span></div>
              <div class="text-center mt-3"><div class="bill-receipt-barcode"></div><p style="font-size: 9px;" class="mt-2 mb-0">Cảm ơn & Hẹn gặp lại!</p></div>
            </div>
          </div>
        </div>
        `;

        // HIỂN THỊ VÉ: mỗi ghế một vé riêng
        let globalIdx = 0;
        const seats = booking.seats ? booking.seats.split(', ') : [];
        const seatPrices = Array.isArray(booking.seatPrices) ? booking.seatPrices : [];
        const qrTasks = [];
        seats.forEach((seat, seatIdx) => {
          let seatList = [];
          if (/^H\d{1,2}-H\d{1,2}$/.test(seat)) {
            seatList = seat.split('-');
          } else {
            seatList = [seat];
          }
          seatList.forEach((singleSeat, subIdx) => {
            let price = seatPrices[seatIdx] || booking.totalSeatPrice || 0;
            if (seatList.length > 1 && seatPrices[seatIdx]) {
              price = Math.round(seatPrices[seatIdx] / seatList.length);
            }
            const qrId = `bill-qr-${globalIdx}`;
            const ticketData = {
              id: booking.transactionId || booking.transactionID || '',
              movie: booking.tenPhim,
              date: booking.ngayChieu,
              time: booking.gioChieu,
              seat: singleSeat,
              room: booking.phongChieu
            };
            const jsonStr = JSON.stringify(ticketData);
            const encodedData = btoa(unescape(encodeURIComponent(jsonStr)));
            const detailUrl = `${window.location.origin}/pages/chi_tiet_ve.html?data=${encodedData}`;
            ticketContainer.innerHTML += `
            <div class="bill-ticket-item">
              <div class="bill-ticket-main">
              <span class="bill-movie-title" style="word-break: break-word; white-space: pre-line; text-align: center; display: block;">${booking.tenPhim}</span>
              <div class="bill-info-grid">
                <div>
                <span class="bill-info-label">Ngày chiếu</span>
                <span class="bill-info-value">${booking.ngayChieu}</span>
                </div>
                <div>
                <span class="bill-info-label">Giờ chiếu</span>
                <span class="bill-info-value">${booking.gioChieu}</span>
                </div>
                <div>
                <span class="bill-info-label">Phòng</span>
                <span class="bill-info-value">${booking.phongChieu}</span>
                </div>
                <div>
                <span class="bill-info-label">Ghế</span>
                <span class="bill-info-value">${singleSeat}</span>
                </div>
                <div>
                <span class="bill-info-label">Định dạng</span>
                <span class="bill-info-value">${booking.dinhDang || '2D Digital'}</span>
                </div>
                <div>
                <span class="bill-info-label">Giá vé</span>
                <span class="bill-info-value">${price.toLocaleString()}đ</span>
                </div>
              </div>
              </div>
              <div class="bill-ticket-side">
              <div class="bill-qr-wrapper"><div id="${qrId}"></div></div>
              <div class="bill-ticket-status">ĐÃ THANH TOÁN</div>
              </div>
            </div>
            `;
            qrTasks.push({ id: qrId, text: detailUrl });
            globalIdx++;
          });
        });
        setTimeout(() => {
          qrTasks.forEach(task => {
            const el = document.getElementById(task.id);
            if (el) {
              el.innerHTML = '';
              new QRCode(el, {
                text: task.text,
                width: 128,
                height: 128,
                correctLevel: QRCode.CorrectLevel.L
              });
            }
          });
        }, 500);
      });
    // localStorage.removeItem('lastBooking'); // Đã bỏ xóa để giữ lại bill mới nhất
});