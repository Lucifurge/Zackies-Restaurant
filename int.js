// Draggable image
let image = document.querySelector('.menu-image');

image.addEventListener('mousedown', function(e) {
  let shiftX = e.clientX - image.getBoundingClientRect().left;
  let shiftY = e.clientY - image.getBoundingClientRect().top;

  image.style.position = 'absolute';
  image.style.zIndex = 1000;

  function moveAt(pageX, pageY) {
    image.style.left = pageX - shiftX + 'px';
    image.style.top = pageY - shiftY + 'px';
  }

  // Move the image on mouse move
  document.addEventListener('mousemove', onMouseMove);

  // Drop the image on mouse up
  image.onmouseup = function() {
    document.removeEventListener('mousemove', onMouseMove);
    image.onmouseup = null;
  };

  function onMouseMove(e) {
    moveAt(e.pageX, e.pageY);
  }

  // Prevent image from being dragged out of the modal bounds
  image.ondragstart = function() {
    return false;
  };
});

// Zoom effect (toggle zoom)
image.addEventListener('click', function() {
  image.classList.toggle('zoomed');
});
