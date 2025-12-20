import NEWS_DATA from '../data/news_data.js';

const itemsPerPage = 6;
let currentPage = 1;

function renderNews(page) {
    const container = $('#news-list');
    container.hide().empty();

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const currentItems = NEWS_DATA.slice(start, end);

    currentItems.forEach(item => {
        const html = `
            <div class="news-card" onclick="location.href='/pages/news_detail.html?id=${item.id}'">
                <img src="${item.thumbnail}" alt="${item.title}">
                <div class="news-info">
                    <span class="news-date">${item.date}</span>
                    <h3 class="news-title">${item.title}</h3>
                </div>
            </div>
        `;
        container.append(html);
    });

    container.fadeIn(500);
}

function renderPagination() {
    const paginationContainer = $('#pagination');
    paginationContainer.empty();

    const totalPages = Math.ceil(NEWS_DATA.length / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const btn = $('<button>').addClass('page-btn').text(i);
        if (i === currentPage) btn.addClass('active');

        btn.on('click', function() {
            currentPage = i;
            renderNews(currentPage);
            renderPagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        paginationContainer.append(btn);
    }
}

$(document).ready(() => {
    renderNews(currentPage);
    renderPagination();
});