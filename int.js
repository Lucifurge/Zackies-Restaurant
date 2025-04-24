document.addEventListener("DOMContentLoaded", () => {
  const zoomableImages = document.querySelectorAll(".zoomable");

  zoomableImages.forEach((img) => {
    let scale = 1;
    let lastX = 0,
      lastY = 0;
    let startX = 0,
      startY = 0;
    let isDragging = false;

    let initialDistance = null;
    let initialScale = 1;
    let isZoomed = false; // Tracks if the image is zoomed

    // Toggle Zoom on double-tap/click
    let lastTap = 0;
    img.addEventListener("click", (e) => {
      const currentTime = new Date().getTime();
      const tapGap = currentTime - lastTap;

      if (tapGap < 300) {
        toggleZoom();
      }
      lastTap = currentTime;
    });

    function toggleZoom() {
      if (scale !== 1) {
        scale = 1;
        lastX = 0;
        lastY = 0;
        img.style.transform = "scale(1) translate(0px, 0px)";
        img.classList.remove("zoomed");
        isZoomed = false; // Reset zoom state
      } else {
        scale = 2; // Adjust zoom level as needed
        img.style.transform = `scale(${scale}) translate(0px, 0px)`;
        img.classList.add("zoomed");
        isZoomed = true; // Set zoom state
      }
    }

    // Disable swipe transitions when zoomed
    img.closest(".carousel-item").addEventListener("touchstart", (e) => {
      if (isZoomed) {
        e.stopPropagation(); // Prevent swipe event propagation
      }
    });

    img.closest(".carousel-item").addEventListener("mousedown", (e) => {
      if (isZoomed) {
        e.stopPropagation(); // Prevent swipe event propagation
      }
    });

    // Mouse Dragging Logic
    img.addEventListener("mousedown", (e) => {
      if (scale === 1) return; // Don't allow dragging if not zoomed in
      isDragging = true;
      startX = e.clientX - lastX;
      startY = e.clientY - lastY;
      img.style.cursor = "grabbing";
    });

    img.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      e.preventDefault();
      lastX = e.clientX - startX;
      lastY = e.clientY - startY;
      updateTransform();
    });

    img.addEventListener("mouseup", () => {
      isDragging = false;
      img.style.cursor = "grab";
    });

    img.addEventListener("mouseleave", () => {
      isDragging = false;
      img.style.cursor = "grab";
    });

    // Touch Dragging Logic
    img.addEventListener(
      "touchstart",
      (e) => {
        if (scale === 1) return;
        if (e.touches.length === 1) {
          isDragging = true;
          startX = e.touches[0].clientX - lastX;
          startY = e.touches[0].clientY - lastY;
        }

        // Handle pinch zoom
        if (e.touches.length === 2) {
          initialDistance = getPinchDistance(e);
          initialScale = scale;
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
          scale = Math.min(Math.max(initialScale * (currentDistance / initialDistance), 1), 4); // Adjust max/min scale
          img.classList.add("zoomed");
          img.style.transform = `scale(${scale}) translate(${lastX / scale}px, ${lastY / scale}px)`;
          isZoomed = true;
          return;
        }

        if (isDragging && e.touches.length === 1) {
          e.preventDefault();
          const touch = e.touches[0];
          lastX = touch.clientX - startX;
          lastY = touch.clientY - startY;
          updateTransform();
        }
      },
      { passive: false }
    );

    img.addEventListener("touchend", () => {
      isDragging = false;
      if (scale === 1) {
        isZoomed = false;
      }
    });

    // Update Transform Logic
    function updateTransform() {
      const maxX = (img.offsetWidth * (scale - 1)) / 2;
      const maxY = (img.offsetHeight * (scale - 1)) / 2;

      // Clamp translation values to prevent dragging out of bounds
      lastX = Math.max(-maxX, Math.min(maxX, lastX));
      lastY = Math.max(-maxY, Math.min(maxY, lastY));

      img.style.transform = `scale(${scale}) translate(${lastX / scale}px, ${lastY / scale}px)`;
    }

    function getPinchDistance(e) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }
  });
});
