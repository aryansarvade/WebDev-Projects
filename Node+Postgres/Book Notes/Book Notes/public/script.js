document.addEventListener("DOMContentLoaded", () => {
  const boxes = document.querySelectorAll(".book-info-box");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          // Optionally unobserve after animation
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.3, // trigger when 20% of box is visible
    }
  );

  boxes.forEach((box) => observer.observe(box));
});
