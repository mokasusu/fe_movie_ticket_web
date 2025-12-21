import { BASE_PATH } from "../config.js";

export function initHeader() {
  // Logo link and image
  var logoLink = document.getElementById('header-logo-link');
  if (logoLink) logoLink.href = (BASE_PATH ? BASE_PATH : '') + '/index.html';
  var logoImg = document.getElementById('header-logo-img');
  var logoPath = (BASE_PATH ? BASE_PATH : '') + '/assets/icons/logo.png';
  if (logoImg) logoImg.src = logoPath;
  // Nav links
  var navs = [
    { id: 'nav-lich-chieu', path: '/pages/lich_chieu.html' },
    { id: 'nav-rap', path: '/pages/rap.html' },
    { id: 'nav-news', path: '/pages/news_list.html' },
    { id: 'nav-uudai', path: '/pages/uudai_list.html' },
    { id: 'nav-giave', path: '/pages/gia_ve.html' }
  ];
  navs.forEach(function(nav) {
    var el = document.getElementById(nav.id);
    if (el) el.href = (BASE_PATH ? BASE_PATH : '') + nav.path;
  });
  // User menu logic
  initHeaderUserMenu();
}

function initHeaderUserMenu() {
  const userMenu = document.querySelector('.user-menu');
  if (!userMenu) return;

  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  if (currentUser) {
    // Xác định base path từ vị trí hiện tại
    // Đường dẫn avatar
    let avatarPath = currentUser.avatar || 'assets/avatar/avt1.jpg';
    // Nếu là base64 (data:), giữ nguyên
    if (avatarPath && avatarPath.startsWith('data:')) {
      // giữ nguyên
    } else if (avatarPath && !/^https?:\/\//.test(avatarPath)) {
      // Nếu là đường dẫn tương đối thì ghép BASE_PATH
      if (avatarPath.startsWith('/')) {
        avatarPath = BASE_PATH + avatarPath;
      } else {
        avatarPath = BASE_PATH + '/' + avatarPath;
      }
    }
    const taiKhoanPath = `${BASE_PATH}/pages/tai_khoan.html`;
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
          window.location.href = `${BASE_PATH}/pages/tai_khoan.html?tab=info`;
      });
    }
    // Xử lý chuyển tab hóa đơn
    const invoicesMenu = document.getElementById('invoicesMenu');
    if (invoicesMenu) {
      invoicesMenu.addEventListener('click', function(e) {
        e.preventDefault();
        closeDropdown();
          window.location.href = `${BASE_PATH}/pages/tai_khoan.html?tab=invoices`;
      });
    }
    // Xử lý chuyển tab hành trình điện ảnh
    const journeyMenu = document.getElementById('journeyMenu');
    if (journeyMenu) {
      journeyMenu.addEventListener('click', function(e) {
        e.preventDefault();
        closeDropdown();
          window.location.href = `${BASE_PATH}/pages/tai_khoan.html?tab=journey`;
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
        window.location.href = `${BASE_PATH}/index.html`;
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
      // Luôn chuyển hướng tới trang login.html theo đường dẫn tuyệt đối từ root repo
      window.location.href = `${BASE_PATH}/pages/login.html`;
    });
  }
}


