import { distanceKm } from "./distance.js";

const formatter = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });
const euros = { format: (value) => formatter.format(value).replace(/ /g, " ") };

const roundTo = (value, step) => Math.round(value / step) * step;

export function estimate(prices, { workId, surface, commune }) {
  const work = prices.works.find((item) => item.id === workId);
  if (!work || !surface || surface <= 0) return null;

  let km = 0;
  let travel = 0;

  if (commune) {
    km = Math.round(distanceKm(prices.origin.coordinates, commune.coordinates));
    if (km > prices.travel.maxKm) return { outOfArea: true, km, commune };
    travel = km > prices.travel.freeUpToKm
      ? roundTo((km - prices.travel.freeUpToKm) * prices.travel.pricePerKm, 10)
      : 0;
  }

  return {
    work,
    km,
    travel,
    commune,
    min: roundTo(work.min * surface + travel, 100),
    max: roundTo(work.max * surface + travel, 100),
  };
}

export function formatEstimate(result, origin) {
  if (result.outOfArea) {
    return {
      price: "Hors de notre zone",
      detail: `${result.commune.name} est à ${result.km} km d’${origin}. Appelez-nous pour en parler.`,
    };
  }

  const price = `Entre ${euros.format(result.min)} € et ${euros.format(result.max)} € TTC`;
  let travel = "Indiquez la commune pour calculer le déplacement.";

  if (result.commune) {
    const where = `${result.commune.name} est à ${result.km} km d’${origin}`;
    travel = result.travel
      ? `Déplacement : ${euros.format(result.travel)} € inclus, ${where}.`
      : `Déplacement offert : ${where}.`;
  }

  return { price, detail: `Pose et fournitures comprises. ${travel}` };
}
