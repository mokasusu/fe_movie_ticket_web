/* --- CẤU HÌNH GIÁ VÉ (Khớp với bang_gia.js) --- */
const PRICE_CONFIG = {
    movieType: { '2D': 0, '3D': 30000 },
    timeSlots: [
        { start: 6, end: 10, price: 60000 },  // Trước 10h
        { start: 10, end: 18, price: 85000 }, // 10h - 18h
        { start: 18, end: 23, price: 105000 },// 18h - 23h
        { start: 23, end: 6, price: 75000 }  // Sau 23h
    ],
    seatType: { 'standard': 0, 'vip': 25000, 'couple': 100000 } // Phụ thu ghế Couple tính trên giá gốc 1 người
};

let currentStep = 0; 
const steps = ["seat", "food", "payment"];

let selectedSeats = []; 
let selectedFood = {};  
let discount = 0;       
let paymentMethod = ""; 
let bookingData = null; // Biến lưu dữ liệu phim hiện tại

$(document).ready(() => {
    // 1. Lấy và hiển thị dữ liệu từ localStorage
    bookingData = JSON.parse(localStorage.getItem('currentBooking'));

    if (bookingData) {
        $('.movie-title').text(bookingData.tenPhim.toUpperCase());
        $('.movie-image img').attr('src', "../" + bookingData.anhPhim); 
        $('.movie-age').text(bookingData.doTuoi);
        $('.movie-content ul').html(`
            <li>${bookingData.dinhDang}</li>
            <li>Phụ đề</li>
            <li>${bookingData.thoiLuong} phút</li>
        `);
        $('.cinema-number').text(bookingData.phongChieu);
        $('.showtime-number').text(`Suất chiếu: ${bookingData.gioChieu}`);
        $('.showtime-day').text(bookingData.ngayChieu);
    } else {
        showNotification("Không tìm thấy thông tin đặt vé, vui lòng chọn lại!");
        setTimeout(() => { window.location.href = '/pages/lich_chieu.html'; }, 2000);
    }

    generateSeatMap();
    renderSummary(); 
});

/* --- HÀM TÍNH GIÁ VÉ ĐỘNG --- */
function calculateDynamicPrice(seatType) {
    if (!bookingData) return 0;

    // 1. Lấy giá theo khung giờ (Suất chiếu)
    const hour = parseInt(bookingData.gioChieu.split(':')[0]);
    const slot = PRICE_CONFIG.timeSlots.find(s => hour >= s.start && hour < s.end);
    const basePrice = slot ? slot.price : 85000;

    // 2. Phụ thu loại phim (2D/3D)
    const formatSurcharge = PRICE_CONFIG.movieType[bookingData.dinhDang] || 0;

    // 3. Phụ thu loại ghế
    const seatSurcharge = PRICE_CONFIG.seatType[seatType] || 0;

    return basePrice + formatSurcharge + seatSurcharge;
}

/* --- XỬ LÝ CHỌN GHẾ --- */
function toggleSeat(id, type, el) {
    $(el).toggleClass('selected');
    const idx = selectedSeats.findIndex(s => s.id === id);
    
    if(idx > -1) {
        selectedSeats.splice(idx, 1);
    } else {
        // Tính giá dựa trên phim và khung giờ thực tế
        const price = calculateDynamicPrice(type);
        selectedSeats.push({ id, type, price: price });
    }
    renderSummary();
}

function toggleCoupleSeat(id, el) {
    const num = parseInt(id.substring(1));
    const partnerNum = num % 2 === 0 ? num - 1 : num + 1;
    const partnerId = 'H' + partnerNum;
    const pairId = num % 2 === 0 ? `${partnerId}-${id}` : `${id}-${partnerId}`;
    const partnerEl = $(`.seat-item[onclick*="'${partnerId}'"]`);

    const idx = selectedSeats.findIndex(s => s.id === pairId);
    if(idx > -1) {
        selectedSeats.splice(idx, 1);
        $(el).removeClass('selected');
        partnerEl.removeClass('selected');
    } else {
        // Ghế Couple tính theo logic tính giá riêng
        const price = calculateDynamicPrice('couple');
        selectedSeats.push({ id: pairId, type: 'couple', price: price });
        $(el).addClass('selected');
        partnerEl.addClass('selected');
    }
    renderSummary();
}

