import { BASE_PATH } from "../config.js";

// --- HÀM TIỆN ÍCH XỬ LÝ ẢNH (Quan trọng) ---
// Thay thế hàm cũ bằng hàm này
function resolveImagePath(path, defaultImg = '/assets/avatar/avt1.jpg') {
    // 1. Nếu không có path, trả về ảnh mặc định (có kèm Base Path)
    if (!path) return BASE_PATH + defaultImg;

    // 2. Nếu là ảnh base64 hoặc link online -> giữ nguyên
    if (path.startsWith('data:') || path.startsWith('http')) return path;
    
    // 3. Nếu là ảnh nội bộ nhưng đã có BASE_PATH -> giữ nguyên
    if (BASE_PATH && path.includes(BASE_PATH)) {
        return path;
    }

    let cleanPath = path.replace(/^\.\//, '').replace(/^\//, '');
    
    // 5. Cộng BASE_PATH vào
    return `${BASE_PATH}/${cleanPath}`;
}

// --- HÀM HIỂN THỊ CHI TIẾT HÓA ĐƠN ---
function showInvoiceDetail(inv) {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  let userInfoHTML = '';
  if (user) {
    userInfoHTML = `
      <div class="bill-receipt-line"><span>Khách:</span><span>${user.fullName || user.username || ''}</span></div>
      <div class="bill-receipt-line"><span>Email:</span><span>${user.email || ''}</span></div>
      <div class="bill-receipt-divider"></div>
    `;
  }

  // Format ngày
  let bookingDateStr = '';
  if (inv.bookingDate) {
    const d = new Date(inv.bookingDate);
    bookingDateStr = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}, ${d.toLocaleDateString('vi-VN')}`;
  }

  // Xử lý đồ ăn
  let foodsHTML = '';
  let totalFoodPrice = 0;
  
  // Chuẩn hóa mảng foods
  let foodsArray = [];
  if (Array.isArray(inv.foods)) {
      foodsArray = inv.foods;
  } else if (typeof inv.foods === 'string') {
      inv.foods.split(',').forEach(f => {
          let match = f.trim().match(/(\d+)x ([^\(]+)(?:\(([^)]+)\))?/);
          if (match) foodsArray.push({ qty: parseInt(match[1]), name: match[2].trim(), price: 0, total: 0 });
      });
  }

  if (foodsArray.length > 0) {
    foodsHTML = `<div class="bill-receipt-line"><span>Đồ ăn đã đặt:</span></div>`;
    foodsArray.forEach(f => {
        let itemTotal = f.total || (f.qty * f.price) || 0;
        totalFoodPrice += itemTotal;
        foodsHTML += `<div class="bill-receipt-line ps-3 d-flex justify-content-between">
                        <span>${f.qty}x ${f.name}</span>
                        <span>${itemTotal.toLocaleString()}đ</span>
                      </div>`;
    });
    foodsHTML += `<div class="bill-receipt-line fw-bold ps-3 d-flex justify-content-between"><span>Tổng tiền đồ ăn</span><span>${totalFoodPrice.toLocaleString()}đ</span></div>`;
  }

  // HTML Modal
  const html = `
    <div class="modal fade" id="invoiceModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">HÓA ĐƠN THANH TOÁN</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="bill-receipt-container" style="max-width:340px;margin:auto;">
              <div class="bill-thermal-receipt p-3 border shadow-sm" style="background:#fff; color:#000; font-family: monospace;">
                <div class="text-center mb-3">
                  <h6 class="mb-1 fw-bold">COP CINEMAS PREMIUM</h6>
                  <p style="font-size: 10px;" class="mb-0">COP Cinemas Chùa Bộc, Hà Nội</p>
                  <p style="font-size: 10px;">Mã GD: <strong>${inv.transactionId || '---'}</strong></p>
                </div>
                <div class="bill-receipt-line d-flex justify-content-between"><span>Thời gian:</span><span>${bookingDateStr}</span></div>
                ${userInfoHTML}
                <div class="bill-receipt-line text-center my-2"><span class="fw-bold text-uppercase">${inv.tenPhim || ''}</span></div>
                <div class="bill-receipt-line d-flex justify-content-between"><span>Ngày chiếu:</span><span>${inv.ngayChieu || ''}</span></div>
                <div class="bill-receipt-line d-flex justify-content-between"><span>Suất chiếu:</span><span>${inv.gioChieu || ''}</span></div>
                <div class="bill-receipt-line d-flex justify-content-between"><span>Phòng:</span><span>${inv.phongChieu || ''}</span></div>
                <div class="bill-receipt-line d-flex justify-content-between"><span>Ghế:</span><span>${inv.seats || ''}</span></div>
                <div class="bill-receipt-line d-flex justify-content-between"><span>Giá vé:</span><span>${(inv.totalSeatPrice || 0).toLocaleString()}đ</span></div>
                ${foodsHTML}
                <div class="bill-receipt-divider border-top border-dashed my-2"></div>
                <div class="bill-receipt-line d-flex justify-content-between"><span>Khuyến mãi:</span><span>-${(inv.discountValue || 0).toLocaleString()}đ</span></div>
                <div class="bill-receipt-line fw-bold fs-5 d-flex justify-content-between mt-2"><span>TỔNG:</span><span>${(inv.totalPrice || 0).toLocaleString()}đ</span></div>
                <div class="text-center mt-3">
                    <div class="receipt-barcode" style="height:30px; background: repeating-linear-gradient(90deg,#000,#000 1px,transparent 1px,transparent 3px);"></div>
                    <p style="font-size: 9px;" class="mt-2 mb-0">Cảm ơn & Hẹn gặp lại!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  let modalDiv = document.getElementById('invoiceModal');
  if (modalDiv) modalDiv.remove();
  document.body.insertAdjacentHTML('beforeend', html);
  const modal = new bootstrap.Modal(document.getElementById('invoiceModal'));
  modal.show();
}

// --- HÀM KHỞI TẠO TRANG (CHẠY NGAY) ---
function initPage() {
    console.log("Init Tai Khoan Page...");

    // 1. Kiểm tra User
    let user = null;
    try {
        user = JSON.parse(localStorage.getItem('currentUser'));
    } catch (e) { console.warn(e); }

    if (!user) {
        alert('Bạn chưa đăng nhập!');
        window.location.href = `${BASE_PATH}/pages/login.html`;
        return;
    }

    // 2. Load Thông tin User lên giao diện
    const avatarEl = document.getElementById('profile-avatar');
    if (avatarEl) {
        // Sử dụng hàm resolveImagePath để đảm bảo ảnh luôn hiển thị đúng
        avatarEl.src = resolveImagePath(user.avatar);
    }

    const userNameEl = document.getElementById('userName');
    if (userNameEl) userNameEl.textContent = user.fullName || user.username || 'Khách hàng';

    const fullNameInput = document.getElementById('profileFullName');
    if (fullNameInput) fullNameInput.value = user.fullName || '';

    const usernameInput = document.getElementById('profileUsername');
    if (usernameInput) usernameInput.value = user.username || '';

    const emailInput = document.getElementById('profileEmail');
    if (emailInput) emailInput.value = user.email || '';

    // 3. Lấy dữ liệu hóa đơn
    let userBookings = {};
    try {
        userBookings = JSON.parse(localStorage.getItem('userBookings') || '{}');
    } catch (e) {}
    
    // Key có thể là email hoặc username
    const invoices = userBookings[user.email] || userBookings[user.username] || [];

    // Sắp xếp mới nhất trước
    invoices.sort((a, b) => new Date(b.bookingDate || b.createdAt) - new Date(a.bookingDate || a.createdAt));

    // Thống kê
    const statMoviesEl = document.getElementById('statMovies');
    if (statMoviesEl) statMoviesEl.textContent = invoices.length;
    
    const totalMoney = invoices.reduce((sum, inv) => sum + (inv.totalPrice || 0), 0);
    const statMoneyEl = document.getElementById('statMoney');
    if (statMoneyEl) statMoneyEl.textContent = totalMoney.toLocaleString() + 'đ';

    // 4. Render Bảng Hóa Đơn
    const billTbody = document.querySelector('#tab-invoices tbody');
    if (billTbody) {
        billTbody.innerHTML = '';
        if (invoices.length === 0) {
            billTbody.innerHTML = '<tr><td colspan="4" class="text-center">Chưa có giao dịch nào</td></tr>';
        } else {
            invoices.forEach(inv => {
                const tr = document.createElement('tr');
                tr.style.cursor = 'pointer';
                
                let dateStr = '';
                if (inv.bookingDate) {
                    const d = new Date(inv.bookingDate);
                    dateStr = `${d.getHours()}:${String(d.getMinutes()).padStart(2,'0')}, ${d.toLocaleDateString('vi-VN')}`;
                }

                tr.innerHTML = `
                    <td>${dateStr}</td>
                    <td>${inv.tenPhim || ''}</td>
                    <td>${inv.ngayChieu || ''}</td>
                    <td class="text-warning fw-bold">${(inv.totalPrice || 0).toLocaleString()}đ</td>
                `;
                
                // Gắn sự kiện click trực tiếp
                tr.addEventListener('click', () => showInvoiceDetail(inv));
                billTbody.appendChild(tr);
            });
        }
    }

    // 5. Render Hành Trình (Journey)
    renderJourney(invoices);

    // 6. Logic Chỉnh sửa Profile
    setupProfileActions(user, avatarEl);

    // 7. Xử lý Tab từ URL (nếu có)
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam) {
        const tabTrigger = document.querySelector(`button[data-bs-target="#tab-${tabParam}"]`);
        if (tabTrigger) {
            // Đợi 1 chút cho Bootstrap load
            setTimeout(() => tabTrigger.click(), 100);
        }
    }
}

