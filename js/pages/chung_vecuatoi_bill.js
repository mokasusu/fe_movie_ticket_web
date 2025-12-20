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
        seats.forEach(seat => {
            const qrId = `qr-${globalIdx}`;
            
            // 1. Chuẩn bị dữ liệu không dấu
            const ticketData = {
                id: billID,
                movie: removeVietnameseTones(booking.tenPhim).toUpperCase(), // Viết hoa cho chuyên nghiệp
                date: removeVietnameseTones(booking.ngayChieu),
                time: booking.gioChieu,
                seat: seat,
                room: removeVietnameseTones(booking.phongChieu).toUpperCase()
            };

            // 2. Mã hóa Base64 để truyền URL an toàn
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
                            <div><span class="info-label">Ghế</span><span class="info-value text-white bg-danger px-2 rounded">${seat}</span></div>
                            <div><span class="info-label">Phòng</span><span class="info-value">${booking.phongChieu}</span></div>
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

        // 2. Render Hóa đơn (Phần này vẫn hiện tiếng Việt có dấu cho người dùng xem)
        const invoiceHTML = `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="thermal-receipt shadow-sm">
                    <h6 class="text-center fw-bold">COP CINEMA PREMIUM</h6>
                    <div class="receipt-line"><span>Mã GD:</span><span class="fw-bold">${billID}</span></div>
                    <div class="receipt-line"><span>Thời gian:</span><span>${booking.bookingDate || booking.ngayChieu}</span></div>
                    <div class="receipt-divider"></div>
                    <div class="fw-bold text-uppercase mb-1">${booking.tenPhim}</div>
                    <div class="receipt-line"><span>Phòng:</span><span>${booking.phongChieu}</span></div>
                    <div class="receipt-line"><span>Danh sách ghế:</span><span>${booking.seats}</span></div>
                    <div class="receipt-divider"></div>
                    <div class="receipt-line fw-bold fs-5"><span>TỔNG:</span><span>${Number(booking.totalPrice).toLocaleString()}đ</span></div>
                    <div class="text-center mt-3"><div class="receipt-barcode"></div></div>
                    <div class="text-center mt-2 small">Xin kính chào và hẹn gặp lại <3</div>
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