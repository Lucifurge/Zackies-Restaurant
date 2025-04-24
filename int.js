document.addEventListener("DOMContentLoaded", () => {
  const zoomableImages = document.querySelectorAll(".zoomable");
  let activeImage = null; // Keeps track of the currently zoomed image
  let scale = 1, lastX = 0, lastY = 0; // Shared state for zoom and drag
  let startX = 0, startY = 0; // Drag starting positions
  let isDragging = false; // Dragging state
  let doubleTapTimeout = null; // Double-tap tracking
  let isZoomed = false; // Tracks whether zoom is active

  zoomableImages.forEach((img) => {
    // Handle double-tap/double-click to toggle zoom
    img.addEventListener("click", (e) => {
      if (doubleTapTimeout) {
        clearTimeout(doubleTapTimeout);
        doubleTapTimeout = null;
        toggleZoom(img);
      } else {
        doubleTapTimeout = setTimeout(() => {
          doubleTapTimeout = null;
        }, 300);
      }
    });

    function toggleZoom(image) {
      if (activeImage && activeImage !== image) return; // Ignore clicks on other images while zoomed
      if (scale > 1) {
        resetZoom();
      } else {
        scale = 2; // Adjust the zoom level as needed
        activeImage = image;
        image.style.transform = `scale(${scale}) translate(0px, 0px)`;
        isZoomed = true;
        lockCarouselNavigation(true); // Lock carousel when zoomed
      }
    }

    // Reset zoom and re-enable carousel swipe
    function resetZoom() {
      scale = 1;
      lastX = 0;
      lastY = 0;
      if (activeImage) {
        activeImage.style.transform = `scale(1) translate(0, 0)`;
      }
      activeImage = null;
      isZoomed = false;
      lockCarouselNavigation(false); // Unlock carousel swipe
    }

    // Handle dragging with mouse
    img.addEventListener("mousedown", (e) => {
      if (scale === 1) return; // Don't allow dragging if not zoomed
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

    // Handle dragging with touch
    img.addEventListener(
      "touchstart",
      (e) => {
        if (scale === 1) return;
        if (e.touches.length === 1) {
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
        if (!isDragging || e.touches.length !== 1) return;
        lastX = e.touches[0].clientX - startX;
        lastY = e.touches[0].clientY - startY;
        applyTransform(img);
      },
      { passive: false }
    );

    img.addEventListener("touchend", () => {
      isDragging = false;
    });

    // Apply zoom and drag transformations
    function applyTransform(image) {
      const maxX = (image.offsetWidth * (scale - 1)) / 2;
      const maxY = (image.offsetHeight * (scale - 1)) / 2;

      // Clamp dragging to bounds
      lastX = Math.max(-maxX, Math.min(maxX, lastX));
      lastY = Math.max(-maxY, Math.min(maxY, lastY));

      image.style.transform = `scale(${scale}) translate(${lastX / scale}px, ${lastY / scale}px)`;
    }
  });

  // Lock or unlock carousel navigation
  function lockCarouselNavigation(lock) {
    const carouselItems = document.querySelectorAll(".carousel-item");
    carouselItems.forEach((item) => {
      if (lock) {
        item.classList.add("no-swipe"); // Add class to disable swiping
      } else {
        item.classList.remove("no-swipe"); // Remove class to enable swiping
      }
    });
  }

  // Prevent carousel swipe when zoomed
  document.querySelectorAll(".carousel").forEach((carousel) => {
    carousel.addEventListener("touchstart", (e) => {
      if (isZoomed) {
        e.stopPropagation(); // Disable swipe gestures if zoomed
      }
    });
  });

  // Allow reset with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isZoomed) {
      resetZoom();
    }
  });
});
