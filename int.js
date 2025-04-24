// Get all zoomable images
const zoomableImages = document.querySelectorAll('.zoomable');

zoomableImages.forEach((image) => {
  let isDragging = false;
  let lastX = 0;
  let lastY = 0;
  let startX = 0;
  let startY = 0;
  let scale = 1;
  let doubleTapTimeout;

  // Zoom toggle on click or double tap
  image.addEventListener('click', (e) => {
    if (doubleTapTimeout) {
      clearTimeout(doubleTapTimeout);
      doubleTapTimeout = null;
      toggleZoom(image);
    } else {
      doubleTapTimeout = setTimeout(() => {
        doubleTapTimeout = null;
      }, 300);
    }
  });

  // Drag start (mouse and touch)
  const dragStart = (e) => {
    isDragging = true;
    image.style.cursor = 'grabbing';

    const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;

    startX = clientX - lastX;
    startY = clientY - lastY;
  };

  // Drag move
  const dragMove = (e) => {
    if (!isDragging || !image.classList.contains('zoomed')) return;

    e.preventDefault();

    const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;

    lastX = clientX - startX;
    lastY = clientY - startY;

    image.style.transform = `scale(${scale}) translate(${lastX / scale}px, ${lastY / scale}px)`;
  };

  // Drag end
  const dragEnd = () => {
    isDragging = false;
    image.style.cursor = 'grab';
  };

  // Attach mouse and touch events
  image.addEventListener('mousedown', dragStart);
  image.addEventListener('mousemove', dragMove);
  image.addEventListener('mouseup', dragEnd);
  image.addEventListener('mouseleave', dragEnd);
  image.addEventListener('touchstart', dragStart, { passive: false });
  image.addEventListener('touchmove', dragMove, { passive: false });
  image.addEventListener('touchend', dragEnd);

  function toggleZoom(img) {
    img.classList.toggle('zoomed');
    if (img.classList.contains('zoomed')) {
      scale = 2;
      lastX = 0;
      lastY = 0;
      img.style.cursor = 'grab';
      img.style.transform = `scale(${scale}) translate(0px, 0px)`;
    } else {
      scale = 1;
      lastX = 0;
      lastY = 0;
      img.style.cursor = 'pointer';
      img.style.transform = 'scale(1)';
    }
  }
});

// Reset image zoom when modal is shown
$('#menuModal').on('shown.bs.modal', function () {
  document.querySelectorAll('.zoomable').forEach(image => {
    image.classList.remove('zoomed');
    image.style.transform = 'scale(1)';
    image.style.cursor = 'pointer';
  });

  // Hide extra slides
  const carouselItems = document.querySelectorAll('.carousel-item');
  carouselItems.forEach((item, index) => {
    item.classList.remove('d-none');
    if (index > 1) item.classList.add('d-none');
  });
});
