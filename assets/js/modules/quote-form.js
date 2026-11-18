const MESSAGES = {
  valueMissing: "Ce champ est obligatoire.",
  typeMismatch: "Le format n’est pas valide.",
  patternMismatch: "Le format n’est pas valide.",
  rangeUnderflow: "La valeur est trop petite.",
};

const errorMessage = (field) => {
  for (const key of Object.keys(MESSAGES)) {
    if (field.validity[key]) return MESSAGES[key];
  }
  return field.validationMessage;
};

async function uploadPhotos(files, { cloudName, uploadPreset }) {
  if (!files.length || !cloudName || !uploadPreset) return [];

  const uploads = files.map(async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", uploadPreset);
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
      method: "POST",
      body: data,
    });
    if (!response.ok) throw new Error("upload");
    return (await response.json()).secure_url;
  });

  return Promise.all(uploads);
}

export function initQuoteForm(form, { getFiles }) {
  const steps = [...form.querySelectorAll(".quote__step")];
  const progressSteps = [...document.querySelectorAll(".progress__step")];
  const counter = document.querySelector(".progress__count");
  const progress = document.querySelector(".progress");
  const status = form.querySelector(".quote__status");
  const confirmation = document.querySelector(".confirmation");
  let current = 0;

  const showError = (field) => {
    const box = document.getElementById(`${field.id}-error`);
    const valid = field.checkValidity();
    field.setAttribute("aria-invalid", String(!valid));
    if (box) box.textContent = valid ? "" : errorMessage(field);
    return valid;
  };

  const validateStep = (index) => {
    const fields = [...steps[index].querySelectorAll("input, select, textarea")].filter(
      (field) => field.willValidate && field.type !== "radio"
    );
    const radios = [...steps[index].querySelectorAll("input[type='radio'][required]")];
    const groups = [...new Set(radios.map((radio) => radio.name))];

    let firstInvalid = null;

    fields.forEach((field) => {
      if (!showError(field) && !firstInvalid) firstInvalid = field;
    });

    groups.forEach((name) => {
      const group = form.querySelectorAll(`input[name="${name}"]`);
      const box = document.getElementById(`${name}-error`);
      const checked = [...group].some((radio) => radio.checked);
      if (box) box.textContent = checked ? "" : "Choisissez une option.";
      if (!checked && !firstInvalid) firstInvalid = group[0];
    });

    if (firstInvalid) firstInvalid.focus();
    return !firstInvalid;
  };

  const showStep = (index) => {
    steps.forEach((step, i) => {
      step.hidden = i !== index;
    });
    progressSteps.forEach((item, i) => {
      item.classList.toggle("is-done", i < index);
      if (i === index) item.setAttribute("aria-current", "step");
      else item.removeAttribute("aria-current");
    });
    counter.textContent = `Étape ${index + 1} sur ${steps.length}`;
    current = index;
    progress.scrollIntoView({ behavior: "smooth", block: "start" });
    steps[index].querySelector("legend").focus();
  };

  form.querySelectorAll("[data-next]").forEach((button) =>
    button.addEventListener("click", () => {
      if (validateStep(current)) showStep(current + 1);
    })
  );

  form.querySelectorAll("[data-prev]").forEach((button) =>
    button.addEventListener("click", () => showStep(current - 1))
  );

  form.querySelectorAll("input, select, textarea").forEach((field) =>
    field.addEventListener("blur", () => {
      if (field.getAttribute("aria-invalid") === "true") showError(field);
    })
  );

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!validateStep(current)) return;

    const submit = form.querySelector("[type='submit']");
    submit.disabled = true;
    submit.textContent = "Envoi en cours…";
    status.textContent = "";

    try {
      const photos = await uploadPhotos(getFiles(), form.dataset);
      const data = new FormData(form);
      data.delete("fichiers");
      data.set("photos", photos.length ? photos.join("\n") : "Aucune photo");

      const response = await fetch(form.action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error("send");

      document.querySelectorAll("[data-confirm]").forEach((node) => {
        node.textContent = data.get(node.dataset.confirm);
      });
      form.hidden = true;
      progress.hidden = true;
      confirmation.hidden = false;
      confirmation.querySelector("h2").focus();
    } catch {
      status.textContent = "L’envoi n’a pas fonctionné. Réessayez ou appelez-nous au 04 65 71 20 30.";
      submit.disabled = false;
      submit.textContent = "Envoyer ma demande";
    }
  });

  steps.slice(1).forEach((step) => {
    step.hidden = true;
  });

  document.querySelectorAll("[data-js-only]").forEach((element) => {
    element.hidden = false;
  });
}