// --- HÀM RENDER HÀNH TRÌNH ---
// --- HÀM RENDER HÀNH TRÌNH ---
function renderJourney(invoices) {
    const track = document.getElementById("journeyTrack");
    if (!track) return;
    track.innerHTML = "";

    if (invoices.length === 0) {
        track.innerHTML = '<div class="text-muted text-center w-100 mt-4">Bạn chưa có hành trình phim nào.</div>';
        return;
    }

    // Đảo ngược để xếp theo thứ tự thời gian (Cũ -> Mới) để hiển thị hành trình
    const journeyList = [...invoices].reverse(); 

    journeyList.forEach(inv => {
        const item = document.createElement("div");
        item.className = "journey-item";
        
        // Poster xử lý bằng hàm chuẩn
        const posterSrc = resolveImagePath(inv.anhPhim, '/assets/images/posters/default.jpg');
        
        // --- SỬA LỖI NGÀY THÁNG TẠI ĐÂY ---
        let dateStr = 'N/A';
        // Kiểm tra ưu tiên: bookingDate -> createdAt -> date -> Fallback về ngày chiếu
        const rawDate = inv.bookingDate || inv.createdAt || inv.date;

        if (rawDate) {
             const d = new Date(rawDate);
             // Kiểm tra nếu date hợp lệ
             if (!isNaN(d.getTime())) {
                dateStr = d.toLocaleDateString('vi-VN'); // dd/mm/yyyy
             }
        } else if (inv.ngayChieu) {
            // Nếu không có ngày đặt vé thì lấy tạm ngày chiếu
            dateStr = inv.ngayChieu;
        }
        // -----------------------------------

        item.innerHTML = `
            <div class="journey-top-content">
                <div class="journey-poster">
                    <img src="${posterSrc}" alt="${inv.tenPhim}" onerror="this.src='${BASE_PATH}/assets/images/posters/default.jpg'">
                </div>
                <div class="journey-title mt-2 fw-bold text-white" style="font-size:0.9rem">${inv.tenPhim}</div>
            </div>
            <div class="journey-dot"></div>
            <div class="journey-date text-white-50 small" style="margin-top: 5px;">${dateStr}</div>
        `;
        track.appendChild(item);
    });
}

