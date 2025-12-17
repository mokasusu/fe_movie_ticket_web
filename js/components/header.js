$(document).ready(function () {
  $('.user-menu').hover(
    function () {
      $(this).find('.dropdown-menu').stop(true, true).fadeIn(150);
    },
    function () {
      $(this).find('.dropdown-menu').stop(true, true).fadeOut(150);
    }
  );
});
