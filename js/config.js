// js/config.js

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const repoName = 'cop_cinema'; // Tên chính xác của repo trên GitHub

// Nếu là localhost thì rỗng, nếu là GitHub thì thêm /cop_cinema
export const BASE_PATH = isLocal ? '' : `/${repoName}`;

console.log('Current BASE_PATH:', BASE_PATH); 