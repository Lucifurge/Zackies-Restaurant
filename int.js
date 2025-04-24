document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.querySelector("#menuUnifiedCarousel");
  const zoomableImages = document.querySelectorAll(".zoomable");
  let activeImage = null; // Tracks the currently zoomed image
  let scale = 1; // Default scale
  let lastTapTime = 0; // To handle double-tap detection

  // Initialize Bootstrap carousel instance
  const carouselInstance = new bootstrap.Carousel(carousel, {
    interval: false, // Disable auto-slide
  });

  // Double-tap zoom functionality
  zoomableImages.forEach((img) => {
    img.addEventListener("click", (e) => {
      const currentTime = Date.now();
      if (currentTime - lastTapTime < 300) {
        scale > 1 ? resetZoom() : toggleZoom(img); // Toggle zoom based on scale
      }
      lastTapTime = currentTime;
    });
  });

  // Function to zoom in
  function toggleZoom(image) {
    if (scale === 1) {
      scale = 2; // Zoom level
      activeImage = image;
      activeImage.style.transition = "transform 0.3s ease"; // Smooth transition
      activeImage.style.transform = `scale(${scale})`; // Apply zoom
      carouselInstance.pause(); // Pause carousel while zoomed
    }
  }

  // Function to reset zoom
  function resetZoom() {
    if (activeImage) {
      scale = 1;
      activeImage.style.transition = "transform 0.3s ease"; // Smooth transition
      activeImage.style.transform = `scale(1)`; // Reset zoom
      activeImage = null;
      carouselInstance.cycle(); // Resume carousel
    }
  }

  // Disable dragging while zoomed
  zoomableImages.forEach((img) => {
    img.addEventListener("mousedown", (e) => {
      if (scale > 1) e.preventDefault();
    });
    img.addEventListener("touchstart", (e) => {
      if (scale > 1) e.preventDefault(); // Prevent touch dragging
    });
  });

  // Disable swipe gestures on carousel items when zoomed
  const carouselItems = document.querySelectorAll(".carousel-item");
  carouselItems.forEach((item) => {
    item.addEventListener("touchstart", (e) => {
      if (scale > 1) e.stopPropagation(); // Disable swipe during zoom
    });
  });
});
