import NEWS_DATA from '../data/news_data.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Lấy ID từ URL (ví dụ: ?id=new01)
    const urlParams = new URLSearchParams(window.location.search);
    const newsId = urlParams.get('id');

    // 2. Tìm tin tức tương ứng trong mảng dữ liệu
    const news = NEWS_DATA.find(item => item.id === newsId);

    // 3. Nếu không tìm thấy, báo lỗi
    if (!news) {
        document.getElementById('news-title').textContent = "Không tìm thấy tin tức này!";
        return;
    }

    // 4. Đổ dữ liệu vào các thẻ HTML
    document.title = news.title; // Cập nhật tiêu đề trình duyệt
    document.getElementById('news-title').textContent = news.title;
    document.getElementById('news-date').textContent = news.date;
    document.getElementById('news-intro').textContent = news.intro;

    // Đổ hình ảnh đầu tiên (nếu có)
    if (news.images && news.images.length > 0) {
        const gallery = document.getElementById('news-gallery');
        gallery.innerHTML = `
            <img src="${news.images[0].src}" alt="${news.title}">
            <div class="image-caption">${news.images[0].caption}</div>
        `;
    }

    // Đổ các đoạn văn bản (paragraphs)
    const textContainer = document.getElementById('news-text');
    textContainer.innerHTML = news.paragraphs.map(p => `<p>${p}</p>`).join('');

    // Đổ danh sách tin liên quan
    const relatedList = document.getElementById('related-news-list');
    if (news.relatedNews && news.relatedNews.length > 0) {
        relatedList.innerHTML = news.relatedNews.map(item => `
            <li><a href="/cop_cinema/pages/news_detail.html?id=${item.id}">${item.title}</a></li>
        `).join('');
    } else {
        relatedList.innerHTML = "<li>Không có tin tức liên quan.</li>";
    }
});