document.addEventListener('DOMContentLoaded', () => {
    const bookingHistory = JSON.parse(localStorage.getItem('bookingHistory')) || [];

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

    // Render toàn bộ lịch sử, mới nhất lên đầu
    renderData([...bookingHistory].reverse(), tContainer, iContainer);
});