import { BASE_PATH } from "../config.js";
/* --- CẤU HÌNH GIÁ VÉ --- */
const PRICE_CONFIG = {
    movieType: { '2D': 0, '3D': 30000 },
    timeSlots: [
        { start: 6, end: 10, price: 60000 },
        { start: 10, end: 18, price: 85000 },
        { start: 18, end: 23, price: 105000 },
        { start: 23, end: 6, price: 75000 }
    ],
    seatType: { 'standard': 0, 'vip': 25000, 'couple': 100000 }
};

let currentStep = 0; 
const steps = ["seat", "food", "payment"];
let selectedSeats = []; 
let selectedFood = {};  
let discount = 0;       
let paymentMethod = ""; 
let bookingData = null;

// --- HÀM SINH MÃ GIAO DỊCH (MỚI THÊM) ---
function generateTransactionID() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const segment = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `BBX-${segment()}-${segment()}`;
}


function renderBookingPage() {
    bookingData = JSON.parse(localStorage.getItem('currentBooking'));

    if (bookingData) {
        $('.movie-title').text(bookingData.tenPhim.toUpperCase());
        // Đảm bảo đường dẫn ảnh luôn đúng chuẩn BASE_PATH và không bị lặp
        let posterSrc = bookingData.anhPhim;
        function joinPath(base, rel) {
            if (!base) return rel.startsWith('/') ? rel : '/' + rel;
            if (rel.startsWith(base)) return rel;
            if (rel.startsWith('/')) return base + rel;
            return base + '/' + rel;
        }
        posterSrc = joinPath(BASE_PATH, posterSrc).replace(/\/+/, '/').replace(/([^:])\/\//g, '$1/');
        $('.movie-image img').attr('src', posterSrc);
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
        setTimeout(() => { window.location.href = `${BASE_PATH}/pages/lich_chieu.html`; }, 2000);
    }

    // Render food step if not present
    if (!document.getElementById('food')) {
        const foodStep = document.createElement('div');
        foodStep.id = 'food';
        foodStep.className = 'step';
        foodStep.innerHTML = `
            <div class="step-title">Bước 2: Chọn đồ ăn kèm</div>
            <div class="food-list">
                <div class="food-card">
                    <div class="food-info">
                        <div class="food-name">Bỏng ngô</div>
                        <div class="food-price">60.000 đ</div>
                    </div>
                    <div class="qty-box">
                        <button class="qty-btn" id="f1-minus">-</button>
                        <input type="text" class="qty-input" id="f1-qty" value="0" readonly>
                        <button class="qty-btn" id="f1-plus">+</button>
                    </div>
                </div>
                <div class="food-card">
                    <div class="food-info">
                        <div class="food-name">Nước ngọt Pepsi</div>
                        <div class="food-price">35.000 đ</div>
                    </div>
                    <div class="qty-box">
                        <button class="qty-btn" id="f2-minus">-</button>
                        <input type="text" class="qty-input" id="f2-qty" value="0" readonly>
                        <button class="qty-btn" id="f2-plus">+</button>
                    </div>
                </div>
                <div class="food-card">
                    <div class="food-info">
                        <div class="food-name">Combo Bỏng ngô + Pepsi</div>
                        <div class="food-price">85.000 đ</div>
                    </div>
                    <div class="qty-box">
                        <button class="qty-btn" id="f3-minus">-</button>
                        <input type="text" class="qty-input" id="f3-qty" value="0" readonly>
                        <button class="qty-btn" id="f3-plus">+</button>
                    </div>
                </div>
            </div>
        `;
        // Insert after seat step
        const seatStep = document.getElementById('seat');
        seatStep.parentNode.insertBefore(foodStep, seatStep.nextSibling);
    }
    // Always reset steps to show only the first (seat) as active on render
    document.querySelectorAll('.step').forEach((el, idx) => {
        el.classList.remove('active');
    });
    // Explicitly set seat step as active
    const seatStep = document.getElementById('seat');
    if (seatStep) seatStep.classList.add('active');
    currentStep = 0;

    generateSeatMap();
    renderSummary(); 
}

function waitAndRenderBookingPage(retries = 30, interval = 50) {
    // Wait for .movie-title, .movie-image img, .movie-content ul, .cinema-number, .showtime-number, .showtime-day
    if (
        document.querySelector('.movie-title') &&
        document.querySelector('.movie-image img') &&
        document.querySelector('.movie-content ul') &&
        document.querySelector('.cinema-number') &&
        document.querySelector('.showtime-number') &&
        document.querySelector('.showtime-day')
    ) {
        renderBookingPage();
    } else if (retries > 0) {
        setTimeout(() => waitAndRenderBookingPage(retries - 1, interval), interval);
    } else {
        console.warn('booking.js: Required DOM elements not found after waiting.');
    }
}

waitAndRenderBookingPage();

function calculateDynamicPrice(seatType) {
    if (!bookingData) return 0;
    const hour = parseInt(bookingData.gioChieu.split(':')[0]);
    const slot = PRICE_CONFIG.timeSlots.find(s => hour >= s.start && hour < s.end);
    const basePrice = slot ? slot.price : 85000;
    const formatSurcharge = PRICE_CONFIG.movieType[bookingData.dinhDang] || 0;
    const seatSurcharge = PRICE_CONFIG.seatType[seatType] || 0;
    return basePrice + formatSurcharge + seatSurcharge;
}

function toggleSeat(id, type, el) {
    $(el).toggleClass('selected');
    const idx = selectedSeats.findIndex(s => s.id === id);
    if(idx > -1) {
        selectedSeats.splice(idx, 1);
    } else {
        const price = calculateDynamicPrice(type);
        selectedSeats.push({ id, type, price: price });
    }
    renderSummary();
}

function toggleCoupleSeat(id, el) {
    // Only allow even-odd pairs (H1-H2, H3-H4, ...)
    const num = parseInt(id.substring(1));
    let partnerNum;
    if (num % 2 === 0) {
        partnerNum = num - 1;
    } else {
        partnerNum = num + 1;
    }
    // Only allow valid pairs (1-2, 3-4, ... 9-10)
    if (partnerNum < 1 || partnerNum > 10) return;
    const partnerId = 'H' + partnerNum;
    const pairId = num % 2 === 0 ? `${partnerId}-${id}` : `${id}-${partnerId}`;
    const partnerEl = document.querySelector(`.seat-item.couple[data-seat='${partnerId}']`);

    const idx = selectedSeats.findIndex(s => s.id === pairId);
    if(idx > -1) {
        selectedSeats.splice(idx, 1);
        el.classList.remove('selected');
        if (partnerEl) partnerEl.classList.remove('selected');
    } else {
        // Prevent selecting if partner is already selected in another pair
        if (partnerEl && partnerEl.classList.contains('selected')) return;
        const price = calculateDynamicPrice('couple');
        selectedSeats.push({ id: pairId, type: 'couple', price: price });
        el.classList.add('selected');
        if (partnerEl) partnerEl.classList.add('selected');
    }
    renderSummary();
}

function renderSummary() {
    let seatHtml = selectedSeats.length > 0 ? '' : '<div class="ticket-item text-muted small py-2">Chưa chọn ghế</div>';
    let totalSeatPrice = 0;
    if(selectedSeats.length > 0) {
        const groups = selectedSeats.reduce((acc, seat) => {
            if (!acc[seat.type]) acc[seat.type] = { count: 0, ids: [], price: seat.price };
            acc[seat.type].count++;
            acc[seat.type].ids.push(seat.id);
            return acc;
        }, {});
        const typeNames = { standard: 'Ghế đơn', vip: 'Ghế VIP', couple: 'Ghế Couple' };
        Object.keys(groups).forEach(type => {
            const group = groups[type];
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
            totalSeatPrice += group.count * group.price;
        });
    }
    seatHtml += `<div class="ticket-item fw-bold"><div class="ticket-row"><div class="ticket-label">Tổng giá ghế</div><div class="ticket-price">${totalSeatPrice.toLocaleString()} đ</div></div></div>`;
    $('#side-seat').html(seatHtml);

    let foodHtml = Object.keys(selectedFood).length > 0 ? '' : '<div class="ticket-item text-muted small py-2">Chưa chọn đồ ăn</div>';
    let totalFoodPrice = 0;
    Object.values(selectedFood).forEach(f => {
        const foodTotal = f.qty * f.price;
        totalFoodPrice += foodTotal;
        foodHtml += `
        <div class="ticket-item">
            <div class="ticket-row">
                <div class="ticket-detail">
                    <div class="ticket-label">${f.qty}x ${f.name}</div>
                </div>
                <div class="ticket-price">${foodTotal.toLocaleString()} đ</div>
            </div>
        </div>`;
    });
    foodHtml += `<div class="ticket-item fw-bold"><div class="ticket-row"><div class="ticket-label">Tổng giá đồ ăn</div><div class="ticket-price">${totalFoodPrice.toLocaleString()} đ</div></div></div>`;
    $('#side-food').html(foodHtml);

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

function showNotification(message) {
    $('#infoModalMsg').text(message);
    const infoModalEl = document.getElementById('infoModal');
    const infoModal = bootstrap.Modal.getOrCreateInstance(infoModalEl);
    infoModal.show();
    // Ensure modal closes and overlay is removed on close
    infoModalEl.addEventListener('hidden.bs.modal', function cleanup() {
        document.body.classList.remove('modal-open');
        // Remove any lingering modal-backdrop
        document.querySelectorAll('.modal-backdrop').forEach(e => e.remove());
        infoModalEl.removeEventListener('hidden.bs.modal', cleanup);
    });
}


function generateSeatMap() {
    let html = '';
    ['A', 'B', 'C'].forEach(r => {
        html += `<div class="seat-row"><div class="row-label">${r}</div>`;
        for(let i=1; i<=12; i++) html += `<div class="seat-item" data-seat="${r}${i}" data-type="standard">${i}</div>`;
        html += `</div>`;
    });
    ['D', 'E', 'F', 'G'].forEach(r => {
        html += `<div class="seat-row"><div class="row-label">${r}</div>`;
        for(let i=1; i<=12; i++) html += `<div class="seat-item vip" data-seat="${r}${i}" data-type="vip">${i}</div>`;
        html += `</div>`;
    });
    html += `<div class="seat-row"><div class="row-label">H</div>`;
    for(let i=1; i<=10; i++) html += `<div class="seat-item couple" data-seat="H${i}" data-type="couple">${i}</div>`;
    html += `</div>`;
    $('#seat-map-container').html(html);

    // Attach event listeners after rendering
    document.querySelectorAll('.seat-item').forEach(el => {
        const seatId = el.getAttribute('data-seat');
        const type = el.getAttribute('data-type');
        if (type === 'couple') {
            el.addEventListener('click', function() { toggleCoupleSeat(seatId, el); });
        } else {
            el.addEventListener('click', function() { toggleSeat(seatId, type, el); });
        }
    });
}

function updateFood(id, delta, name, price) {
    let qty = (selectedFood[id]?.qty || 0) + delta;
    if(qty < 0) return;
    const qtyInput = document.getElementById(`${id}-qty`);
    if (qtyInput) qtyInput.value = qty;
    if(qty === 0) delete selectedFood[id];
    else selectedFood[id] = { name, qty, price };
    renderSummary();
}


window.updateFood = updateFood;

function setDiscount(val, el) {
    discount = val;
    $('.promo-choice').removeClass('is-selected');
    $(el).addClass('is-selected');
    renderSummary();
}

window.setDiscount = setDiscount;


function setPayMethod(method, el) {
    paymentMethod = method;
    $('.pay-card').removeClass('active');
    $(el).addClass('active');
    renderSummary();
}

window.setPayMethod = setPayMethod;

function changeStep(delta) {
    const stepIds = ['seat', 'food', 'payment'];
    if (delta === 1) {
        if (currentStep === 0) {
            if (selectedSeats.length === 0) {
                showNotification("Bạn vui lòng chọn ghế trước khi tiếp tục nhé!");
                return;
            }
            currentStep = 1;
        } else if (currentStep === 1) {
            currentStep = 2;
        } else if (currentStep === 2) {
            if (!paymentMethod) {
                showNotification("Bạn hãy chọn một phương thức thanh toán để hoàn tất.");
                return;
            }
            const successModal = new bootstrap.Modal(document.getElementById('successModal'));
            successModal.show();
            // Auto redirect after 1.5s
            setTimeout(() => {
                completeBooking();
            }, 1500);
            return;
        }
    } else if (delta === -1 && currentStep > 0) {
        currentStep--;
    } else {
        return;
    }
    // Hide all steps, show only the current step by ID
    stepIds.forEach((id, idx) => {
        const el = document.getElementById(id);
        if (el) el.classList.toggle('active', idx === currentStep);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    $('#prevBtn').css('visibility', currentStep === 0 ? 'hidden' : 'visible');
    $('#nextBtn').text(currentStep === 2 ? 'THANH TOÁN' : 'TIẾP THEO');
}

// Expose changeStep globally for navigation button event handlers
window.changeStep = changeStep;

// Ensure only run once
let bookingCompleted = false;
function completeBooking() {
    if (bookingCompleted) return;
    bookingCompleted = true;
    const seatIds = selectedSeats.map(s => s.id);
    const seatPrices = selectedSeats.map(s => s.price);
    const totalSeatPrice = seatPrices.reduce((sum, p) => sum + p, 0);

    const foodDetails = Object.values(selectedFood).map(f => ({
        name: f.name,
        qty: f.qty,
        price: f.price,
        total: f.qty * f.price
    }));

    const totalFoodPrice = foodDetails.reduce((sum, f) => sum + f.total, 0);
    const discountValue = Math.round((totalSeatPrice + totalFoodPrice) * discount);
    const total = totalSeatPrice + totalFoodPrice - discountValue;

    const finalTicket = {
        transactionId: generateTransactionID(),

        // PHIM
        tenPhim: bookingData.tenPhim,
        anhPhim: bookingData.anhPhim,
        ngayChieu: bookingData.ngayChieu,
        gioChieu: bookingData.gioChieu,
        phongChieu: bookingData.phongChieu,
        dinhDang: bookingData.dinhDang,

        // GHẾ
        seats: seatIds.join(', '),
        seatPrices,
        totalSeatPrice,

        // ĐỒ ĂN (QUAN TRỌNG)
        foods: foodDetails,
        totalFoodPrice,

        // THANH TOÁN
        discount,
        discountValue,
        totalPrice: total,
        payment: paymentMethod,

        bookingDate: new Date().toISOString()
    };

    // LƯU LỊCH SỬ CHUNG
    const history = JSON.parse(localStorage.getItem('bookingHistory')) || [];
    history.push(finalTicket);
    localStorage.setItem('bookingHistory', JSON.stringify(history));

    // LƯU VÉ VỪA ĐẶT
    localStorage.setItem('lastBooking', JSON.stringify(finalTicket));

    // LƯU THEO USER
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        const userKey = currentUser.email || currentUser.username;
        const userBookings = JSON.parse(localStorage.getItem('userBookings') || '{}');
        userBookings[userKey] = userBookings[userKey] || [];
        userBookings[userKey].push(finalTicket);
        localStorage.setItem('userBookings', JSON.stringify(userBookings));
    }

    localStorage.removeItem('currentBooking');
        window.location.href = `${BASE_PATH}/pages/bill.html?justPaid=1`;
}
