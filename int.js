document.addEventListener("DOMContentLoaded", () => {
  const zoomableImages = document.querySelectorAll(".zoomable");
  let activeImage = null; // Tracks the currently active image in full-screen
  let scale = 1; // Current zoom level
  let startX = 0, startY = 0; // Initial drag positions
  let translateX = 0, translateY = 0; // Current translations
  let isDragging = false; // Tracks drag state
  let initialDistance = 0; // Used for pinch zoom

  // Open image in full-screen mode
  zoomableImages.forEach((img) => {
    img.addEventListener("click", () => openFullScreen(img));
  });

  // Full-screen activation
  function openFullScreen(image) {
    activeImage = image.cloneNode(); // Clone the image for full-screen mode
    activeImage.classList.add("fullscreen");
    activeImage.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
    document.body.appendChild(activeImage);

    // Add zoom and drag functionality
    activeImage.addEventListener("touchstart", handleTouchStart, { passive: false });
    activeImage.addEventListener("touchmove", handleTouchMove, { passive: false });
    activeImage.addEventListener("touchend", handleTouchEnd);
    activeImage.addEventListener("mousedown", handleDragStart);
    activeImage.addEventListener("mousemove", handleDragging);
    activeImage.addEventListener("mouseup", handleDragEnd);
    activeImage.addEventListener("click", closeFullScreen); // Single click to exit
  }

  // Close full-screen mode
  function closeFullScreen() {
    if (activeImage) {
      activeImage.remove(); // Remove the full-screen element
      activeImage = null;
      scale = 1; // Reset zoom level
      translateX = 0;
      translateY = 0;
    }
  }

  // Handle pinch-to-zoom start
  function handleTouchStart(e) {
    if (e.touches.length === 2) {
      // Pinch gesture: Track initial distance between fingers
      initialDistance = getDistance(e.touches[0], e.touches[1]);
    } else if (e.touches.length === 1 && scale > 1) {
      // Drag gesture: Track starting touch coordinates
      startX = e.touches[0].clientX - translateX;
      startY = e.touches[0].clientY - translateY;
      isDragging = true;
    }
  }

  // Handle pinch-to-zoom move
  function handleTouchMove(e) {
    e.preventDefault(); // Prevent default touch behavior
    if (e.touches.length === 2) {
      // Pinch gesture: Calculate zoom scale
      const currentDistance = getDistance(e.touches[0], e.touches[1]);
      const zoomIntensity = 0.01; // Zoom sensitivity
      scale += (currentDistance - initialDistance) * zoomIntensity;
      scale = Math.min(Math.max(scale, 1), 4); // Limit zoom between 1x and 4x
      initialDistance = currentDistance; // Update initial distance for continuous zoom
      updateTransform();
    } else if (isDragging) {
      // Drag gesture: Update translations based on touch movement
      translateX = e.touches[0].clientX - startX;
      translateY = e.touches[0].clientY - startY;
      updateTransform();
    }
  }

  // Handle pinch-to-zoom and drag end
  function handleTouchEnd() {
    isDragging = false; // Reset drag state
  }

  // Start dragging with mouse
  function handleDragStart(e) {
    if (scale === 1) return; // Only allow dragging when zoomed in
    isDragging = true;
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
  }

  // Drag image with mouse
  function handleDragging(e) {
    if (!isDragging) return;
    translateX = e.clientX - startX;
    translateY = e.clientY - startY;
    updateTransform();
  }

  // End dragging with mouse
  function handleDragEnd() {
    isDragging = false;
  }

  // Calculate distance between two touch points
  function getDistance(touch1, touch2) {
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // Apply transform changes (scale and position)
  function updateTransform() {
    activeImage.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
  }
});
