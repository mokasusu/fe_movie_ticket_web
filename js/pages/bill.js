document.addEventListener('DOMContentLoaded', () => {
    const lastBooking = JSON.parse(localStorage.getItem('lastBooking'));

    if (!lastBooking) {
        window.location.href = '/index.html';
        return;
    }

    const tContainer = document.getElementById('ticket-container');
    const iContainer = document.getElementById('invoice-container');

    // Chỉ render 1 vé vừa mua
    renderData([lastBooking], tContainer, iContainer);

    // Xóa để không bị hiện lại khi vào trang bill bằng link trực tiếp
    localStorage.removeItem('lastBooking');
});