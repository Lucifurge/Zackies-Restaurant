document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.querySelector("#menuUnifiedCarousel");
  const zoomableImages = document.querySelectorAll(".zoomable");
  let activeImage = null; // Tracks the currently zoomed image
  let scale = 1; // Default scale

  // Bootstrap carousel instance
  const carouselInstance = new bootstrap.Carousel(carousel, {
    interval: false, // Disable auto-slide initially
  });

  // Double-tap or pinch-to-zoom logic (as before)
  let lastTapTime = 0;
  zoomableImages.forEach((img) => {
    img.addEventListener("click", (e) => {
      const currentTime = new Date().getTime();
      if (currentTime - lastTapTime < 300) {
        toggleZoom(img); // Double-tap detected
      }
      lastTapTime = currentTime;
    });
  });

  function toggleZoom(image) {
    if (scale > 1) {
      resetZoom();
      carouselInstance.cycle(); // Resume carousel auto-slide if it was paused
    } else {
      scale = 2; // Set zoom level
      activeImage = image;
      activeImage.style.transform = `scale(${scale}) translate(0px, 0px)`;
      carouselInstance.pause(); // Pause carousel while zoomed
    }
  }

  function resetZoom() {
    scale = 1;
    if (activeImage) {
      activeImage.style.transform = `scale(1) translate(0px, 0px)`;
    }
    activeImage = null;
  }

  // Dragging, pinch-zooming logic, and touch move behaviors remain the same
});
