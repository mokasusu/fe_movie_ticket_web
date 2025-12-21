import { BASE_PATH } from "../config.js";
// Khởi tạo dữ liệu hệ thống rạp
const cinemaData = {
    'rap1': {
        name: 'COP Cinema Chùa Bộc',
        description: 'Nằm tại phường Kim Liên, COP Cinema Chùa Bộc là rạp chiếu phim hiện đại với 5 phòng chiếu được trang bị công nghệ hình ảnh và âm thanh tối tân. Rạp có thiết thiết kế sang trọng, không gian rộng rãi và thoải mái cho khán giả.',
        facilities: 'Hệ thống 5 phòng chiếu, Công nghệ âm thanh Dolby Atmos, Màn hình cong, Ghế bọc da cao cấp, Khu vực ẩm thực phong phú.',
        address: '7 P. Chùa Bộc, Kim Liên, Hà Nội',
        phone: '024.247.6886',
        email: 'chuaboc@popcinema.vn',
        openHours: '8:00 - 24:00 hàng ngày',
        image: 'assets/icons/rap_1.png',
        mapLink: 'https://www.google.com/search?q=King+Building%2C+7+P.+Ch%C3%B9a+B%E1%BB%99c%2C+Kim+Li%C3%AAn%2C+H%C3%A0+N%E1%BB%99i'
    }
};


// Đảm bảo chỉ render khi #cinema-content đã có trong DOM (sau khi header/footer được inject)
function waitAndRenderCinema() {
    const container = document.getElementById('cinema-content');
    if (container) {
        renderCinemaDetail('rap1');
    } else {
        setTimeout(waitAndRenderCinema, 50);
    }
}
waitAndRenderCinema();

function renderCinemaDetail(id) {
    const rap = cinemaData[id];
    const container = document.getElementById('cinema-content');

    if (!rap) return;

    // Đảm bảo đường dẫn ảnh luôn đúng chuẩn BASE_PATH
    let imageSrc = rap.image.replace(/^\/+/, '');
    imageSrc = `${BASE_PATH}/${imageSrc}`.replace(/\/+/g, '/');
    container.innerHTML = `
        <div class="rap-cinema-image cinema-image">
            <img src="${imageSrc}" alt="${rap.name}">
        </div>
        <div class="rap-cinema-info cinema-info">
            <h1>${rap.name}</h1>
            <p class="rap-cinema-desc cinema-desc">${rap.description}</p>
            <div class="rap-info-list info-list">
                <div class="rap-info-item info-item">
                    <i class="fas fa-star"></i>
                    <div>
                        <span class="rap-info-label info-label">Tiện ích</span>
                        <span class="rap-info-value info-value">${rap.facilities}</span>
                    </div>
                </div>
                <div class="rap-info-item info-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <div>
                        <span class="rap-info-label info-label">Địa chỉ</span>
                        <span class="rap-info-value info-value">${rap.address}</span>
                    </div>
                </div>
                <div class="rap-info-item info-item">
                    <i class="fas fa-phone-alt"></i>
                    <div>
                        <span class="rap-info-label info-label">Điện thoại</span>
                        <span class="rap-info-value info-value">${rap.phone}</span>
                    </div>
                </div>
                <div class="rap-info-item info-item">
                    <i class="fas fa-clock"></i>
                    <div>
                        <span class="rap-info-label info-label">Giờ mở cửa</span>
                        <span class="rap-info-value info-value">${rap.openHours}</span>
                    </div>
                </div>
            </div>
            <a href="${rap.mapLink}" target="_blank" class="rap-btn-map btn-map">
                <i class="fas fa-directions me-2"></i> XEM ĐƯỜNG ĐI
            </a>
        </div>
    `;
}