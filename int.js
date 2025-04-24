document.addEventListener("DOMContentLoaded", () => {
  const zoomableImages = document.querySelectorAll(".zoomable");
  let activeImage = null; // Tracks the currently active image
  let scale = 1; // Zoom level
  let startX = 0; // Starting X position for dragging
  let startY = 0; // Starting Y position for dragging
  let translateX = 0; // X translation value
  let translateY = 0; // Y translation value
  let isDragging = false;

  // Add click event to each zoomable image
  zoomableImages.forEach((img) => {
    img.addEventListener("click", () => {
      openFullScreen(img);
    });
  });

  // Open the image in full screen
  function openFullScreen(image) {
    activeImage = image.cloneNode(); // Clone the image to prevent issues
    activeImage.classList.add("fullscreen");
    activeImage.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
    document.body.appendChild(activeImage);

    // Add event listeners for gestures
    activeImage.addEventListener("dblclick", handleDoubleClick);
    activeImage.addEventListener("mousedown", handleDragStart);
    activeImage.addEventListener("mousemove", handleDragging);
    activeImage.addEventListener("mouseup", handleDragEnd);
    activeImage.addEventListener("touchstart", handleDragStart, { passive: false });
    activeImage.addEventListener("touchmove", handleDragging, { passive: false });
    activeImage.addEventListener("touchend", handleDragEnd);
  }

  // Close full screen
  function closeFullScreen() {
    if (activeImage) {
      activeImage.remove();
      activeImage = null;
      scale = 1;
      translateX = 0;
      translateY = 0;
    }
  }

  // Handle double click for zoom-in/out
  function handleDoubleClick() {
    if (scale > 1) {
      resetZoom();
    } else {
      scale = 2;
      updateTransform();
    }
  }

  // Start dragging
  function handleDragStart(e) {
    isDragging = true;
    const touch = e.touches ? e.touches[0] : e;
    startX = touch.clientX - translateX;
    startY = touch.clientY - translateY;
    e.preventDefault(); // Prevent unintended gestures
  }

  // Drag the image
  function handleDragging(e) {
    if (!isDragging || scale === 1) return;
    const touch = e.touches ? e.touches[0] : e;
    translateX = touch.clientX - startX;
    translateY = touch.clientY - startY;
    updateTransform();
    e.preventDefault(); // Prevent unintended gestures
  }

  // End dragging
  function handleDragEnd() {
    isDragging = false;
  }

  // Reset zoom
  function resetZoom() {
    scale = 1;
    translateX = 0;
    translateY = 0;
    updateTransform();
  }

  // Update the transform property
  function updateTransform() {
    activeImage.style.transition = "transform 0.3s ease";
    activeImage.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
  }

  // Close full-screen on background click
  document.body.addEventListener("click", (e) => {
    if (e.target.classList.contains("fullscreen")) {
      closeFullScreen();
    }
  });
});
