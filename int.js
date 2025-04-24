// Get all zoomable images
const zoomableImages = document.querySelectorAll('.zoomable');

// Add click event listener to enable zoom
zoomableImages.forEach((image) => {
  image.addEventListener('click', () => {
    image.classList.toggle('zoomed'); // Toggle zoom class
    if (image.classList.contains('zoomed')) {
      makeDraggable(image); // Make the image draggable when zoomed
    } else {
      image.style.transform = 'scale(1)'; // Reset the image zoom
      image.style.left = '0'; // Reset the position
      image.style.top = '0'; // Reset the position
    }
  });
});

// Function to make the image draggable
function makeDraggable(image) {
  let isDragging = false;
  let startX, startY;

  // Set the image to absolute positioning for drag to work
  image.style.position = 'absolute';
  
  image.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX - image.offsetLeft;
    startY = e.clientY - image.offsetTop;
    image.style.cursor = 'grabbing'; // Change cursor when dragging
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      let x = e.clientX - startX;
      let y = e.clientY - startY;
      image.style.left = x + 'px';
      image.style.top = y + 'px';
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    image.style.cursor = 'grab'; // Change back the cursor when not dragging
  });
}

// Adjust image size when modal is shown to ensure it fits properly
$('#menuModal').on('shown.bs.modal', function () {
  // Get all zoomable images
  const zoomableImages = document.querySelectorAll('.zoomable');

  zoomableImages.forEach(image => {
    // Reset the image size and position when modal is shown
    image.style.transform = 'scale(1)';
    image.style.left = '0';
    image.style.top = '0';
  });
});
