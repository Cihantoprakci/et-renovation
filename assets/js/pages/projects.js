import { initMenu } from "../modules/menu.js";
import { initBeforeAfter } from "../modules/before-after.js";

initMenu();
document.querySelectorAll(".before-after").forEach(initBeforeAfter);
