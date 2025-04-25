// JavaScript to detect when the section comes into view
document.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll('.animated-section');

  const observerOptions = {
    root: null,
    threshold: 0.5,  // Trigger when 50% of the section is in view
  };

  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add the class "visible" when the section comes into view
        entry.target.classList.add('visible');
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  sections.forEach(section => {
    observer.observe(section);
  });
});
