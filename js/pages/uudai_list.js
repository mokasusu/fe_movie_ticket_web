import { BASE_PATH } from "../config.js";

const UUDAI_DATA = [
    {
        id: '01',
        title: "VOUCHER 30.000Đ",
        image: BASE_PATH + "/assets/images/uudai/uudai1.jpg",
        description: "TẶNG VOUCHER 30.000Đ KHI ĐẶT VÉ XEM PHIM QUA VÍ MOMO",
        content: `
            🎭Voucher xem phim trị giá <strong>30.000đ</strong> khi đặt vé xem phim của COP Cinema trên Ví điện tử MOMO.<br>
            🍿Áp dụng giao dịch có giá trị từ 99.000đ trở lên.<br>
            📅Thời gian áp dụng: 15/12/2025 đến hết ngày 28/12/2025.<br>
        `
    },
    {
        id: '02',
        title: "GIÁ VÉ 55.000Đ/VÉ 2D",
        image: BASE_PATH + "/assets/images/uudai/uudai2.jpg",
        description: "ƯU ĐÃI GIÁ VÉ 55.000Đ/VÉ 2D CHO THÀNH VIÊN U22",
        content: `
            Học sinh, sinh viên, hoặc khán giả từ 22 tuổi trở xuống đều đăng ký được.<br>
            Áp dụng từ Thứ 2 đến Thứ 6.<br>
            Mỗi ngày mua được 1 vé giá ưu đãi.<br>
            Chỉ áp dụng mua trực tiếp tại quầy, không dùng cho ghế đôi.<br>
            Nhớ mang theo thẻ U22 (bản cứng hoặc bản điện tử trên thiết bị di động) khi mua vé nha!
        `
    },
    {
        id: '03',
        title: "CHÀO TẾT, VÉ XEM PHIM ƯU ĐÃI THẢ GA",
        image: BASE_PATH + "/assets/images/uudai/uudai3.jpg",
        description: "CHÀO TẾT, VÉ XEM PHIM ƯU ĐÃI THẢ GA ",
        content: `
            *Đặt vé xem phim trên Ứng dụng Ngân hàng di động...<br>
            Nhập mã "PHIMTET" để nhận ưu đãi:<br>
                - Giảm 10% khi mua 1 vé xem phim <br>
                - Giảm 20% khi mua 2 vé xem phim <br>
                - Giảm 30% tối đa 60K khi mua từ 3 vé xem phim <br>
                - Thời gian: Từ 10/02 đến hết 20/02 <br>
            Lưu ý: Ưu đãi chỉ áp dụng 01 lần/khách hàng 
        `
    },
    {
        id: '04',
        title: "NGÀY HỘI GIA ĐÌNH",
        image: BASE_PATH + "/assets/images/uudai/uudai4.jpg",
        description: "Gói vé gia đình 4 người chỉ 150.000đ, áp dụng cuối tuần.",
        content: `
            Gói vé 4 người chỉ 150.000đ.
            Áp dụng cuối tuần (Thứ 7 & CN).
            Không áp dụng kèm khuyến mãi khác.
            Mỗi nhóm chỉ mua 1 gói khuyến mãi mỗi ngày.
        `
    },
];

// --- HÀM KHỞI TẠO (Thay thế cho DOMContentLoaded) ---
function initUudaiPage() {
    console.log("Init Uudai Page..."); // Log kiểm tra
    const container = document.getElementById('uudai-container');
    const modal = document.getElementById('promoModal');
    const closeBtn = document.querySelector('.close-btn');

    if (!container) {
        console.error("Không tìm thấy phần tử #uudai-container");
        return;
    }

    // 1. Render danh sách thẻ ưu đãi
    container.innerHTML = ''; // Xóa nội dung cũ nếu có
    UUDAI_DATA.forEach(item => {
        const card = document.createElement('div');
        card.className = 'promo-card';
        
        // Xử lý đường dẫn ảnh an toàn (tránh ///)
        // Cách xử lý: Nếu item.image đã chứa BASE_PATH (do nối chuỗi ở trên), ta dùng luôn
        // Nếu muốn an toàn tuyệt đối:
        let displayImage = item.image;
        
        card.innerHTML = `
            <div class="promo-img">
                <img src="${displayImage}" alt="${item.title}" onerror="this.src='${BASE_PATH}/assets/images/posters/default.jpg'">
            </div>
            <div class="promo-info">
                <div class="promo-title">${item.title}</div>
                <div class="promo-desc">${item.description}</div>
            </div>
        `;

        // Sự kiện click mở Modal
        card.onclick = () => openPromo(item, modal);
        container.appendChild(card);
    });

    // 2. Hàm mở Modal chi tiết
    function openPromo(item, modalEl) {
        document.getElementById('modal-title').textContent = item.title;
        document.getElementById('modal-body').innerHTML = item.content;
        modalEl.style.display = 'flex';
    }

    // 3. Đóng Modal
    if (closeBtn) closeBtn.onclick = () => modal.style.display = 'none';
    
    window.onclick = (event) => {
        if (event.target == modal) modal.style.display = 'none';
    };
}

// Gọi hàm chạy ngay lập tức
initUudaiPage();