import { initMenu } from "../modules/menu.js";
import { initCarousel } from "../modules/carousel.js";

initMenu();
document.querySelectorAll(".carousel").forEach(initCarousel);