/* --- CẬP NHẬT GIAO DIỆN VÉ --- */
function renderSummary() {
    // Phần ghế hiển thị giá cụ thể từng loại
    let seatHtml = selectedSeats.length > 0 ? '' : '<div class="ticket-item text-muted small py-2">Chưa chọn ghế</div>';
    if(selectedSeats.length > 0) {
        const groups = selectedSeats.reduce((acc, seat) => {
            if (!acc[seat.type]) acc[seat.type] = { count: 0, ids: [], price: seat.price };
            acc[seat.type].count++;
            acc[seat.type].ids.push(seat.id);
            return acc;
        }, {});

        const typeNames = { standard: 'Ghế đơn', vip: 'Ghế VIP', couple: 'Ghế Couple' };
        
        Object.keys(groups).forEach(type => { group = groups[type];
            seatHtml += `
            <div class="ticket-item">
                <div class="ticket-row">
                    <div class="ticket-detail">
                        <div class="ticket-label">${group.count}x ${typeNames[type]}</div>
                        <div class="ticket-sub">Ghế: ${group.ids.join(', ')}</div>
                    </div>
                    <div class="ticket-price">${(group.count * group.price).toLocaleString()} đ</div>
                </div>
            </div>`;
        });
    }
    $('#side-seat').html(seatHtml);

    // Đồ ăn 
    let foodHtml = Object.keys(selectedFood).length > 0 ? '' : '<div class="ticket-item text-muted small py-2">Chưa chọn đồ ăn</div>';
    Object.values(selectedFood).forEach(f => {
        foodHtml += `
        <div class="ticket-item">
            <div class="ticket-row">
                <div class="ticket-detail">
                    <div class="ticket-label">${f.qty}x ${f.name}</div>
                </div>
                <div class="ticket-price">${(f.qty * f.price).toLocaleString()} đ</div>
            </div>
        </div>`;
    });
    $('#side-food').html(foodHtml);

    // Tính toán tổng cộng
    const totalSeatPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
    const totalFoodPrice = Object.values(selectedFood).reduce((sum, food) => sum + (food.price * food.qty), 0);
    const subtotal = totalSeatPrice + totalFoodPrice;
    
    $('#side-promo').html(discount > 0 ? `
        <div class="ticket-item" style="color: #10b981;">
            <div class="ticket-row">
                <div class="ticket-detail"><div class="ticket-label" style="color: inherit;">Giảm giá (${discount*100}%)</div></div>
                <div class="ticket-price">-${(subtotal * discount).toLocaleString()} đ</div>
            </div>
        </div>` : '');

    $('#side-payment').html(paymentMethod ? `
        <div class="ticket-item">
            <div class="ticket-row">
                <div class="ticket-detail">
                    <div class="ticket-label">Thanh toán</div>
                    <div class="ticket-sub" style="color: #38bdf8;">${paymentMethod}</div>
                </div>
            </div>
        </div>` : '');

    $('#side-total').text((subtotal - (subtotal * discount)).toLocaleString() + ' đ');
}

/* --- HÀM TIỆN ÍCH & ĐIỀU HƯỚNG (Giữ nguyên logic gốc của bạn) --- */
function showNotification(message) {
    $('#infoModalMsg').text(message);
    const infoModal = new bootstrap.Modal(document.getElementById('infoModal'));
    infoModal.show();
}

function generateSeatMap() {
    let html = '';
    ['A', 'B', 'C'].forEach(r => {
        html += `<div class="seat-row"><div class="row-label">${r}</div>`;
        for(let i=1; i<=12; i++) html += `<div class="seat-item" onclick="toggleSeat('${r}${i}', 'standard', this)">${i}</div>`;
        html += `</div>`;
    });
    ['D', 'E', 'F', 'G'].forEach(r => {
        html += `<div class="seat-row"><div class="row-label">${r}</div>`;
        for(let i=1; i<=12; i++) html += `<div class="seat-item vip" onclick="toggleSeat('${r}${i}', 'vip', this)">${i}</div>`;
        html += `</div>`;
    });
    html += `<div class="seat-row"><div class="row-label">H</div>`;
    for(let i=1; i<=10; i++) html += `<div class="seat-item couple" onclick="toggleCoupleSeat('H${i}', this)">${i}</div>`;
    html += `</div>`;
    $('#seat-map-container').html(html);
}

function updateFood(id, delta, name, price) {
    let qty = (selectedFood[id]?.qty || 0) + delta;
    if(qty < 0) return;
    $(`#${id}-qty`).val(qty);
    if(qty === 0) delete selectedFood[id];
    else selectedFood[id] = { name, qty, price };
    renderSummary();
}

function setDiscount(val, el) {
    discount = val;
    $('.promo-choice').removeClass('is-selected');
    $(el).addClass('is-selected');
    renderSummary();
}

function setPayMethod(method, el) {
    paymentMethod = method;
    $('.pay-card').removeClass('active');
    $(el).addClass('active');
    renderSummary();
}

function changeStep(delta) {
    if(delta === 1 && currentStep === 0 && selectedSeats.length === 0) {
        showNotification("Bạn vui lòng chọn ghế trước khi tiếp tục nhé!");
        return;
    }
    if(delta === 1 && currentStep === 2) {
        if(!paymentMethod) {
            showNotification("Bạn hãy chọn một phương thức thanh toán để hoàn tất.");
            return;
        }
        const successModal = new bootstrap.Modal(document.getElementById('successModal'));
        successModal.show();
        return;
    }
    currentStep += delta;
    $('.step').removeClass('active');
    $(`#${steps[currentStep]}`).addClass('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    $('#prevBtn').css('visibility', currentStep === 0 ? 'hidden' : 'visible');
    $('#nextBtn').text(currentStep === 2 ? 'THANH TOÁN' : 'TIẾP THEO');
}

function completeBooking() {
    const totalSeatPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
    const totalFoodPrice = Object.values(selectedFood).reduce((sum, food) => sum + (food.price * food.qty), 0);
    const total = (totalSeatPrice + totalFoodPrice) * (1 - discount);

    const finalTicket = {
        tenPhim: bookingData.tenPhim,
        anhPhim: bookingData.anhPhim,
        ngayChieu: bookingData.ngayChieu,
        gioChieu: bookingData.gioChieu,
        phongChieu: bookingData.phongChieu,
        seats: selectedSeats.map(s => s.id).join(', '),
        foods: Object.values(selectedFood).map(f => `${f.qty}x ${f.name}`).join(', '),
        totalPrice: total,
        payment: paymentMethod,
        bookingDate: new Date().toLocaleString('vi-VN')
    };

    let history = JSON.parse(localStorage.getItem('bookingHistory')) || [];
    history.push(finalTicket);
    localStorage.setItem('bookingHistory', JSON.stringify(history));
    localStorage.setItem('lastBooking', JSON.stringify(finalTicket));
    localStorage.removeItem('currentBooking');
    window.location.href = '/pages/bill.html'; 
}