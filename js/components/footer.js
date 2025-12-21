import { BASE_PATH } from "../config.js";

// Set footer links after HTML is injected
export function initFooter() {
  const links = [
    { id: 'footer-lich-chieu', path: '/pages/lich_chieu.html' },
    { id: 'footer-rap', path: '/pages/rap.html' },
    { id: 'footer-giave', path: '/pages/gia_ve.html' },
    { id: 'footer-uudai', path: '/pages/uudai_list.html' }
  ];
  links.forEach(link => {
    const el = document.getElementById(link.id);
    if (el) el.href = BASE_PATH + link.path;
  });

  const form = document.querySelector(".footer-subscribe");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("🎉 Đăng ký nhận ưu đãi thành công!");
      form.reset();
    });
  }
}

