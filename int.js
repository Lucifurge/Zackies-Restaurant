document.addEventListener("DOMContentLoaded", () => {
  const zoomableImages = document.querySelectorAll(".zoomable");
  let activeImage = null; // Tracks the currently active image in full-screen
  let scale = 1; // Default zoom level
  let startX = 0; // Starting X position for dragging
  let startY = 0; // Starting Y position for dragging
  let translateX = 0; // X translation value
  let translateY = 0; // Y translation value
  let isDragging = false;

  // Add event to open full-screen
  zoomableImages.forEach((img) => {
    img.addEventListener("click", () => {
      openFullScreen(img);
    });
  });

  // Open the image in full-screen mode
  function openFullScreen(image) {
    activeImage = image.cloneNode(); // Clone the image for full-screen mode
    activeImage.classList.add("fullscreen");
    activeImage.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
    document.body.appendChild(activeImage);

    // Add zoom and drag functionality in full-screen
    activeImage.addEventListener("dblclick", toggleZoom); // Double-click to zoom in/out
    activeImage.addEventListener("mousedown", handleDragStart);
    activeImage.addEventListener("mousemove", handleDragging);
    activeImage.addEventListener("mouseup", handleDragEnd);
    activeImage.addEventListener("touchstart", handleDragStart, { passive: false });
    activeImage.addEventListener("touchmove", handleDragging, { passive: false });
    activeImage.addEventListener("touchend", handleDragEnd);
    activeImage.addEventListener("click", closeFullScreen); // Single click to exit full-screen
  }

  // Close full-screen mode
  function closeFullScreen() {
    if (activeImage) {
      activeImage.remove(); // Remove the full-screen image
      activeImage = null;
      scale = 1; // Reset zoom level
      translateX = 0; // Reset translations
      translateY = 0;
    }
  }

  // Handle zoom toggling with double-click
  function toggleZoom() {
    if (scale === 1) {
      scale = 2; // Zoom in
    } else {
      scale = 1; // Zoom out
      translateX = 0; // Reset position when zooming out
      translateY = 0;
    }
    updateTransform();
  }

  // Start dragging
  function handleDragStart(e) {
    if (scale === 1) return; // Only allow dragging when zoomed in
    isDragging = true;
    const touch = e.touches ? e.touches[0] : e;
    startX = touch.clientX - translateX;
    startY = touch.clientY - translateY;
    e.preventDefault(); // Prevent unintended gestures
  }

  // Drag the image
  function handleDragging(e) {
    if (!isDragging || scale === 1) return; // Only drag if zoomed in
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

  // Update the transform property
  function updateTransform() {
    activeImage.style.transition = "transform 0.1s ease"; // Smooth transition
    activeImage.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
  }
});
