document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const encodedData = params.get('data');

    if (encodedData) {
        try {
            // Giải mã Base64 -> JSON -> Object
            const decodedData = JSON.parse(decodeURIComponent(escape(atob(encodedData))));
            
            // Đổ dữ liệu ra màn hình
            document.getElementById('view-id').textContent = decodedData.id;
            document.getElementById('view-movie').textContent = decodedData.movie;
            document.getElementById('view-date').textContent = decodedData.date;
            document.getElementById('view-time').textContent = decodedData.time;
            document.getElementById('view-room').textContent = decodedData.room;
            document.getElementById('view-seat').textContent = decodedData.seat;

            // Thêm hiệu ứng viết hoa toàn bộ nếu muốn
            document.querySelectorAll('.value').forEach(el => el.style.textTransform = 'uppercase');

        } catch (e) {
            console.error("Lỗi giải mã:", e);
            document.body.innerHTML = "<div class='text-center mt-5'>Mã vé không hợp lệ hoặc đã hết hạn.</div>";
        }
    }
});