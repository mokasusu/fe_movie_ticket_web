// Sử dụng hàm renderData từ chung_vecuatoi_bill.js để hiển thị nhiều vé cho mỗi ghế
document.addEventListener('DOMContentLoaded', () => {
    const lastBooking = JSON.parse(localStorage.getItem('lastBooking'));
    const bookingHistory = lastBooking ? [lastBooking] : [];

    const tContainer = document.getElementById('ticket-container');
    const iContainer = document.getElementById('invoice-container');

    if (bookingHistory.length === 0) {
        const empty = `
            <div class="empty-state text-center py-5">
                <i class="fas fa-folder-open fa-3x mb-3" style="opacity: 0.2"></i>
                <p>Bạn chưa có lịch sử đặt vé nào.</p>
            </div>`;
        tContainer.innerHTML = empty;
        iContainer.innerHTML = empty;
        return;
    }

    // Hiển thị bill mới nhất, mỗi ghế một vé
    if (typeof renderData === 'function') {
        renderData(bookingHistory, tContainer, iContainer);
    } else {
        // Nếu renderData chưa có, báo lỗi rõ ràng
        tContainer.innerHTML = '<div class="alert alert-danger">Không tìm thấy hàm renderData để hiển thị vé.</div>';
    }
});