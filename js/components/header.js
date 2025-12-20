function initHeaderUserMenu() {
  const userMenu = document.querySelector('.user-menu');
  if (!userMenu) return;

  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  if (currentUser) {
    // Nếu đã đăng nhập, hiển thị avatar
    userMenu.innerHTML = `
      <a href="#" class="d-flex align-items-center" data-bs-toggle="dropdown">
        <img src="${currentUser.avatar || '/assets/avatar/avt1.jpg'}" alt="${currentUser.username}" class="avatar-img">
      </a>
      <ul class="dropdown-menu dropdown-menu-end user-dropdown">
        <li><a class="dropdown-item" href="/pages/tai_khoan.html">Thông tin của tôi</a></li>
        <li><a class="dropdown-item" href="/pages/ve_cua_toi.html">Vé của tôi</a></li>
        <li><hr class="dropdown-divider"></li>
        <li><a class="dropdown-item logout" href="#" id="logoutBtn">Đăng xuất</a></li>
      </ul>
    `;

    // Xử lý logout
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', e => {
      e.preventDefault();
      // Xoá thông tin đăng nhập và về trang chủ
      localStorage.removeItem('currentUser');
      // Có thể dọn dẹp thêm các state liên quan đặt vé nếu cần
      localStorage.removeItem('selectedShowtime');
      window.location.href = '/index.html';
    });

    // Hover dropdown (giữ hiệu ứng fadeIn/fadeOut)
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      $(userMenu).hover(
        function () {
          $(this).find('.dropdown-menu').stop(true, true).fadeIn(150);
        },
        function () {
          $(this).find('.dropdown-menu').stop(true, true).fadeOut(150);
        }
      );
    }

  } else {
    userMenu.innerHTML = `
      <button class="btn btn-login" id="loginBtn">Đăng nhập</button>
    `;

    const loginBtn = document.getElementById('loginBtn');
    loginBtn.addEventListener('click', () => {
      window.location.href = '../../pages/login.html';
    });
  }
}

// Cho phép gọi lại sau khi header được inject
window.initHeaderUserMenu = initHeaderUserMenu;
