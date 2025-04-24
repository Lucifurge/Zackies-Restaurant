const zoomableImages = document.querySelectorAll('.zoomable');

zoomableImages.forEach((img) => {
  let scale = 1;
  let lastX = 0, lastY = 0;
  let startX = 0, startY = 0;
  let isDragging = false;
  let isTouchDragging = false;
  let doubleTapTimeout;

  // Toggle Zoom on double-tap/click
  img.addEventListener('click', (e) => {
    if (doubleTapTimeout) {
      clearTimeout(doubleTapTimeout);
      doubleTapTimeout = null;
      toggleZoom();
    } else {
      doubleTapTimeout = setTimeout(() => {
        doubleTapTimeout = null;
      }, 300);
    }
  });

  function toggleZoom() {
    if (scale !== 1) {
      scale = 1;
      lastX = lastY = 0;
      img.style.transform = `scale(1) translate(0px, 0px)`;
      img.classList.remove('zoomed');
    } else {
      scale = 2;
      img.classList.add('zoomed');
      img.style.cursor = 'grab';
      img.style.transform = `scale(${scale}) translate(0px, 0px)`;
    }
  }

  // MOUSE DRAGGING
  img.addEventListener('mousedown', (e) => {
    if (scale === 1) return;
    isDragging = true;
    startX = e.clientX - lastX;
    startY = e.clientY - lastY;
    img.style.cursor = 'grabbing';
  });

  img.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    lastX = e.clientX - startX;
    lastY = e.clientY - startY;
    img.style.transform = `scale(${scale}) translate(${lastX / scale}px, ${lastY / scale}px)`;
  });

  img.addEventListener('mouseup', () => {
    isDragging = false;
    img.style.cursor = 'grab';
  });

  img.addEventListener('mouseleave', () => {
    isDragging = false;
    img.style.cursor = 'grab';
  });

  // TOUCH DRAGGING (Prevent swipe in carousel)
  img.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1 && scale > 1) {
      isTouchDragging = true;
      startX = e.touches[0].clientX - lastX;
      startY = e.touches[0].clientY - lastY;
    }

    if (e.touches.length === 2) {
      initialDistance = getPinchDistance(e);
      initialScale = scale;
    }
  }, { passive: false });

  img.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const currentDistance = getPinchDistance(e);
      scale = Math.min(Math.max(initialScale * (currentDistance / initialDistance), 1), 4);
      img.classList.add('zoomed');
      img.style.transform = `scale(${scale}) translate(${lastX / scale}px, ${lastY / scale}px)`;
      return;
    }

    if (isTouchDragging && e.touches.length === 1 && scale > 1) {
      e.preventDefault();
      const touch = e.touches[0];
      lastX = touch.clientX - startX;
      lastY = touch.clientY - startY;
      img.style.transform = `scale(${scale}) translate(${lastX / scale}px, ${lastY / scale}px)`;
    }
  }, { passive: false });

  img.addEventListener('touchend', () => {
    isTouchDragging = false;
  });

  function getPinchDistance(e) {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }
});

// Reset zoom & transforms on modal show
$('#menuModal').on('shown.bs.modal', function () {
  document.querySelectorAll('.zoomable').forEach(img => {
    img.classList.remove('zoomed');
    img.style.transform = 'scale(1) translate(0px, 0px)';
    img.style.cursor = 'pointer';
  });

  const carouselItems = document.querySelectorAll('.carousel-item');
  carouselItems.forEach((item, index) => {
    item.classList.remove('d-none');
    if (index > 1) item.classList.add('d-none');
  });
});
