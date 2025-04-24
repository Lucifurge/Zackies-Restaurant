// Custom JavaScript to toggle the collapse class
    document.addEventListener('DOMContentLoaded', function () {
      const navbarToggler = document.getElementById('navbarTogglerButton');
      const navbarCollapse = document.getElementById('mainNavbar');

      navbarToggler.addEventListener('click', function () {
        // Toggle the 'collapse' class to show or hide the navbar
        navbarCollapse.classList.toggle('show');
      });
    });
  
