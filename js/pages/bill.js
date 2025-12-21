import { BASE_PATH } from '../config.js'; // Đảm bảo đường dẫn đúng

// Tạo một hàm khởi tạo để chạy logic
function initBillPage() {
    console.log("Bill page init started..."); // Log để kiểm tra

    // 1. Lấy dữ liệu từ URL và LocalStorage
    const urlParams = new URLSearchParams(window.location.search);
    const justPaid = urlParams.get('justPaid') === '1';
    
    // Debug dữ liệu
    const lastBookingRaw = localStorage.getItem('lastBooking');
    const historyRaw = localStorage.getItem('bookingHistory');
    console.log("Just Paid:", justPaid);
    console.log("Last Booking:", lastBookingRaw);

    const lastBooking = JSON.parse(lastBookingRaw);
    // Nếu vừa thanh toán và có lastBooking thì chỉ hiện nó, nếu không thì hiện lịch sử
    const historyData = (justPaid && lastBooking) ? [lastBooking] : (JSON.parse(historyRaw) || []);

    // 2. Cập nhật tiêu đề nếu cần
    const pageTitle = document.querySelector('.bill-brand-text');
    if (justPaid && lastBooking && pageTitle) {
        pageTitle.innerHTML = "VÉ VỪA ĐẶT";
    }

    // 3. Lấy DOM container
    const ticketContainer = document.getElementById('bill-ticket-container');
    const invoiceContainer = document.getElementById('bill-invoice-container');

    // Kiểm tra DOM có tồn tại không
    if (!ticketContainer || !invoiceContainer) {
        console.error("Không tìm thấy container hiển thị bill (bill-ticket-container hoặc bill-invoice-container)");
        return;
    }

    // 4. Xử lý trường hợp không có dữ liệu
    if (historyData.length === 0) {
        const emptyHTML = `
            <div class="bill-empty-state">
                <i class="fas fa-folder-open fa-3x mb-3"></i>
                <p>Bạn chưa có giao dịch nào.</p>
                <a href="${BASE_PATH}/index.html" class="bill-btn-home mt-3 d-inline-block">VỀ TRANG CHỦ</a>
            </div>`;
        ticketContainer.innerHTML = emptyHTML;
        invoiceContainer.innerHTML = emptyHTML;
        return;
    }

    // 5. Render dữ liệu
    ticketContainer.innerHTML = '';
    invoiceContainer.innerHTML = '';

    historyData.forEach((booking, idx) => {
        // --- LOGIC TÍNH TOÁN GIÁ ---
        let totalSeatPrice = 0;
        let totalFoodPrice = 0;
        let foodsHTML = '';
        let discountValue = 0;
        let finalTotal = 0;

        // Tính giá ghế
        if (booking.seats) {
            if (Array.isArray(booking.seatPrices)) {
                totalSeatPrice = booking.seatPrices.reduce((sum, p) => sum + p, 0);
            } else if (typeof booking.seatPrices === 'number') {
                totalSeatPrice = booking.seatPrices;
            } else {
                totalSeatPrice = booking.totalPrice || 0;
            }
        }

        // Tính giá đồ ăn và tạo HTML
        if (booking.foods && booking.foods.length > 0) {
            foodsHTML = `<div class="bill-receipt-line"><span>Đồ ăn đã đặt:</span></div>`;
            totalFoodPrice = 0;
            
            // Chuẩn hóa mảng foods (xử lý cả trường hợp object cũ hoặc chuỗi)
            let foodsArray = [];
            if (Array.isArray(booking.foods)) {
                foodsArray = booking.foods;
            } else if (typeof booking.foods === 'string') {
                // Parse chuỗi kiểu cũ "2x Bắp (20000)"
                booking.foods.split(',').forEach(f => {
                    let match = f.trim().match(/(\d+)x ([^\(]+)(?:\(([^)]+)\))?/);
                    if (match) {
                        foodsArray.push({
                            qty: parseInt(match[1]),
                            name: match[2].trim(),
                            price: match[3] ? parseInt(match[3].replace(/[^\d]/g, '')) : 0,
                            total: 0 // Sẽ tính lại sau
                        });
                    } else {
                         // Fallback nếu không parse được
                         foodsHTML += `<div class="bill-receipt-line" style="padding-left:24px"><span>${f}</span></div>`;
                    }
                });
            }

            foodsArray.forEach(f => {
                let itemTotal = (typeof f.total === 'number' && f.total > 0) ? f.total : (f.qty * f.price);
                totalFoodPrice += itemTotal;
                foodsHTML += `<div class="bill-receipt-line" style="padding-left:24px; display:flex; justify-content:space-between;">
                                <span>${f.qty}x ${f.name}</span>
                                <span>${itemTotal.toLocaleString()}đ</span>
                              </div>`;
            });
            
            foodsHTML += `<div class="bill-receipt-line fw-bold" style="padding-left:24px; display:flex; justify-content:space-between;">
                            <span>Tổng tiền đồ ăn</span>
                            <span>${totalFoodPrice.toLocaleString()}đ</span>
                          </div>`;
        }

        // Tính giảm giá và tổng
        if (booking.discount && !isNaN(booking.discount)) {
            discountValue = Math.round((totalSeatPrice + totalFoodPrice) * booking.discount);
        }
        finalTotal = totalSeatPrice + totalFoodPrice - discountValue;

        // Xử lý thông tin user
        let userInfoHTML = '';
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            userInfoHTML = `
            <div class="bill-receipt-line"><span>Khách:</span><span>${currentUser.fullName || currentUser.username || 'Khách'}</span></div>
            <div class="bill-receipt-line"><span>Email:</span><span>${currentUser.email || ''}</span></div>
            <div class="bill-receipt-divider"></div>`;
        }

        // Xử lý ngày giờ hiển thị
        let bookingDateStr = '';
        if (booking.bookingDate) {
            const d = new Date(booking.bookingDate);
            bookingDateStr = `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}, ${d.toLocaleDateString('vi-VN')}`;
        }

        // --- RENDER HÓA ĐƠN (TAB 2) ---
        invoiceContainer.innerHTML += `
        <div class="d-flex justify-content-center w-100 mb-4">
          <div class="bill-invoice-item-wrapper">
            <div class="bill-thermal-receipt">
              <div class="text-center mb-3">
                <h6 class="mb-1 text-dark">COP CINEMAS PREMIUM</h6>
                <p style="font-size: 10px;" class="mb-0">COP Cinemas Chùa Bộc, Hà Nội</p>
                <p style="font-size: 10px;">ID: <strong>${booking.transactionId || 'UNKNOWN'}</strong></p>
              </div>
              <div class="bill-receipt-line"><span>Thời gian đặt:</span><span>${bookingDateStr}</span></div>
              ${userInfoHTML}
              <div class="bill-receipt-line"><span class="movie-title-invoice" style="max-width:220px;display:block;margin:0 auto;word-break:break-word;font-weight:bold;text-align:center;">${booking.tenPhim}</span></div>
              <div class="bill-receipt-line"><span>Suất chiếu:</span><span>${booking.gioChieu} - ${booking.ngayChieu}</span></div>
              <div class="bill-receipt-line"><span>Phòng:</span><span>${booking.phongChieu}</span></div>
              <div class="bill-receipt-line"><span>Ghế:</span><span>${booking.seats}</span></div>
              <div class="bill-receipt-divider"></div>
              
              <div class="bill-receipt-line" style="display:flex; justify-content:space-between;"><span>Tổng tiền ghế</span><span>${totalSeatPrice.toLocaleString()}đ</span></div>
              ${foodsHTML}
              
              <div class="bill-receipt-divider"></div>
              <div class="bill-receipt-line" style="display:flex; justify-content:space-between;"><span>Tạm tính</span><span>${(totalSeatPrice + totalFoodPrice).toLocaleString()}đ</span></div>
              <div class="bill-receipt-line" style="display:flex; justify-content:space-between;"><span>Giảm giá</span><span>-${discountValue.toLocaleString()}đ</span></div>
              <div class="bill-receipt-line fw-bold" style="font-size: 1rem; display:flex; justify-content:space-between;"><span>THANH TOÁN</span><span>${finalTotal.toLocaleString()}đ</span></div>
              
              <div class="text-center mt-3">
                <div class="bill-receipt-barcode"></div>
                <p style="font-size: 9px;" class="mt-2 mb-0">Cảm ơn quý khách!</p>
              </div>
            </div>
          </div>
        </div>`;

        // --- RENDER VÉ (TAB 1) - Tách từng ghế ---
        let seats = booking.seats ? booking.seats.split(', ') : [];
        let seatPrices = Array.isArray(booking.seatPrices) ? booking.seatPrices : [];
        
        seats.forEach((seatGroup, sIdx) => {
            // Xử lý ghế đôi (VD: H1-H2) hoặc ghế đơn
            let individualSeats = seatGroup.includes('-') ? seatGroup.split('-') : [seatGroup];
            
            individualSeats.forEach(singleSeat => {
                // Tính giá vé đơn lẻ (ước lượng nếu là combo)
                let unitPrice = 0;
                if(seatPrices[sIdx]) {
                    unitPrice = Math.round(seatPrices[sIdx] / individualSeats.length);
                } else {
                    unitPrice = Math.round(totalSeatPrice / (seats.length * individualSeats.length)); // Fallback
                }

                const qrId = `qr-${booking.transactionId}-${singleSeat}`;
                // Tạo dữ liệu QR an toàn
                const ticketInfo = {
                    id: booking.transactionId,
                    movie: booking.tenPhim,
                    seat: singleSeat,
                    room: booking.phongChieu,
                    date: booking.ngayChieu,
                    time: booking.gioChieu
                };
                
                // Mã hóa dữ liệu QR để tránh lỗi ký tự đặc biệt
                const qrData = encodeURIComponent(JSON.stringify(ticketInfo));
                const detailUrl = `${window.location.origin}${BASE_PATH}/pages/chi_tiet_ve.html?data=${qrData}`;

                ticketContainer.innerHTML += `
                <div class="bill-ticket-item">
                  <div class="bill-ticket-main">
                    <span class="bill-movie-title">${booking.tenPhim}</span>
                    <div class="bill-info-grid">
                        <div><span class="bill-info-label">Ngày</span><span class="bill-info-value">${booking.ngayChieu}</span></div>
                        <div><span class="bill-info-label">Giờ</span><span class="bill-info-value">${booking.gioChieu}</span></div>
                        <div><span class="bill-info-label">Phòng</span><span class="bill-info-value">${booking.phongChieu}</span></div>
                        <div><span class="bill-info-label">Ghế</span><span class="bill-info-value text-danger" style="font-size:1.2rem">${singleSeat}</span></div>
                        <div><span class="bill-info-label">Định dạng</span><span class="bill-info-value">${booking.dinhDang || '2D'}</span></div>
                        <div><span class="bill-info-label">Giá vé</span><span class="bill-info-value">${unitPrice.toLocaleString()}đ</span></div>
                    </div>
                  </div>
                  <div class="bill-ticket-side">
                    <div class="bill-qr-wrapper">
                        <div id="${qrId}"></div>
                    </div>
                    <div class="bill-ticket-status">ĐÃ THANH TOÁN</div>
                  </div>
                </div>`;

                // Tạo QR Code sau khi DOM đã được chèn
                setTimeout(() => {
                    const el = document.getElementById(qrId);
                    if (el && typeof QRCode !== 'undefined') {
                        el.innerHTML = '';
                        new QRCode(el, {
                            text: detailUrl,
                            width: 100,
                            height: 100,
                            colorDark : "#000000",
                            colorLight : "#ffffff",
                            correctLevel : QRCode.CorrectLevel.L
                        });
                    }
                }, 100);
            });
        });
    });
}

// GỌI HÀM KHỞI TẠO NGAY LẬP TỨC (Không dùng DOMContentLoaded)
initBillPage();