document.addEventListener('DOMContentLoaded', function () {
  const navbarToggler = document.querySelector('.navbar-toggler');
  const navbarCollapse = document.querySelector('.navbar-collapse');

  navbarToggler.addEventListener('click', function () {
    if (navbarCollapse.classList.contains('show')) {
      navbarCollapse.classList.remove('show');
    } else {
      navbarCollapse.classList.add('show');
    }
  });
});
