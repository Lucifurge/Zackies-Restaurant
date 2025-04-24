document.addEventListener("DOMContentLoaded", () => {
  const zoomableImages = document.querySelectorAll(".zoomable");
  let activeImage = null; // The image currently displayed in full-screen mode
  let scale = 1; // Default zoom level
  let startX = 0; // Starting X position for dragging
  let startY = 0; // Starting Y position for dragging
  let translateX = 0; // Current x translation
  let translateY = 0; // Current y translation
  let isDragging = false; // Track drag state

  // Add click event for opening full-screen mode
  zoomableImages.forEach((img) => {
    img.addEventListener("click", () => openFullScreen(img));
  });

  // Open the image in full-screen mode
  function openFullScreen(image) {
    activeImage = image.cloneNode(); // Clone the image for isolation
    activeImage.classList.add("fullscreen");
    activeImage.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
    document.body.appendChild(activeImage);

    // Add drag and zoom functionality for full-screen only
    activeImage.addEventListener("wheel", handleZoom); // Scroll or pinch for zoom
    activeImage.addEventListener("mousedown", handleDragStart);
    activeImage.addEventListener("mousemove", handleDragging);
    activeImage.addEventListener("mouseup", handleDragEnd);
    activeImage.addEventListener("touchstart", handleDragStart, { passive: false });
    activeImage.addEventListener("touchmove", handleDragging, { passive: false });
    activeImage.addEventListener("touchend", handleDragEnd);
    activeImage.addEventListener("click", closeFullScreen); // Single click to close full-screen
  }

  // Close full-screen mode
  function closeFullScreen() {
    if (activeImage) {
      activeImage.remove(); // Remove the full-screen image
      activeImage = null;
      scale = 1; // Reset zoom level
      translateX = 0;
      translateY = 0;
    }
  }

  // Handle zooming using scroll (wheel or pinch gesture)
  function handleZoom(e) {
    e.preventDefault(); // Prevent default scroll behavior
    const zoomIntensity = 0.1; // Adjust zoom sensitivity
    const direction = e.deltaY > 0 ? -1 : 1; // Determine zoom-in or zoom-out

    // Update scale based on zoom direction
    scale += direction * zoomIntensity;
    scale = Math.min(Math.max(scale, 1), 4); // Limit zoom between 1x and 4x

    updateTransform(); // Apply updated scale and translation
  }

  // Start dragging the image
  function handleDragStart(e) {
    if (scale === 1) return; // No dragging if not zoomed in
    isDragging = true;
    const touch = e.touches ? e.touches[0] : e; // Support both touch and mouse
    startX = touch.clientX - translateX;
    startY = touch.clientY - translateY;
    e.preventDefault();
  }

  // Drag the image
  function handleDragging(e) {
    if (!isDragging) return;
    const touch = e.touches ? e.touches[0] : e;
    translateX = touch.clientX - startX;
    translateY = touch.clientY - startY;
    updateTransform();
  }

  // Stop dragging
  function handleDragEnd() {
    isDragging = false;
  }

  // Update the transform property
  function updateTransform() {
    activeImage.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
  }
});
