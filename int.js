document.addEventListener("DOMContentLoaded", () => {
  const zoomableImages = document.querySelectorAll(".zoomable");
  let activeImage = null; // The image currently displayed in full-screen mode
  let scale = 1; // Default zoom level
  let startX = 0; // Initial x position for dragging
  let startY = 0; // Initial y position for dragging
  let translateX = 0; // Current x translation
  let translateY = 0; // Current y translation
  let isDragging = false;

  // Add click event for opening full-screen mode
  zoomableImages.forEach((img) => {
    img.addEventListener("click", () => openFullScreen(img));
  });

  // Open the image in full-screen mode
  function openFullScreen(image) {
    activeImage = image.cloneNode(); // Clone the image
    activeImage.classList.add("fullscreen");
    activeImage.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
    document.body.appendChild(activeImage);

    // Add event listeners for zoom and drag interactions
    activeImage.addEventListener("dblclick", toggleZoom); // Double-click for zoom
    activeImage.addEventListener("mousedown", handleDragStart);
    activeImage.addEventListener("mousemove", handleDragging);
    activeImage.addEventListener("mouseup", handleDragEnd);
    activeImage.addEventListener("touchstart", handleDragStart, { passive: false });
    activeImage.addEventListener("touchmove", handleDragging, { passive: false });
    activeImage.addEventListener("touchend", handleDragEnd);
    activeImage.addEventListener("click", closeFullScreen); // Single click to close
  }

  // Close full-screen mode
  function closeFullScreen() {
    if (activeImage) {
      activeImage.remove();
      activeImage = null;
      scale = 1; // Reset zoom level
      translateX = 0;
      translateY = 0;
    }
  }

  // Toggle zoom level on double-click
  function toggleZoom() {
    if (scale === 1) {
      scale = 2; // Zoom in
    } else {
      scale = 1; // Zoom out
      translateX = 0; // Reset translation on zoom out
      translateY = 0;
    }
    updateTransform();
  }

  // Start dragging
  function handleDragStart(e) {
    if (scale === 1) return; // Only allow dragging when zoomed in
    isDragging = true;
    const touch = e.touches ? e.touches[0] : e; // Support both mouse and touch
    startX = touch.clientX - translateX;
    startY = touch.clientY - translateY;
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling
  }

  // Drag the image
  function handleDragging(e) {
    if (!isDragging || scale === 1) return; // Only drag if zoomed in
    const touch = e.touches ? e.touches[0] : e;
    translateX = touch.clientX - startX;
    translateY = touch.clientY - startY;
    updateTransform();
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling
  }

  // Stop dragging
  function handleDragEnd() {
    isDragging = false;
  }

  // Update the transform property for the active image
  function updateTransform() {
    activeImage.style.transition = "transform 0.1s ease"; // Smooth zoom/drag effect
    activeImage.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
  }
});
