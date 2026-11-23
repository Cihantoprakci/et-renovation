export function initMenu() {
  const toggle = document.querySelector(".header__toggle");
  const nav = document.querySelector(".header__nav");
  if (!toggle || !nav) return;

  const label = toggle.querySelector(".header__toggle-label");
  const desktop = window.matchMedia("(min-width: 1200px)");

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
    label.textContent = open ? "Fermer" : "Menu";
  };

  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      setOpen(false);
      toggle.focus();
    }
  });

  desktop.addEventListener("change", () => setOpen(false));
}
