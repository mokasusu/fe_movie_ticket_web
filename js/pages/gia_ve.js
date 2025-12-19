// 1. Cấu hình dữ liệu giá gốc (2D)
const PRICE_DATA = [
    { time: "Trước 10:00", standard: 60000, vip: 85000, couple: 160000 },
    { time: "10:00 - 18:00", standard: 85000, vip: 110000, couple: 185000 },
    { time: "18:00 - 23:00", standard: 105000, vip: 130000, couple: 205000 },
    { time: "Sau 23:00", standard: 75000, vip: 100000, couple: 175000 }
];

// 2. Phụ thu cho phim 3D
const SURCHARGE_3D = 30000;

document.addEventListener('DOMContentLoaded', () => {
    const tbody2d = document.getElementById('tbody-2d');
    const tbody3d = document.getElementById('tbody-3d');

    // Hàm render bảng
    function renderPrices() {
        let html2d = '';
        let html3d = '';

        PRICE_DATA.forEach(item => {
            // Render cho bảng 2D
            html2d += `
                <tr>
                    <td class="time-slot">${item.time}</td>
                    <td>${item.standard.toLocaleString()}đ</td>
                    <td class="col-vip">${item.vip.toLocaleString()}đ</td>
                    <td class="col-couple">${item.couple.toLocaleString()}đ</td>
                </tr>
            `;

            // Render cho bảng 3D (Tự động cộng thêm phụ thu)
            html3d += `
                <tr>
                    <td class="time-slot">${item.time}</td>
                    <td>${(item.standard + SURCHARGE_3D).toLocaleString()}đ</td>
                    <td class="col-vip">${(item.vip + SURCHARGE_3D).toLocaleString()}đ</td>
                    <td class="col-couple">${(item.couple + SURCHARGE_3D + 0).toLocaleString()}đ</td>
                </tr>
            `;
        });

        tbody2d.innerHTML = html2d;
        tbody3d.innerHTML = html3d;
    }

    renderPrices();
});