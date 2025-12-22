document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".footer-subscribe");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("🎉 Đăng ký nhận ưu đãi thành công!");
    form.reset();
  });
});

