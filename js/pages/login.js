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

let users = JSON.parse(localStorage.getItem('users')) || [];

const loginForm = document.getElementById('loginForm');
const loginUsername = document.getElementById('loginUsername');
const loginPassword = document.getElementById('loginPassword');
const loginInputs = [loginUsername, loginPassword];

loginInputs.forEach(input => {
  input.touched = false;
  input.addEventListener('input', () => {
    input.touched = true;
    input.parentElement.classList.remove('error');
    input.parentElement.querySelector('.error-msg').textContent = '';
  });
});

loginForm.addEventListener('submit', e => {
  e.preventDefault();
  resetErrors(loginForm);

  let isValid = true;

  loginInputs.forEach(input => {
    if(!input.touched || input.value.trim() === '') {
      showError(input, 'Vui lòng nhập thông tin');
      isValid = false;
    }
  });

  if(isValid) {
    const userInput = loginUsername.value.trim();
    const passInput = loginPassword.value.trim();

    const matchedUser = users.find(u => 
      (u.username === userInput || u.email === userInput) && u.password === passInput
    );

    if(matchedUser) {
      localStorage.setItem('currentUser', JSON.stringify(matchedUser));
      loginForm.reset();
      loginInputs.forEach(i => i.touched = false);
      window.location.href = '/cop_cinema/index.html';
    } else {
      showError(loginUsername, 'Tên đăng nhập/email hoặc mật khẩu không đúng');
      showError(loginPassword, '');
    }
  }
});

const registerForm = document.getElementById('registerForm');
const registerFullName = document.getElementById('registerFullName');
const registerUsername = document.getElementById('registerUsername');
const registerEmail = document.getElementById('registerEmail');
const registerPassword = document.getElementById('registerPassword');
const registerInputs = [registerFullName, registerUsername, registerEmail, registerPassword];

registerInputs.forEach(input => {
  input.touched = false;
  input.addEventListener('input', () => {
    input.touched = true;
    input.parentElement.classList.remove('error');
    input.parentElement.querySelector('.error-msg').textContent = '';
  });
});

registerForm.addEventListener('submit', e => {
  e.preventDefault();
  resetErrors(registerForm);

  let isValid = true;

  registerInputs.forEach(input => {
    if(!input.touched || input.value.trim() === '') {
      showError(input, 'Vui lòng nhập thông tin');
      isValid = false;
    }
  });

  if(registerFullName.value.trim() !== '' && registerFullName.value.trim().length < 2) {
    showError(registerFullName, 'Họ tên phải có ít nhất 2 ký tự');
    isValid = false;
  }

  if(registerUsername.value.trim() !== '' && !/^[\w.@-]{3,30}$/.test(registerUsername.value.trim())) {
    showError(registerUsername, 'Tên đăng nhập không hợp lệ');
    isValid = false;
  }

  if(registerEmail.value.trim() !== '' && !/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(registerEmail.value.trim())) {
    showError(registerEmail, 'Email không hợp lệ');
    isValid = false;
  }

  if(registerPassword.value.trim() !== '' && registerPassword.value.trim().length < 6) {
    showError(registerPassword, 'Mật khẩu phải ít nhất 6 ký tự');
    isValid = false;
  }

  if(isValid) {
    if(users.find(u => u.username === registerUsername.value.trim() || u.email === registerEmail.value.trim())) {
      alert('Tên đăng nhập hoặc email đã tồn tại');
      return;
    }

    const newUser = {
      fullName: registerFullName.value.trim(),
      username: registerUsername.value.trim(),
      email: registerEmail.value.trim(),
      password: registerPassword.value.trim(),
      avatar: '/cop_cinema/assets/avatar/avt1.jpg'
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    alert('Đăng ký thành công!');
    registerForm.reset();
    registerInputs.forEach(i => i.touched = false);
    document.querySelector('.tab-btn[data-tab="login"]').click();
  }
});

function showError(input, message) {
  const group = input.parentElement;
  group.classList.add('error');
  group.querySelector('.error-msg').textContent = message;
}

function resetErrors(form) {
  form.querySelectorAll('.input-group').forEach(g => g.classList.remove('error'));
  form.querySelectorAll('.error-msg').forEach(s => s.textContent = '');
}
