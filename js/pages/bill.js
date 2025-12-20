// Hàm sinh mã giao dịch tự động
function generateTransactionID() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const segment = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `BBX-${segment()}-${segment()}`;
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. KIỂM TRA XEM CÓ VÉ VỪA ĐẶT KHÔNG
    const lastBooking = JSON.parse(localStorage.getItem('lastBooking'));
    
    // Nếu có lastBooking thì chỉ hiện nó, nếu không thì hiện tất cả history
    const historyData = lastBooking ? [lastBooking] : (JSON.parse(localStorage.getItem('bookingHistory')) || []);

    // Cập nhật tiêu đề trang để người dùng biết mình đang xem gì
    const pageTitle = document.querySelector('.brand-text');
    if (lastBooking && pageTitle) {
        pageTitle.innerHTML = "VÉ VỪA ĐẶT";
    }

    const ticketContainer = document.getElementById('ticket-container');
    const invoiceContainer = document.getElementById('invoice-container');

    if (historyData.length === 0) {
        const emptyHTML = `
            <div class="empty-state">
                <i class="fas fa-folder-open fa-3x mb-3"></i>
                <p>Bạn chưa có giao dịch nào.</p>
            </div>`;
        ticketContainer.innerHTML = emptyHTML;
        invoiceContainer.innerHTML = emptyHTML;
        return;
    }

    let globalIdx = 0;
    const qrTasks = [];

    // Render dữ liệu (Sử dụng slice().reverse() để không làm hỏng mảng gốc)
    historyData.slice().reverse().forEach((booking) => {
        const randomID = generateTransactionID();
        
        // --- PHẦN RENDER VÉ (Giữ nguyên logic của bạn) ---
        const seats = booking.seats ? booking.seats.split(', ') : [];
        seats.forEach(seat => {
            const qrId = `qr-${globalIdx}`;
            const ticketUrl = `${window.location.origin}/ticket.html?id=${booking.bookingDate}&seat=${seat}`;
            const ticketHTML = `
                <div class="ticket-item shadow-lg">
                    <div class="ticket-main">
                        <span class="movie-title text-uppercase">${booking.tenPhim}</span>
                        <div class="info-grid">
                            <div><span class="info-label">Ngày chiếu</span><span class="info-value text-danger">${booking.ngayChieu}</span></div>
                            <div><span class="info-label">Suất chiếu</span><span class="info-value">${booking.gioChieu}</span></div>
                            <div><span class="info-label">Ghế ngồi</span><span class="info-value text-white bg-danger px-2 rounded">${seat}</span></div>
                            <div><span class="info-label">Phòng chiếu</span><span class="info-value">${booking.phongChieu}</span></div>
                            <div><span class="info-label">Định dạng</span><span class="info-value">2D Digital</span></div>
                            <div><span class="info-label">Rạp</span><span class="info-value">BingeBox Chùa Bộc</span></div>
                        </div>
                    </div>
                    <div class="ticket-side">
                        <div class="qr-wrapper"><div id="${qrId}"></div></div>
                        <span class="ticket-status">VÉ HỢP LỆ</span>
                    </div>
                </div>`;
            ticketContainer.insertAdjacentHTML('beforeend', ticketHTML);
            qrTasks.push({ id: qrId, text: ticketUrl });
            globalIdx++;
        });

        // --- PHẦN RENDER HÓA ĐƠN ---
        // Lấy thông tin user nếu có
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let userInfoHTML = '';
        if (currentUser) {
            userInfoHTML = `
                <div class="receipt-line"><span>Khách:</span><span>${currentUser.fullName || currentUser.username || ''}</span></div>
                <div class="receipt-line"><span>Email:</span><span>${currentUser.email || ''}</span></div>
                <div class="receipt-divider"></div>
            `;
        }
        const invoiceHTML = `
            <div class="col-xl-3 col-lg-4 col-md-6 invoice-item-wrapper">
                <div class="thermal-receipt">
                    <div class="text-center mb-3">
                        <h6 class="mb-1 text-dark">BINGEBOX PREMIUM</h6>
                        <p style="font-size: 10px;" class="mb-0">Vincom Chùa Bộc, Hà Nội</p>
                        <p style="font-size: 10px;">ID: <strong>${randomID}</strong></p>
                    </div>
                    <div class="receipt-line"><span>Ngày:</span><span>${booking.ngayChieu}</span></div>
                    ${userInfoHTML}
                    <div class="fw-bold mb-1" style="font-size: 0.85rem;">${booking.tenPhim}</div>
                    <div class="receipt-line"><span>Suất:</span><span>${booking.gioChieu}</span></div>
                    <div class="receipt-line"><span>Ghế:</span><span>${booking.seats}</span></div>
                    <div class="receipt-divider"></div>
                    <div class="receipt-line"><span>Tạm tính:</span><span>${(booking.totalPrice).toLocaleString()}đ</span></div>
                    <div class="receipt-line fw-bold" style="font-size: 1rem;"><span>TỔNG:</span><span>${Number(booking.totalPrice).toLocaleString()}đ</span></div>
                    <div class="text-center mt-3"><div class="receipt-barcode"></div><p style="font-size: 9px;" class="mt-2 mb-0">Cảm ơn & Hẹn gặp lại!</p></div>
                </div>
            </div>`;
        invoiceContainer.insertAdjacentHTML('beforeend', invoiceHTML);
    });

    // Tạo QR Codes
    setTimeout(() => {
        qrTasks.forEach(task => {
            new QRCode(document.getElementById(task.id), {
                text: task.text,
                width: 100, height: 100,
                colorDark: "#000000", colorLight: "#ffffff"
            });
        });
    }, 300);

    // 2. XÓA LASTBOOKING SAU KHI ĐÃ HIỂN THỊ
    // Việc này giúp lần sau người dùng vào trực tiếp trang History sẽ thấy lại toàn bộ lịch sử
    localStorage.removeItem('lastBooking');
});