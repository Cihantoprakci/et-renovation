import { initMenu } from "../modules/menu.js";
import { initCommuneSearch } from "../modules/commune-search.js";
import { estimate, formatEstimate } from "../modules/estimator.js";
import { initFileList } from "../modules/file-list.js";
import { initQuoteForm } from "../modules/quote-form.js";

initMenu();

const form = document.querySelector(".quote__form");
const workSelect = form.querySelector("#travaux");
const surfaceInput = form.querySelector("#surface");
const communeInput = form.querySelector("#commune");
const estimateBox = form.querySelector(".estimate");
const estimatePrice = estimateBox.querySelector(".estimate__price");
const estimateDetail = estimateBox.querySelector(".estimate__detail");
const estimateField = form.querySelector("#estimation");

let prices;
let commune = null;

const updateEstimate = () => {
  const result = estimate(prices, {
    workId: workSelect.value,
    surface: Number(surfaceInput.value),
    commune,
  });

  if (!result) {
    estimateBox.hidden = true;
    estimateField.value = "";
    return;
  }

  const text = formatEstimate(result, prices.origin.name);
  estimatePrice.textContent = text.price;
  estimateDetail.textContent = text.detail;
  estimateField.value = `${text.price}. ${text.detail}`;
  estimateBox.hidden = false;
};

const loadPrices = async () => {
  const response = await fetch(new URL("../data/prices.json", import.meta.url));
  prices = await response.json();

  prices.works.forEach((work) => {
    workSelect.add(new Option(work.label, work.id));
  });

  const preset = new URLSearchParams(window.location.search).get("travaux");
  if (preset) workSelect.value = preset;

  workSelect.addEventListener("change", updateEstimate);
  surfaceInput.addEventListener("input", updateEstimate);
  initCommuneSearch(communeInput, (selected) => {
    commune = selected;
    updateEstimate();
  });
};

const getFiles = initFileList(
  form.querySelector(".upload"),
  form.querySelector("#fichiers"),
  form.querySelector(".file-list"),
  form.querySelector("#fichiers-error")
);

initQuoteForm(form, { getFiles });
loadPrices();
