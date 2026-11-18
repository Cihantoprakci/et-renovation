const MAX_FILES = 6;
const MAX_SIZE = 10 * 1024 * 1024;

const formatSize = (bytes) =>
  bytes < 1024 * 1024
    ? `${Math.round(bytes / 1024)} Ko`
    : `${(bytes / 1024 / 1024).toFixed(1).replace(".", ",")} Mo`;

export function initFileList(zone, input, list, errorBox) {
  let files = [];

  const syncInput = () => {
    const transfer = new DataTransfer();
    files.forEach((file) => transfer.items.add(file));
    input.files = transfer.files;
  };

  const render = () => {
    list.innerHTML = "";
    files.forEach((file, index) => {
      const item = document.createElement("li");
      item.innerHTML = `
        <span class="file-list__name"></span>
        <button type="button">Retirer</button>`;
      const name = item.querySelector(".file-list__name");
      name.textContent = file.name;
      const size = document.createElement("small");
      size.textContent = formatSize(file.size);
      name.append(size);
      item.querySelector("button").setAttribute("aria-label", `Retirer ${file.name}`);
      item.querySelector("button").addEventListener("click", () => {
        files.splice(index, 1);
        syncInput();
        render();
      });
      list.append(item);
    });
  };

  const add = (newFiles) => {
    errorBox.textContent = "";
    for (const file of newFiles) {
      if (files.length >= MAX_FILES) {
        errorBox.textContent = `${MAX_FILES} fichiers au maximum.`;
        break;
      }
      if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
        errorBox.textContent = `${file.name} n’est pas une image ni un PDF.`;
        continue;
      }
      if (file.size > MAX_SIZE) {
        errorBox.textContent = `${file.name} dépasse 10 Mo.`;
        continue;
      }
      files.push(file);
    }
    syncInput();
    render();
  };

  input.addEventListener("change", () => add([...input.files].filter((file) => !files.includes(file))));

  ["dragenter", "dragover"].forEach((type) =>
    zone.addEventListener(type, (event) => {
      event.preventDefault();
      zone.classList.add("is-dragover");
    })
  );

  ["dragleave", "drop"].forEach((type) =>
    zone.addEventListener(type, () => zone.classList.remove("is-dragover"))
  );

  zone.addEventListener("drop", (event) => {
    event.preventDefault();
    add([...event.dataTransfer.files]);
  });

  return () => files;
}
