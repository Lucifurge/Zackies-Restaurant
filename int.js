const zoomableImages = document.querySelectorAll('.zoomable');

zoomableImages.forEach((img) => {
  let scale = 1;
  let lastScale = 1;
  let lastX = 0, lastY = 0;
  let startX = 0, startY = 0;
  let isDragging = false;
  let doubleTapTimeout;

  // Tap to toggle zoom (mimics Google Photos double-tap)
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
      img.style.transform = `scale(${scale}) translate(0px, 0px)`;
    }
  }

  // DRAGGING (Mouse + Touch)
  const dragStart = (e) => {
    if (scale === 1) return;
    isDragging = true;
    img.style.cursor = 'grabbing';

    const evt = e.type.startsWith('mouse') ? e : e.touches[0];
    startX = evt.clientX - lastX;
    startY = evt.clientY - lastY;
  };

  const dragMove = (e) => {
    if (!isDragging || scale === 1) return;
    e.preventDefault();

    const evt = e.type.startsWith('mouse') ? e : e.touches[0];
    lastX = evt.clientX - startX;
    lastY = evt.clientY - startY;

    img.style.transform = `scale(${scale}) translate(${lastX / scale}px, ${lastY / scale}px)`;
  };

  const dragEnd = () => {
    isDragging = false;
    img.style.cursor = 'grab';
  };

  // PINCH TO ZOOM (Mobile gesture)
  let initialDistance = 0;
  let initialScale = 1;

  img.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
      initialDistance = getPinchDistance(e);
      initialScale = scale;
    }
  }, { passive: false });

  img.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const currentDistance = getPinchDistance(e);
      scale = Math.min(Math.max(initialScale * (currentDistance / initialDistance), 1), 4); // limit zoom
      img.classList.add('zoomed');
      img.style.transform = `scale(${scale}) translate(${lastX / scale}px, ${lastY / scale}px)`;
    }
  }, { passive: false });

  function getPinchDistance(e) {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // Mouse / touch listeners
  img.addEventListener('mousedown', dragStart);
  img.addEventListener('mousemove', dragMove);
  img.addEventListener('mouseup', dragEnd);
  img.addEventListener('mouseleave', dragEnd);
  img.addEventListener('touchstart', dragStart, { passive: false });
  img.addEventListener('touchmove', dragMove, { passive: false });
  img.addEventListener('touchend', dragEnd);
});

// Reset zoom on modal show
$('#menuModal').on('shown.bs.modal', function () {
  document.querySelectorAll('.zoomable').forEach(img => {
    img.classList.remove('zoomed');
    img.style.transform = 'scale(1) translate(0px, 0px)';
  });

  const carouselItems = document.querySelectorAll('.carousel-item');
  carouselItems.forEach((item, index) => {
    item.classList.remove('d-none');
    if (index > 1) item.classList.add('d-none');
  });
});
