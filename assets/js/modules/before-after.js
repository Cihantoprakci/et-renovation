export function initBeforeAfter(root) {
  const range = root.querySelector(".before-after__range");

  const update = () => {
    root.style.setProperty("--position", `${range.value}%`);
  };

  range.addEventListener("input", update);
  update();
}
