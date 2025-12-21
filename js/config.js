// Xác định BASE_PATH động cho cả localhost (Live Server) và GitHub Pages
// Nếu chạy ở localhost: BASE_PATH = ''
// Nếu chạy ở GitHub Pages: BASE_PATH = '/cop_cinema'
let BASE_PATH = '';
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
	BASE_PATH = '';
} else {
	// Lấy phần đầu tiên sau domain, ví dụ: /cop_cinema
	const pathParts = window.location.pathname.split('/').filter(Boolean);
	BASE_PATH = pathParts.length > 0 ? `/${pathParts[0]}` : '';
}
export { BASE_PATH };