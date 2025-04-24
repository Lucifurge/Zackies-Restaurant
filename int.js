document.addEventListener("DOMContentLoaded", () => {
  const zoomableImages = document.querySelectorAll(".zoomable");
  let activeImage = null; // Tracks the currently active image
  let scale = 1; // Default zoom level
  let translateX = 0; // X translation value
  let translateY = 0; // Y translation value

  // Add click event to open full-screen
  zoomableImages.forEach((img) => {
    img.addEventListener("dblclick", () => { // Double-click to open full-screen
      if (!activeImage) {
        openFullScreen(img);
      } else {
        toggleZoom();
      }
    });
  });

  // Open the image in full-screen
  function openFullScreen(image) {
    activeImage = image.cloneNode(); // Clone the image for full-screen mode
    activeImage.classList.add("fullscreen");
    document.body.appendChild(activeImage);

    // Disable dragging entirely
    activeImage.style.touchAction = "none"; // Prevent unintended gestures
    activeImage.addEventListener("dblclick", toggleZoom); // Use double-click for zoom
    activeImage.addEventListener("click", closeFullScreen); // Single click to close full-screen
  }

  // Handle zoom toggling
  function toggleZoom() {
    if (scale === 1) {
      scale = 2; // Zoom in
    } else {
      scale = 1; // Zoom out
    }
    activeImage.style.transform = `scale(${scale})`; // Apply zoom scale
  }

  // Close full-screen mode
  function closeFullScreen() {
    if (activeImage) {
      activeImage.remove();
      activeImage = null;
      scale = 1; // Reset zoom scale
    }
  }
});