// --- LOGIC CHỈNH SỬA PROFILE ---
function setupProfileActions(user, avatarEl) {
    const btnEdit = document.getElementById('btn-edit-profile');
    const btnSave = document.getElementById('btn-save-profile');
    const inputName = document.getElementById('profileFullName');
    const avatarInput = document.getElementById('avatar-upload');

    if (btnEdit && btnSave && inputName) {
        btnEdit.onclick = () => {
            inputName.disabled = false;
            inputName.focus();
            btnEdit.classList.add('d-none');
            btnSave.classList.remove('d-none');
        };

        const form = document.querySelector('form');
        if (form) {
            form.onsubmit = (e) => {
                e.preventDefault();
                user.fullName = inputName.value.trim();
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                // Cập nhật giao diện
                const userNameEl = document.getElementById('userName');
                if (userNameEl) userNameEl.textContent = user.fullName;

                inputName.disabled = true;
                btnSave.classList.add('d-none');
                btnEdit.classList.remove('d-none');
                alert('Cập nhật thông tin thành công!');
            };
        }
    }

    if (avatarInput) {
        avatarInput.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (evt) => {
                const base64 = evt.target.result;
                user.avatar = base64;
                localStorage.setItem('currentUser', JSON.stringify(user));
                if (avatarEl) avatarEl.src = base64;
                // Reload nhẹ để đồng bộ header
                location.reload();
            };
            reader.readAsDataURL(file);
        };
    }
}

// --- CHẠY CODE ---
initPage();