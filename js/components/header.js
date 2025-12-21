function initHeaderUserMenu() {
  const userMenu = document.querySelector('.user-menu');
  if (!userMenu) return;

  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  if (currentUser) {
    // Xác định base path từ vị trí hiện tại
    function getBasePath() {
      const pathArr = window.location.pathname.split('/');
      // Nếu đang ở root (index.html)
      if (pathArr.length <= 2) return '';
      // Nếu đang ở /pages
      if (pathArr.includes('pages')) return '/pages';
      return '';
    }
    const basePath = getBasePath();
    // Đường dẫn avatar
    const avatarPath = currentUser.avatar || `${basePath ? basePath + '/../' : ''}assets/avatar/avt1.jpg`;
    // Đường dẫn các trang
    const taiKhoanPath = `${basePath}/pages/tai_khoan.html`;
    userMenu.innerHTML = `
      <a href="#" class="d-flex align-items-center" data-bs-toggle="dropdown">
        <img src="${avatarPath}" alt="${currentUser.username}" class="avatar-img">
      </a>
      <ul class="dropdown-menu dropdown-menu-end user-dropdown">
        <li><a class="dropdown-item" id="infoMenu" href="#">Thông tin cá nhân</a></li>
        <li><a class="dropdown-item" id="invoicesMenu" href="#">Hóa đơn</a></li>
        <li><a class="dropdown-item" id="journeyMenu" href="#">Hành trình điện ảnh</a></li>
        <li><hr class="dropdown-divider"></li>
        <li><a class="dropdown-item logout" href="#" id="logoutBtn">Đăng xuất</a></li>
      </ul>
    `;

    // Hàm đóng dropdown menu
    function closeDropdown() {
      const dropdownMenu = userMenu.querySelector('.dropdown-menu');
      if (dropdownMenu) {
        dropdownMenu.style.display = 'none';
      }
    }
    // Xử lý chuyển tab thông tin cá nhân
    const infoMenu = document.getElementById('infoMenu');
    if (infoMenu) {
      infoMenu.addEventListener('click', function(e) {
        e.preventDefault();
        closeDropdown();
        window.location.href = `${window.location.origin}${taiKhoanPath}?tab=info`;
      });
    }
    // Xử lý chuyển tab hóa đơn
    const invoicesMenu = document.getElementById('invoicesMenu');
    if (invoicesMenu) {
      invoicesMenu.addEventListener('click', function(e) {
        e.preventDefault();
        closeDropdown();
        window.location.href = `${window.location.origin}${taiKhoanPath}?tab=invoices`;
      });
    }
    // Xử lý chuyển tab hành trình điện ảnh
    const journeyMenu = document.getElementById('journeyMenu');
    if (journeyMenu) {
      journeyMenu.addEventListener('click', function(e) {
        e.preventDefault();
        closeDropdown();
        window.location.href = `${window.location.origin}${taiKhoanPath}?tab=journey`;
      });
    }

    // Xử lý logout
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', e => {
      e.preventDefault();
      // Xoá thông tin đăng nhập
      localStorage.removeItem('currentUser');

      localStorage.removeItem('selectedShowtime');
      // Quay về trang chủ (index.html) ở root
      window.location.href = `${window.location.origin}/index.html`;
    });

    // Hover dropdown
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
      // Đường dẫn login.html
      window.location.href = `${window.location.origin}/pages/login.html`;
    });
  }
}

window.initHeaderUserMenu = initHeaderUserMenu;
