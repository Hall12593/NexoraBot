const OWNER = "hall12593";
const REPO = "NexoraBot";

// Rutas base
const INDEX_URL = `https://${OWNER}.github.io/${REPO}/news/index.json`;
const BASE_URL = `https://${OWNER}.github.io/${REPO}/`;

async function loadIndex() {
  const select = document.getElementById("news-select");

  try {
    const res = await fetch(INDEX_URL);
    const indexList = await res.json();

    select.innerHTML = `<option value="">Selecciona una noticia...</option>`;

    indexList.forEach((entry) => {
      const op = document.createElement("option");
      op.value = entry.ruta;
      op.textContent = `${entry.titulo} (${entry.fecha})`;
      select.appendChild(op);
    });

    // Auto-cargar la más reciente
    if (indexList.length > 0) {
      loadNews(indexList[0].ruta);
      select.value = indexList[0].ruta;
    }
  } catch (err) {
    document.getElementById(
      "news-view"
    ).innerHTML = `<p style="color:red">❌ Error cargando index.json.</p>`;
    console.error(err);
  }
}

async function loadNews(path) {
  try {
    const res = await fetch(BASE_URL + path);
    const data = await res.json();

    let html = `
              <h2>${data.titulo}</h2>
              <p class="lead">${data.fecha} — ${data.hora ?? "??:??"}</p>
              <p style="white-space: pre-line; margin-top: 15px;">
                  ${data.contenido}
              </p>
          `;

    if (data.imagen_base64) {
      html += `
                  <img src="data:image/png;base64,${data.imagen_base64}"
                       style="max-width:100%; border-radius:10px;margin-top:15px;">
              `;
    }

    document.getElementById("news-view").innerHTML = html;
  } catch (err) {
    document.getElementById(
      "news-view"
    ).innerHTML = `<p style="color:red">❌ Error cargando noticia.</p>`;
    console.error(err);
  }
}

document.getElementById("news-select").addEventListener("change", (e) => {
  if (e.target.value !== "") {
    loadNews(e.target.value);
  }
});

loadIndex();



function parseDiscordFormatting(text) {
    if (!text) return "";

    // Escapar HTML
    text = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Blockquotes >
    text = text.replace(/^> (.*)$/gm, `<div class="news-blockquote">$1</div>`);

    // Codeblock triple ```
    text = text.replace(/```([^`]+)```/gs, `<div class="codeblock">$1</div>`);

    // Inline code `
    text = text.replace(/`([^`]+)`/g, `<code>$1</code>`);

    // Bold **
    text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Italic *
    text = text.replace(/\*(.*?)\*/g, "<em>$1</em>");

    // Spoilers ||
    text = text.replace(/\|\|(.*?)\|\|/g, `<span class="spoiler">$1</span>`);

    // Lists (- or •)
    text = text.replace(/^(?:-|\•) (.*)$/gm, `<li>$1</li>`);
    text = text.replace(/(<li>[\s\S]*?<\/li>)/g, `<ul class="news-list">$1</ul>`);

    // Saltos de línea
    text = text.replace(/\n/g, "<br>");

    return text;
}

// Spoiler toggle
document.addEventListener("click", e => {
    if (e.target.classList.contains("spoiler")) {
        e.target.classList.toggle("revealed");
    }
});