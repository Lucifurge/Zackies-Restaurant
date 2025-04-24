document.querySelectorAll('.menu-image').forEach(image => {
  image.addEventListener('click', () => {
    if (!image.classList.contains('fullscreen')) {
      image.classList.add('fullscreen');
      image.style.zIndex = 9999;
    } else {
      image.classList.remove('fullscreen');
      image.style.zIndex = '';
    }
  });
});
