export function initCarousel(root) {
  const track = root.querySelector(".carousel__track");
  const slides = [...root.querySelectorAll(".carousel__slide")];
  const prev = root.querySelector(".carousel__button--prev");
  const next = root.querySelector(".carousel__button--next");
  const count = root.querySelector(".carousel__count");
  let current = 0;

  const update = () => {
    count.textContent = `${current + 1} / ${slides.length}`;
    prev.disabled = current === 0;
    next.disabled = current === slides.length - 1;
  };

  const goTo = (index) => {
    track.scrollTo({ left: index * track.clientWidth, behavior: "smooth" });
  };

  prev.addEventListener("click", () => goTo(Math.max(current - 1, 0)));
  next.addEventListener("click", () => goTo(Math.min(current + 1, slides.length - 1)));

  track.addEventListener("scroll", () => {
    const index = Math.round(track.scrollLeft / track.clientWidth);
    if (index !== current) {
      current = index;
      update();
    }
  }, { passive: true });

  update();
}
