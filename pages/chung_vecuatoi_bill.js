// Hàm hỗ trợ loại bỏ dấu tiếng Việt
function removeVietnameseTones(str) {
    if (!str) return "";
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    // Loại bỏ các ký tự kết hợp (combining marks) nếu có
    str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    return str;
}

function renderData(dataList, tContainer, iContainer) {
    if (!tContainer || !iContainer) return;
    tContainer.innerHTML = '';
    iContainer.innerHTML = '';

    let globalIdx = 0;
    const qrTasks = [];

    dataList.forEach(booking => {
        const billID = booking.transactionID || "COP-NEW";
        
        const seats = booking.seats ? booking.seats.split(', ') : [];
        // Lấy giá từng ghế từ booking.seatPrices nếu có
        const seatPrices = Array.isArray(booking.seatPrices) ? booking.seatPrices : [];
        seats.forEach((seat, idx) => {
            // Nếu là ghế đôi (Hxx-Hyy), tách thành 2 vé riêng biệt
            let seatList = [];
            if (/^H\d{1,2}-H\d{1,2}$/.test(seat)) {
                seatList = seat.split('-');
            } else {
                seatList = [seat];
            }
            seatList.forEach((singleSeat, subIdx) => {
                const qrId = `qr-${globalIdx}`;
                // Giá ghế: nếu là ghế đôi, chia đều giá cho từng ghế, nếu không lấy giá theo idx
                let price = seatPrices[idx] || booking.totalSeatPrice || 0;
                if (seatList.length > 1 && seatPrices[idx]) {
                    price = Math.round(seatPrices[idx] / seatList.length);
                }
                // Chuẩn bị dữ liệu không dấu
                const ticketData = {
                    id: billID,
                    movie: removeVietnameseTones(booking.tenPhim).toUpperCase(),
                    date: removeVietnameseTones(booking.ngayChieu),
                    time: booking.gioChieu,
                    seat: singleSeat,
                    room: removeVietnameseTones(booking.phongChieu).toUpperCase()
                };
                // Mã hóa Base64 để truyền URL an toàn
                const jsonStr = JSON.stringify(ticketData);
                const encodedData = btoa(unescape(encodeURIComponent(jsonStr)));
                const detailUrl = `${window.location.origin}/pages/chi_tiet_ve.html?data=${encodedData}`;
                const ticketHTML = `
                    <div class="ticket-item shadow-lg mb-4">
                        <div class="ticket-main">
                            <span class="movie-title text-uppercase">${booking.tenPhim}</span>
                            <div class="info-grid">
                                <div><span class="info-label">Ngày</span><span class="info-value text-danger">${booking.ngayChieu}</span></div>
                                <div><span class="info-label">Suất</span><span class="info-value">${booking.gioChieu}</span></div>
                                <div><span class="info-label">Ghế</span><span class="info-value text-white bg-danger px-2 rounded">${singleSeat}</span></div>
                                <div><span class="info-label">Phòng</span><span class="info-value">${booking.phongChieu}</span></div>
                                <div><span class="info-label">Giá vé</span><span class="info-value">${price.toLocaleString()}đ</span></div>
                            </div>
                        </div>
                        <div class="ticket-side">
                            <div class="qr-wrapper"><div id="${qrId}"></div></div>
                            <span class="ticket-status">VÉ HỢP LỆ</span>
                        </div>
                    </div>`;
                tContainer.insertAdjacentHTML('beforeend', ticketHTML);
                qrTasks.push({ id: qrId, text: detailUrl });
                globalIdx++;
            });
        });

        // Tính tổng tiền đồ ăn (giống bill.js)
        let foodsHTML = '';
        let totalFoodPrice = 0;
        if (booking.foods && booking.foods.length > 0) {
            foodsHTML = `<div class=\"bill-receipt-line\"><span>Đồ ăn đã đặt:</span></div>`;
            if (Array.isArray(booking.foods)) {
                booking.foods.forEach(f => {
                    if (typeof f === 'object' && f.name && f.qty) {
                        let foodTotal = (typeof f.total === 'number') ? f.total : (f.qty * f.price);
                        totalFoodPrice += foodTotal;
                        foodsHTML += `<div class=\"bill-receipt-line\" style=\"padding-left:24px; display:flex; justify-content:space-between;\"><span>${f.qty}x ${f.name}</span><span>${foodTotal.toLocaleString()}đ</span></div>`;
                    }
                });
            } else if (typeof booking.foods === 'string') {
                let foodsArr = booking.foods.split(',').map(f => f.trim());
                foodsArr.forEach(f => {
                    let match = f.match(/(\d+)x ([^\(]+)(?:\(([^)]+)\))?/);
                    if (match) {
                        let qty = parseInt(match[1]);
                        let name = match[2].trim();
                        let price = match[3] ? parseInt(match[3].replace(/[^\d]/g, '')) : 0;
                        let foodTotal = qty * price;
                        totalFoodPrice += foodTotal;
                        foodsHTML += `<div class=\"bill-receipt-line\" style=\"padding-left:24px; display:flex; justify-content:space-between;\"><span>${qty}x ${name}</span><span>${foodTotal.toLocaleString()}đ</span></div>`;
                    } else {
                        foodsHTML += `<div class=\"bill-receipt-line\" style=\"padding-left:24px\"><span>${f}</span></div>`;
                    }
                });
            }
            foodsHTML += `<div class=\"bill-receipt-line fw-bold\" style=\"padding-left:24px; display:flex; justify-content:space-between;\"><span>Tổng tiền đồ ăn</span><span>${totalFoodPrice.toLocaleString()}đ</span></div>`;
        }

        // --- ĐẦY ĐỦ THÔNG TIN HÓA ĐƠN ---
        const invoiceHTML = `
            <div class=\"bill-receipt-container\">
                <div class=\"bill-thermal-receipt shadow-sm\">
                    <h6 class=\"text-center fw-bold\">COP CINEMA PREMIUM</h6>
                    <div class=\"bill-receipt-line\"><span>Mã GD:</span><span class=\"fw-bold\">${billID}</span></div>
                    <div class=\"bill-receipt-line\"><span>Thời gian đặt:</span><span>${booking.bookingDate ? new Date(booking.bookingDate).toLocaleString('vi-VN') : (booking.ngayChieu || '')}</span></div>
                    <div class=\"bill-receipt-divider\"></div>
                    <div class=\"fw-bold text-uppercase mb-1\">${booking.tenPhim}</div>
                    <div class=\"bill-receipt-line\"><span>Ngày chiếu:</span><span>${booking.ngayChieu || ''}</span></div>
                    <div class=\"bill-receipt-line\"><span>Suất chiếu:</span><span>${booking.gioChieu || ''}</span></div>
                    <div class=\"bill-receipt-line\"><span>Phòng:</span><span>${booking.phongChieu || ''}</span></div>
                    <div class=\"bill-receipt-line\"><span>Định dạng:</span><span>${booking.dinhDang || ''}</span></div>
                    <div class=\"bill-receipt-line\"><span>Danh sách ghế:</span><span>${booking.seats || ''}</span></div>
                    <div class=\"bill-receipt-line\"><span>Giá vé:</span><span>${booking.totalSeatPrice ? Number(booking.totalSeatPrice).toLocaleString() + 'đ' : ''}</span></div>
                    ${foodsHTML}
                    <div class=\"bill-receipt-divider\"></div>
                    <div class=\"bill-receipt-line\"><span>Khuyến mãi:</span><span>${booking.discountValue ? '-' + Number(booking.discountValue).toLocaleString() + 'đ' : '0đ'}</span></div>
                    <div class=\"bill-receipt-line fw-bold fs-5\"><span>TỔNG THANH TOÁN:</span><span>${Number(booking.totalPrice).toLocaleString()}đ</span></div>
                    <div class=\"text-center mt-3\"><div class=\"bill-receipt-barcode\"></div></div>
                    <div class=\"text-center mt-2 small\">Xin kính chào và hẹn gặp lại &lt;3</div>
                </div>
            </div>`;
        iContainer.insertAdjacentHTML('beforeend', invoiceHTML);
    });

     // Khởi tạo QR Code
    setTimeout(() => {
        qrTasks.forEach(task => {
            const el = document.getElementById(task.id);
            if (el) {
                el.innerHTML = '';
                new QRCode(el, {
                    text: task.text,
                    width: 128, // Kích thước chuẩn cho dữ liệu Base64
                    height: 128,
                    correctLevel: QRCode.CorrectLevel.L // Low giúp mã thưa hơn, dễ quét hơn
                });
            }
        });
    }, 500);
}