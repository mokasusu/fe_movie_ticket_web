import dsPhim from '../data/phim.js';

export const PhimService = {
  layDanhSachPhim,
  layPhimDangChieu,
  layPhimSapChieu
};

function layDanhSachPhim() {
  return dsPhim;
}

function layPhimDangChieu() {
  const homNay = new Date().setHours(0,0,0,0);
  return dsPhim.filter(phim =>
    new Date(phim.ngayKhoiChieu).getTime() <= homNay &&
    phim.lichChieu.length > 0
  );
}

function layPhimSapChieu() {
  const homNay = new Date().setHours(0,0,0,0);
  return dsPhim.filter(phim =>
    new Date(phim.ngayKhoiChieu).getTime() > homNay
  );
}
