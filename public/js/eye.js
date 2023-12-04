$('.toggle-password1').click(function () {
  $(this).toggleClass('fa-eye fa-eye-slash');
  var input = $('#password1');
  if (input.attr('type') == 'password') {
    input.attr('type', 'text');
  } else {
    input.attr('type', 'password');
  }
});
$('.toggle-password2').click(function () {
  $(this).toggleClass('fa-eye fa-eye-slash');
  var input = $('#password2');
  if (input.attr('type') == 'password') {
    input.attr('type', 'text');
  } else {
    input.attr('type', 'password');
  }
});
