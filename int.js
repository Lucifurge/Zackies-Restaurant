document.addEventListener("DOMContentLoaded", () => {
  const zoomableImages = document.querySelectorAll(".zoomable");
  let activeImage = null; // Tracks the currently zoomed image
  let scale = 1, lastX = 0, lastY = 0; // Zoom and drag state
  let startX = 0, startY = 0; // Drag start positions
  let isDragging = false; // Dragging state
  let isZoomed = false; // Tracks whether zoom is active
  let initialDistance = null; // Pinch zoom distance
  let initialScale = 1; // Initial scale for pinch-to-zoom

  zoomableImages.forEach((img) => {
    // Double-tap or pinch zoom to toggle zoom
    let doubleTapTimeout = null;
    img.addEventListener("click", (e) => {
      if (doubleTapTimeout) {
        clearTimeout(doubleTapTimeout);
        doubleTapTimeout = null;
        toggleZoom(img);
      } else {
        doubleTapTimeout = setTimeout(() => {
          doubleTapTimeout = null;
        }, 300); // Time threshold for double-tap
      }
    });

    // Pinch-to-zoom (touch gesture for zooming in/out)
    img.addEventListener(
      "touchstart",
      (e) => {
        if (e.touches.length === 2) {
          initialDistance = getPinchDistance(e);
          initialScale = scale;
        } else if (e.touches.length === 1 && scale > 1) {
          isDragging = true;
          startX = e.touches[0].clientX - lastX;
          startY = e.touches[0].clientY - lastY;
        }
      },
      { passive: false }
    );

    img.addEventListener(
      "touchmove",
      (e) => {
        if (e.touches.length === 2) {
          e.preventDefault();
          const currentDistance = getPinchDistance(e);
          scale = Math.max(1, Math.min(initialScale * (currentDistance / initialDistance), 4)); // Zoom limits (1x to 4x)
          applyTransform(img);
        } else if (isDragging && e.touches.length === 1) {
          lastX = e.touches[0].clientX - startX;
          lastY = e.touches[0].clientY - startY;
          applyTransform(img);
        }
      },
      { passive: false }
    );

    img.addEventListener("touchend", () => {
      isDragging = false;
      if (scale === 1) {
        resetZoom();
      }
    });

    // Handle mouse interactions for dragging
    img.addEventListener("mousedown", (e) => {
      if (scale === 1) return; // No dragging if not zoomed
      isDragging = true;
      startX = e.clientX - lastX;
      startY = e.clientY - lastY;
      img.style.cursor = "grabbing";
    });

    img.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      lastX = e.clientX - startX;
      lastY = e.clientY - startY;
      applyTransform(img);
    });

    img.addEventListener("mouseup", () => {
      isDragging = false;
      img.style.cursor = "grab";
    });

    img.addEventListener("mouseleave", () => {
      isDragging = false;
      img.style.cursor = "grab";
    });

    // Toggle zoom (double-tap or pinch)
    function toggleZoom(image) {
      if (activeImage && activeImage !== image) return; // Prevent zooming other images while one is active
      if (scale > 1) {
        resetZoom(); // Zoom out if already zoomed in
      } else {
        scale = 2; // Zoom level (adjust as needed)
        activeImage = image;
        applyTransform(image);
        isZoomed = true;
        lockCarouselNavigation(true); // Lock carousel while zoomed
      }
    }

    // Reset zoom and unlock carousel
    function resetZoom() {
      scale = 1;
      lastX = 0;
      lastY = 0;
      if (activeImage) {
        activeImage.style.transform = `scale(1) translate(0, 0)`;
      }
      activeImage = null;
      isZoomed = false;
      lockCarouselNavigation(false); // Unlock carousel
    }

    // Apply transformations (zoom + drag) with boundaries
    function applyTransform(image) {
      const maxX = (image.offsetWidth * (scale - 1)) / 2;
      const maxY = (image.offsetHeight * (scale - 1)) / 2;

      // Clamp dragging to boundaries
      lastX = Math.max(-maxX, Math.min(maxX, lastX));
      lastY = Math.max(-maxY, Math.min(maxY, lastY));

      image.style.transform = `scale(${scale}) translate(${lastX / scale}px, ${lastY / scale}px)`;
    }

    // Get pinch distance for touch zoom
    function getPinchDistance(e) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }
  });

  // Lock/unlock carousel navigation
  function lockCarouselNavigation(lock) {
    const carouselItems = document.querySelectorAll(".carousel-item");
    carouselItems.forEach((item) => {
      if (lock) {
        item.classList.add("no-swipe"); // Disable swiping
      } else {
        item.classList.remove("no-swipe"); // Enable swiping
      }
    });
  }

  // Prevent carousel swiping while zoomed
  document.querySelectorAll(".carousel").forEach((carousel) => {
    carousel.addEventListener("touchstart", (e) => {
      if (isZoomed) {
        e.stopPropagation(); // Disable swipe gestures
      }
    });
  });
});
