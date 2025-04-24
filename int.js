document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.querySelector("#menuUnifiedCarousel");
  const zoomableImages = document.querySelectorAll(".zoomable");
  let activeImage = null; // Tracks the currently zoomed image
  let scale = 1; // Default scale
  let lastTapTime = 0; // To handle double-tap detection

  // Bootstrap carousel instance
  const carouselInstance = new bootstrap.Carousel(carousel, {
    interval: false, // Disable auto-slide initially
  });

  // Double-tap zoom logic
  zoomableImages.forEach((img) => {
    img.addEventListener("click", (e) => {
      const currentTime = new Date().getTime();
      if (currentTime - lastTapTime < 300) {
        if (scale > 1) {
          resetZoom(); // Zoom out on double-tap
        } else {
          toggleZoom(img); // Zoom in on double-tap
        }
      }
      lastTapTime = currentTime;
    });
  });

  // Handle zoom in
  function toggleZoom(image) {
    if (scale === 1) {
      scale = 2; // Set zoom level
      activeImage = image;
      activeImage.style.transition = "transform 0.3s ease"; // Smooth transition
      activeImage.style.transform = `scale(${scale}) translate(0px, 0px)`; // Apply zoom
      carouselInstance.pause(); // Pause carousel while zoomed
    }
  }

  // Handle zoom out
  function resetZoom() {
    scale = 1;
    if (activeImage) {
      activeImage.style.transition = "transform 0.3s ease"; // Smooth transition
      activeImage.style.transform = `scale(1) translate(0px, 0px)`; // Reset zoom
    }
    activeImage = null;
    carouselInstance.cycle(); // Resume carousel when zoomed out
  }

  // Lock dragging functionality when zoomed in
  zoomableImages.forEach((img) => {
    img.addEventListener("mousedown", (e) => {
      if (scale > 1) {
        // Prevent dragging when zoomed in
        e.preventDefault();
      }
    });
  });

  // Touch Events for Mobile Devices
  zoomableImages.forEach((img) => {
    img.addEventListener("touchstart", (e) => {
      if (scale > 1) {
        e.preventDefault(); // Disable dragging when zoomed
      }
    });
  });

  // Disable swipe gestures on the carousel when zoomed in
  const carouselItems = document.querySelectorAll(".carousel-item");
  carouselItems.forEach((item) => {
    item.addEventListener("touchstart", (e) => {
      if (scale > 1) {
        e.stopPropagation(); // Disable swipe gestures while zoomed
      }
    });
  });
});
