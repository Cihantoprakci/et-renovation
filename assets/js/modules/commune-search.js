const API_URL = "https://geo.api.gouv.fr/communes";

export function initCommuneSearch(input, onSelect) {
  const list = document.getElementById(input.getAttribute("aria-controls"));
  let results = [];
  let active = -1;
  let timer;

  const close = () => {
    list.innerHTML = "";
    input.setAttribute("aria-expanded", "false");
    input.removeAttribute("aria-activedescendant");
    active = -1;
  };

  const select = (index) => {
    const commune = results[index];
    if (!commune) return;
    input.value = `${commune.nom} (${commune.codesPostaux[0]})`;
    close();
    onSelect({
      name: commune.nom,
      postcode: commune.codesPostaux[0],
      coordinates: commune.centre.coordinates,
    });
  };

  const highlight = (index) => {
    const items = list.querySelectorAll("li");
    items.forEach((item, i) => item.setAttribute("aria-selected", String(i === index)));
    active = index;
    if (items[index]) input.setAttribute("aria-activedescendant", items[index].id);
  };

  const render = () => {
    list.innerHTML = "";
    results.forEach((commune, index) => {
      const item = document.createElement("li");
      item.id = `commune-${index}`;
      item.setAttribute("role", "option");
      item.setAttribute("aria-selected", "false");
      item.textContent = `${commune.nom} (${commune.codesPostaux[0]})`;
      item.addEventListener("mousedown", (event) => {
        event.preventDefault();
        select(index);
      });
      list.append(item);
    });
    input.setAttribute("aria-expanded", String(results.length > 0));
  };

  const search = async (query) => {
    const params = new URLSearchParams({
      nom: query,
      fields: "nom,codesPostaux,centre",
      boost: "population",
      limit: "6",
    });

    try {
      const response = await fetch(`${API_URL}?${params}`);
      if (!response.ok) return;
      results = (await response.json()).filter((commune) => commune.codesPostaux.length);
      render();
    } catch {
      close();
    }
  };

  input.addEventListener("input", () => {
    clearTimeout(timer);
    onSelect(null);
    const query = input.value.trim();
    if (query.length < 2) {
      close();
      return;
    }
    timer = setTimeout(() => search(query), 250);
  });

  input.addEventListener("keydown", (event) => {
    if (!results.length || input.getAttribute("aria-expanded") !== "true") return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      highlight(Math.min(active + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      highlight(Math.max(active - 1, 0));
    } else if (event.key === "Enter" && active >= 0) {
      event.preventDefault();
      select(active);
    } else if (event.key === "Escape") {
      close();
    }
  });

  input.addEventListener("blur", close);
}
