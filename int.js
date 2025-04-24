document.addEventListener("DOMContentLoaded", () => {
  const zoomableImages = document.querySelectorAll(".zoomable");

  zoomableImages.forEach((img) => {
    let scale = 1;
    let lastX = 0,
      lastY = 0;
    let startX = 0,
      startY = 0;
    let isDragging = false;

    // Double Tap/Click to Zoom In and Out
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
        img.style.transform = "scale(1) translate(0, 0)";
      } else {
        scale = 2; // Adjust zoom level as needed
        img.style.transform = `scale(${scale}) translate(0, 0)`;
      }
    }

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
      },
      { passive: false }
    );

    img.addEventListener(
      "touchmove",
      (e) => {
        if (!isDragging || e.touches.length !== 1) return;
        e.preventDefault();
        lastX = e.touches[0].clientX - startX;
        lastY = e.touches[0].clientY - startY;
        updateTransform();
      },
      { passive: false }
    );

    img.addEventListener("touchend", () => {
      isDragging = false;
    });

    // Update Transform Logic
    function updateTransform() {
      const maxX = (img.offsetWidth * (scale - 1)) / 2;
      const maxY = (img.offsetHeight * (scale - 1)) / 2;

      // Clamp the translation values to prevent dragging out of bounds
      lastX = Math.max(-maxX, Math.min(maxX, lastX));
      lastY = Math.max(-maxY, Math.min(maxY, lastY));

      img.style.transform = `scale(${scale}) translate(${lastX / scale}px, ${lastY / scale}px)`;
    }
  });
});
