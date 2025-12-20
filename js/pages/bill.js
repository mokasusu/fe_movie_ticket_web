document.addEventListener('DOMContentLoaded', () => {
    const lastBooking = JSON.parse(localStorage.getItem('lastBooking'));
    const historyData = lastBooking ? [lastBooking] : (JSON.parse(localStorage.getItem('bookingHistory')) || []);

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

    let globalIdx = 0;
    const qrTasks = [];
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // Lấy booking mới nhất (chỉ 1 hóa đơn/vé)
    const booking = historyData.slice().reverse()[0];
    // QUAN TRỌNG: Lấy mã đã lưu từ booking.js
    const displayID = booking.transactionId || 'Đang cập nhật';
    // --- RENDER VÉ ---
    const seats = booking.seats ? booking.seats.split(', ') : [];
    ticketContainer.innerHTML = '<div class="d-flex flex-column align-items-center w-100">';
    seats.forEach(seat => {
        const qrId = `qr-${globalIdx}`;
        const ticketUrl = `${window.location.origin}/ticket.html?id=${booking.bookingDate}&seat=${seat}`;
        const ticketHTML = `
            <div class="bill-ticket-item shadow-lg mb-4 w-100" style="max-width:900px; min-width:320px;">
                <div class="bill-ticket-main">
                    <span class="bill-movie-title text-uppercase">${booking.tenPhim}</span>
                    <div class="bill-info-grid">
                        <div><span class="bill-info-label">Ngày chiếu</span><span class="bill-info-value text-danger">${booking.ngayChieu}</span></div>
                        <div><span class="bill-info-label">Suất chiếu</span><span class="bill-info-value">${booking.gioChieu}</span></div>
                        <div><span class="bill-info-label">Ghế ngồi</span><span class="bill-info-value text-white bg-danger px-2 rounded">${seat}</span></div>
                        <div><span class="bill-info-label">Phòng chiếu</span><span class="bill-info-value">${booking.phongChieu}</span></div>
                        <div><span class="bill-info-label">Định dạng</span><span class="bill-info-value">2D Digital</span></div>
                        <div><span class="bill-info-label">Rạp</span><span class="bill-info-value">COP Cinemas Chùa Bộc</span></div>
                    </div>
                </div>
                <div class="bill-ticket-side">
                    <div class="bill-qr-wrapper"><div id="${qrId}"></div></div>
                    <span class="bill-ticket-status">VÉ HỢP LỆ</span>
                </div>
            </div>`;
        ticketContainer.insertAdjacentHTML('beforeend', ticketHTML);
        qrTasks.push({ id: qrId, text: ticketUrl });
        globalIdx++;
    });
    ticketContainer.innerHTML += '</div>';
    // --- RENDER HÓA ĐƠN ---
    let userInfoHTML = '';
    if (currentUser) {
        userInfoHTML = `
            <div class="bill-receipt-line"><span>Khách:</span><span>${currentUser.fullName || currentUser.username || ''}</span></div>
            <div class="bill-receipt-line"><span>Email:</span><span>${currentUser.email || ''}</span></div>
            <div class="bill-receipt-divider"></div>
        `;
    }
    invoiceContainer.innerHTML = `
        <div class="d-flex justify-content-center w-100">
            <div class="bill-invoice-item-wrapper">
                <div class="bill-thermal-receipt">
                    <div class="text-center mb-3">
                        <h6 class="mb-1 text-dark">COP CINEMAS PREMIUM</h6>
                        <p style="font-size: 10px;" class="mb-0">COP Cinemas Chùa Bộc, Hà Nội</p>
                        <p style="font-size: 10px;">ID: <strong>${displayID}</strong></p>
                    </div>
                    <div class="bill-receipt-line"><span>Ngày:</span><span>${booking.ngayChieu}</span></div>
                    ${userInfoHTML}
                    <div class="fw-bold mb-1" style="font-size: 0.85rem;">${booking.tenPhim}</div>
                    <div class="bill-receipt-line"><span>Suất:</span><span>${booking.gioChieu}</span></div>
                    <div class="bill-receipt-line"><span>Ghế:</span><span>${booking.seats}</span></div>
                    <div class="bill-receipt-divider"></div>
                    <div class="bill-receipt-line"><span>Tạm tính:</span><span>${(booking.totalPrice).toLocaleString()}đ</span></div>
                    <div class="bill-receipt-line fw-bold" style="font-size: 1rem;"><span>TỔNG:</span><span>${Number(booking.totalPrice).toLocaleString()}đ</span></div>
                    <div class="text-center mt-3"><div class="bill-receipt-barcode"></div><p style="font-size: 9px;" class="mt-2 mb-0">Cảm ơn & Hẹn gặp lại!</p></div>
                </div>
            </div>
        </div>
    `;
    // Tạo QR Codes
    setTimeout(() => {
        qrTasks.forEach(task => {
            if (typeof QRCode !== 'undefined') {
                new QRCode(document.getElementById(task.id), {
                    text: task.text,
                    width: 100, height: 100,
                    colorDark: "#000000", colorLight: "#ffffff"
                });
            }
        });
    }, 300);
    localStorage.removeItem('lastBooking');
});