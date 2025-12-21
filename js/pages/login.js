import { BASE_PATH } from "../config.js";

// --- XỬ LÝ CHUYỂN TAB ---
const tabs = document.querySelectorAll('.tab-btn');
const forms = document.querySelectorAll('.form-tab');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const target = tab.dataset.tab;
    forms.forEach(f => f.classList.toggle('active', f.id.includes(target)));
  });
});

// Hàm lấy user mới nhất từ LocalStorage
function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
}

// --- HELPER FUNCTIONS ---
function showError(input, message) {
  const group = input.parentElement;
  group.classList.add('error');
  const errorDisplay = group.querySelector('.error-msg');
  if (errorDisplay) errorDisplay.textContent = message;
}

function resetErrors(form) {
  form.querySelectorAll('.input-group').forEach(g => g.classList.remove('error'));
  form.querySelectorAll('.error-msg').forEach(s => s.textContent = '');
}

// --- LOGIC ĐĂNG NHẬP ---
const loginForm = document.getElementById('loginForm');
const loginUsername = document.getElementById('loginUsername');
const loginPassword = document.getElementById('loginPassword');
const loginInputs = [loginUsername, loginPassword];

loginInputs.forEach(input => {
  input.addEventListener('input', () => {
    input.parentElement.classList.remove('error');
    input.parentElement.querySelector('.error-msg').textContent = '';
  });
});

loginForm.addEventListener('submit', e => {
  e.preventDefault();
  resetErrors(loginForm);

  let isValid = true;

  loginInputs.forEach(input => {
    if(input.value.trim() === '') {
      showError(input, 'Vui lòng nhập thông tin');
      isValid = false;
    }
  });

  if(isValid) {
    const userInput = loginUsername.value.trim();
    const passInput = loginPassword.value.trim();
    const currentUsers = getUsers(); // Lấy dữ liệu mới nhất

    // Tìm user khớp username HOẶC email
    const matchedUser = currentUsers.find(u =>
      (u.username === userInput || u.email === userInput) && u.password === passInput
    );

    if(matchedUser) {
      // Lưu thông tin phiên đăng nhập
      localStorage.setItem('currentUser', JSON.stringify(matchedUser));
      
      // Reset form
      loginForm.reset();
      
      // Chuyển hướng
      window.location.href = `${BASE_PATH}/index.html`;
    } else {
      showError(loginUsername, 'Tài khoản hoặc mật khẩu không chính xác');
      loginPassword.value = '';
    }
  }
});

// --- LOGIC ĐĂNG KÝ ---
const registerForm = document.getElementById('registerForm');
const registerFullName = document.getElementById('registerFullName');
const registerUsername = document.getElementById('registerUsername');
const registerEmail = document.getElementById('registerEmail');
const registerPassword = document.getElementById('registerPassword');
const registerInputs = [registerFullName, registerUsername, registerEmail, registerPassword];

registerInputs.forEach(input => {
  input.addEventListener('input', () => {
    input.parentElement.classList.remove('error');
    input.parentElement.querySelector('.error-msg').textContent = '';
  });
});

registerForm.addEventListener('submit', e => {
  e.preventDefault();
  resetErrors(registerForm);

  let isValid = true;

  // 1. Check rỗng
  registerInputs.forEach(input => {
    if(input.value.trim() === '') {
      showError(input, 'Vui lòng nhập thông tin');
      isValid = false;
    }
  });

  if(!isValid) return;

  // 2. Validate chi tiết
  if(registerFullName.value.trim().length < 2) {
    showError(registerFullName, 'Họ tên phải có ít nhất 2 ký tự');
    isValid = false;
  }

  // Regex username: chỉ chữ, số, gạch dưới, gạch ngang
  if(!/^[\w.@-]{3,30}$/.test(registerUsername.value.trim())) {
    showError(registerUsername, 'Tên đăng nhập 3-30 ký tự, không dấu');
    isValid = false;
  }

  if(!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(registerEmail.value.trim())) {
    showError(registerEmail, 'Email không hợp lệ');
    isValid = false;
  }

  if(registerPassword.value.trim().length < 6) {
    showError(registerPassword, 'Mật khẩu phải ít nhất 6 ký tự');
    isValid = false;
  }

  if(isValid) {
    const currentUsers = getUsers();
    
    const isUsernameTaken = currentUsers.some(u => u.username === registerUsername.value.trim());
    const isEmailTaken = currentUsers.some(u => u.email === registerEmail.value.trim());

    if (isUsernameTaken) {
        showError(registerUsername, 'Tên đăng nhập đã tồn tại');
        return;
    }
    if (isEmailTaken) {
        showError(registerEmail, 'Email này đã được đăng ký');
        return;
    }

    // Tạo user mới
    const newUser = {
      fullName: registerFullName.value.trim(),
      username: registerUsername.value.trim(),
      email: registerEmail.value.trim(),
      password: registerPassword.value.trim(),
      avatar: 'assets/avatar/avt1.jpg'
    };

    currentUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(currentUsers));

    alert('Đăng ký thành công! Vui lòng đăng nhập.');
    registerForm.reset();
    
    // Tự động chuyển sang tab đăng nhập
    document.querySelector('.tab-btn[data-tab="login"]').click();
  }
});