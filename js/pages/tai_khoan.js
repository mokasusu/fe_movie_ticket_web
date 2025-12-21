// Hiển thị popup chi tiết hóa đơn
function showInvoiceDetail(inv) {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  let userInfoHTML = '';
  if (user) {
    userInfoHTML = `
      <div class=\"bill-receipt-line\"><span>Khách:</span><span>${user.fullName || user.username || ''}</span></div>
      <div class=\"bill-receipt-line\"><span>Email:</span><span>${user.email || ''}</span></div>
      <div class=\"bill-receipt-divider\"></div>
    `;
  }
  // Định dạng lại thời gian đặt vé
  let bookingDateStr = '';
  if (inv.bookingDate) {
    const d = new Date(inv.bookingDate);
    const date = d.toLocaleDateString('vi-VN');
    const hour = d.getHours().toString().padStart(2, '0');
    const min = d.getMinutes().toString().padStart(2, '0');
    bookingDateStr = `${hour}:${min}, ${date}`;
  }
  // Tính tổng tiền đồ ăn (giống bill.js)
  let foodsHTML = '';
  let totalFoodPrice = 0;
  if (inv.foods && inv.foods.length > 0) {
    foodsHTML = `<div class=\"bill-receipt-line\"><span>Đồ ăn đã đặt:</span></div>`;
    if (Array.isArray(inv.foods)) {
      inv.foods.forEach(f => {
        if (typeof f === 'object' && f.name && f.qty) {
          let foodTotal = (typeof f.total === 'number') ? f.total : (f.qty * f.price);
          totalFoodPrice += foodTotal;
          foodsHTML += `<div class=\"bill-receipt-line\" style=\"padding-left:24px; display:flex; justify-content:space-between;\"><span>${f.qty}x ${f.name}</span><span>${foodTotal.toLocaleString()}đ</span></div>`;
        }
      });
    } else if (typeof inv.foods === 'string') {
      let foodsArr = inv.foods.split(',').map(f => f.trim());
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
  const html = `
    <div class=\"modal fade\" id=\"invoiceModal\" tabindex=\"-1\">
      <div class=\"modal-dialog modal-dialog-centered\">
        <div class=\"modal-content\">
          <div class=\"modal-header\">
            <h5 class=\"modal-title\">HÓA ĐƠN THANH TOÁN</h5>
            <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"modal\"></button>
          </div>
          <div class=\"modal-body\">
            <div class=\"bill-receipt-container\" style=\"max-width:340px;margin:auto;\">
              <div class=\"bill-thermal-receipt\">
                <div class=\"text-center mb-3\">
                  <h6 class=\"mb-1\">COP CINEMAS PREMIUM</h6>
                  <p style=\"font-size: 10px;\" class=\"mb-0\">COP Cinemas Chùa Bộc, Hà Nội</p>
                  <p style=\"font-size: 10px;\">Mã GD: <strong>${inv.transactionId || inv.transactionID || '---'}</strong></p>
                </div>
                <div class=\"bill-receipt-line\"><span>Thời gian đặt:</span><span>${bookingDateStr}</span></div>
                ${userInfoHTML}
                <div class=\"bill-receipt-line\"><span class=\"fw-bold text-uppercase\">${inv.tenPhim || ''}</span></div>
                <div class=\"bill-receipt-line\"><span>Ngày chiếu:</span><span>${inv.ngayChieu || ''}</span></div>
                <div class=\"bill-receipt-line\"><span>Suất chiếu:</span><span>${inv.gioChieu || ''}</span></div>
                <div class=\"bill-receipt-line\"><span>Phòng:</span><span>${inv.phongChieu || ''}</span></div>
                <div class=\"bill-receipt-line\"><span>Định dạng:</span><span>${inv.dinhDang || '2D Digital'}</span></div>
                <div class=\"bill-receipt-line\"><span>Danh sách ghế:</span><span>${inv.seats || ''}</span></div>
                <div class=\"bill-receipt-line\"><span>Giá vé:</span><span>${inv.totalSeatPrice ? Number(inv.totalSeatPrice).toLocaleString() + 'đ' : ''}</span></div>
                ${foodsHTML}
                <div class=\"bill-receipt-divider\"></div>
                <div class=\"bill-receipt-line\"><span>Khuyến mãi:</span><span>${inv.discountValue ? '-' + Number(inv.discountValue).toLocaleString() + 'đ' : '0đ'}</span></div>
                <div class=\"bill-receipt-line fw-bold fs-5\"><span>TỔNG THANH TOÁN:</span><span>${(inv.totalPrice || 0).toLocaleString()}đ</span></div>
                <div class=\"text-center mt-3\"><div class=\"bill-receipt-barcode\"></div><p style=\"font-size: 9px;\" class=\"mt-2 mb-0\">Cảm ơn & Hẹn gặp lại!</p></div>
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
  setTimeout(() => {
    const bars = document.querySelector('#invoiceModal .receipt-barcode');
    if (bars) {
      bars.style.background = 'repeating-linear-gradient(90deg, #000, #000 1px, transparent 1px, transparent 3px)';
      bars.style.height = '30px';
      bars.style.width = '100%';
      bars.style.marginTop = '10px';
    }
  }, 200);
}

document.addEventListener('DOMContentLoaded', () => {
    // Chuyển tab nếu có tham số tab trên URL
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam === 'journey' || tabParam === 'invoices' || tabParam === 'info') {
      setTimeout(() => {
        let tabSelector = '';
        if (tabParam === 'journey') tabSelector = '[data-bs-target="#tab-journey"]';
        if (tabParam === 'invoices') tabSelector = '[data-bs-target="#tab-invoices"]';
        if (tabParam === 'info') tabSelector = '[data-bs-target="#tab-info"]';
        const tabBtn = document.querySelector(tabSelector);
        if (tabBtn) tabBtn.click();
      }, 100);
    }
  const user = JSON.parse(localStorage.getItem('currentUser'));
  if (!user) {
    location.href = 'login.html';
    return;
  }

  // --- Hiển thị thông tin user ---
  const avatarEl = document.getElementById('profile-avatar');
  avatarEl.src = user.avatar || '../assets/avatar/avt1.jpg';
  document.getElementById('userName').textContent = user.fullName || user.username || '';
  document.getElementById('profileFullName').value = user.fullName || '';
  document.getElementById('profileUsername').value = user.username || '';
  document.getElementById('profileEmail').value = user.email || '';

  // --- Lấy hóa đơn của user ---
  const userBookings = JSON.parse(localStorage.getItem('userBookings') || '{}');
  const invoices = userBookings[user.email || user.username] || [];

  // Sắp xếp hóa đơn mới nhất trước (ưu tiên bookingDate, fallback createdAt)
  invoices.sort((a, b) => {
    const dateA = a.bookingDate ? new Date(a.bookingDate) : (a.createdAt ? new Date(a.createdAt) : 0);
    const dateB = b.bookingDate ? new Date(b.bookingDate) : (b.createdAt ? new Date(b.createdAt) : 0);
    return dateB - dateA;
  });

  // --- Hiển thị số phim đã xem & tổng tiền ---
  document.getElementById('statMovies').textContent = invoices.length;
  const totalMoney = invoices.reduce((sum, inv) => sum + (inv.totalPrice || 0), 0);
  document.getElementById('statMoney').textContent = totalMoney.toLocaleString() + 'đ';

  // --- Hiển thị hóa đơn trong bảng ---
  const billTbody = document.querySelector('#tab-invoices tbody');
  if (billTbody) {
    billTbody.innerHTML = '';
    if (invoices.length === 0) {
      billTbody.innerHTML = '<tr><td colspan="4" class="text-center">Chưa có hóa đơn nào</td></tr>';
    } else {
      invoices.forEach(inv => {
        const tr = document.createElement('tr');
        // Định dạng lại ngày đặt
        let bookingDateStr = '';
        if (inv.bookingDate) {
          const d = new Date(inv.bookingDate);
          const date = d.toLocaleDateString('vi-VN');
          const hour = d.getHours().toString().padStart(2, '0');
          const min = d.getMinutes().toString().padStart(2, '0');
          bookingDateStr = `${hour}:${min}, ${date}`;
        }
        tr.innerHTML = `
          <td>${bookingDateStr}</td>
          <td>${inv.tenPhim || ''}</td>
          <td>${inv.ngayChieu || ''}</td>
          <td class="text-gold">${(inv.totalPrice || 0).toLocaleString()}đ</td>
        `;
        tr.addEventListener('click', () => showInvoiceDetail(inv));
        billTbody.appendChild(tr);
      });
    }
  }

  // --- Chỉnh sửa profile ---
  const btnEdit = document.getElementById('btn-edit-profile');
  const btnSave = document.getElementById('btn-save-profile');
  const inputName = document.getElementById('profileFullName');

  btnEdit.onclick = () => {
    inputName.disabled = false;
    btnEdit.classList.add('d-none');
    btnSave.classList.remove('d-none');
  };

  document.querySelector('form').onsubmit = e => {
    e.preventDefault();
    user.fullName = inputName.value.trim();
    localStorage.setItem('currentUser', JSON.stringify(user));
    document.getElementById('userName').textContent = user.fullName;
    inputName.disabled = true;
    btnSave.classList.add('d-none');
    btnEdit.classList.remove('d-none');
    alert('Cập nhật thành công');
  };

  document.getElementById('avatar-upload').onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      user.avatar = reader.result;
      localStorage.setItem('currentUser', JSON.stringify(user));
      avatarEl.src = reader.result;
      setTimeout(() => location.reload(), 300);
    };
    reader.readAsDataURL(file);
  };
});
    renderJourney();

// --- Render hành trình phim ---
function renderJourney() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const track = document.getElementById("journeyTrack");
  track.innerHTML = "";
  if (!user) {
    track.innerHTML = '<div class="text-center text-muted">Bạn chưa có hành trình phim nào.</div>';
    return;
  }

  const userBookings = JSON.parse(localStorage.getItem('userBookings') || '{}');
  const invoices = userBookings[user.email || user.username] || [];
  if (invoices.length === 0) {
    track.innerHTML = '<div class="text-center text-muted">Bạn chưa có hành trình phim nào.</div>';
    return;
  }

  invoices.sort((a, b) => {
    const dateA = a.bookingDate ? new Date(a.bookingDate) : (a.createdAt ? new Date(a.createdAt) : 0);
    const dateB = b.bookingDate ? new Date(b.bookingDate) : (b.createdAt ? new Date(b.createdAt) : 0);
    return dateA.getTime() - dateB.getTime();
  });
  invoices.reverse();

  invoices.forEach(inv => {
    const item = document.createElement("div");
    item.className = "journey-item";
    let poster = inv.anhPhim || 'default.jpg';
    // Nếu poster không phải là đường dẫn tuyệt đối thì thêm prefix
    if (!/^https?:\/\//.test(poster) && !poster.startsWith('/')) {
      if (!poster.startsWith('assets/')) poster = '../assets/images/posters/' + poster.replace(/^\.\//, '');
      else poster = '../' + poster.replace(/^\.\//, '');
    }
    // Định dạng lại ngày đặt vé
    let bookingDateStr = '';
    if (inv.bookingDate) {
      const d = new Date(inv.bookingDate);
      const date = d.toLocaleDateString('vi-VN');
      const hour = d.getHours().toString().padStart(2, '0');
      const min = d.getMinutes().toString().padStart(2, '0');
      bookingDateStr = `${hour}:${min}, ${date}`;
    }
    item.innerHTML = `
      <div class="journey-top-content">
        <div class="journey-poster">
          <img src="${poster}" alt="${inv.tenPhim || ''}">
        </div>
        <div class="journey-title">${inv.tenPhim || ''}</div>
      </div>
      <div class="journey-dot"></div>
      <div class="journey-date">${bookingDateStr}</div>
    `;
    track.appendChild(item);
  });
}

renderJourney();