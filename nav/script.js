//display flyout mobile-menu
$('.nav__toggle').on('click', function() {
  $('.nav, .mobile-mask').toggleClass('show');
});

$('.mobile-mask').on('click', function() {
  $('.nav, .mobile-mask').removeClass('show');
});