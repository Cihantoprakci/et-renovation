import { initMenu } from "../modules/menu.js";
import { initCommuneSearch } from "../modules/commune-search.js";
import { estimate, formatEstimate } from "../modules/estimator.js";

initMenu();

const form = document.querySelector(".estimator__form");
const workSelect = form.querySelector("#travaux");
const surfaceInput = form.querySelector("#surface");
const communeInput = form.querySelector("#commune");
const price = document.querySelector(".result__price");
const detail = document.querySelector(".result__detail");

const EMPTY = {
  price: "Répondez aux questions",
  detail: "Choisissez vos travaux et indiquez la surface pour voir le prix.",
};

let prices;
let commune = null;

const setCommuneFields = (selected) => {
  form.elements.cp.value = selected ? selected.postcode : "";
  form.elements.lon.value = selected ? selected.coordinates[0] : "";
  form.elements.lat.value = selected ? selected.coordinates[1] : "";
};

const update = () => {
  const result = estimate(prices, {
    workId: workSelect.value,
    surface: Number(surfaceInput.value),
    commune,
  });
  const text = result ? formatEstimate(result, prices.origin.name) : EMPTY;
  price.textContent = text.price;
  detail.textContent = text.detail;
};

const init = async () => {
  const response = await fetch(new URL("../data/prices.json", import.meta.url));
  prices = await response.json();

  prices.works.forEach((work) => {
    workSelect.add(new Option(work.label, work.id));
  });

  const preset = new URLSearchParams(window.location.search).get("travaux");
  if (preset) workSelect.value = preset;

  workSelect.addEventListener("change", update);
  surfaceInput.addEventListener("input", update);
  initCommuneSearch(communeInput, (selected) => {
    commune = selected;
    setCommuneFields(selected);
    update();
  });
  update();
};

init();
