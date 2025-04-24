document.addEventListener("DOMContentLoaded", () => {
  const zoomableImages = document.querySelectorAll(".zoomable");

  zoomableImages.forEach((img) => {
    let scale = 1;
    let lastX = 0,
      lastY = 0;
    let startX = 0,
      startY = 0;
    let isDragging = false;
    let isZoomed = false;
    let initialDistance = null;
    let initialScale = 1;

    // Double Tap/Click for Zoom
    let lastTap = 0;
    img.addEventListener("click", (e) => {
      const currentTime = new Date().getTime();
      if (currentTime - lastTap < 300) {
        toggleZoom();
      }
      lastTap = currentTime;
    });

    function toggleZoom() {
      if (scale !== 1) {
        resetZoom();
      } else {
        scale = 2; // Adjust this as needed
        img.style.transform = `scale(${scale}) translate(0px, 0px)`;
        isZoomed = true;
      }
    }

    function resetZoom() {
      scale = 1;
      lastX = 0;
      lastY = 0;
      img.style.transform = "scale(1) translate(0, 0)";
      isZoomed = false;
    }

    // Dragging Logic
    img.addEventListener("mousedown", (e) => {
      if (scale === 1) return;
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
      applyTransform();
    });

    img.addEventListener("mouseup", () => {
      isDragging = false;
      img.style.cursor = "grab";
    });

    img.addEventListener("mouseleave", () => {
      isDragging = false;
      img.style.cursor = "grab";
    });

    // Touch Dragging & Pinch Zoom
    img.addEventListener(
      "touchstart",
      (e) => {
        if (e.touches.length === 1 && scale > 1) {
          isDragging = true;
          startX = e.touches[0].clientX - lastX;
          startY = e.touches[0].clientY - lastY;
        }

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
          scale = Math.min(Math.max(initialScale * (currentDistance / initialDistance), 1), 4);
          applyTransform();
          isZoomed = true;
          return;
        }

        if (isDragging && e.touches.length === 1) {
          e.preventDefault();
          lastX = e.touches[0].clientX - startX;
          lastY = e.touches[0].clientY - startY;
          applyTransform();
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

    // Clamp Position and Apply Transform
    function applyTransform() {
      const maxX = (img.offsetWidth * (scale - 1)) / 2;
      const maxY = (img.offsetHeight * (scale - 1)) / 2;

      // Clamp values to prevent dragging out of bounds
      lastX = Math.max(-maxX, Math.min(maxX, lastX));
      lastY = Math.max(-maxY, Math.min(maxY, lastY));

      img.style.transform = `scale(${scale}) translate(${lastX / scale}px, ${lastY / scale}px)`;
    }

    function getPinchDistance(e) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }

    // Reset Zoom on Escape Key or Double-Tap
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isZoomed) {
        resetZoom();
      }
    });
  });
});
