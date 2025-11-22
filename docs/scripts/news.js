(function () {
  const _0x1 = {
    o: "hall12593",
    r: "NexoraBot",
    p: function (u) { return `https://${this.o}.github.io/${this.r}/${u}`; },
    q: function (u) { return `https://${this.o}.github.io/${this.r}/news/${u}`; }
  };

  function _0xA(t) {
    if (!t) return "";
    t = t.replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;");

    t = t.replace(/```([\s\S]*?)```/g, (_, c) => `<div class="codeblock">${c}</div>`);
    t = t.replace(/`([^`]+)`/g, "<code>$1</code>");
    t = t.replace(/^> (.*)$/gm, `<div class="blockquote">$1</div>`);
    t = t.replace(/\|\|(.*?)\|\|/g, `<span class="spoiler">$1</span>`);
    t = t.replace(/__\*\*(.*?)\*\*__/g, '<span class="underline bold">$1</span>');
    t = t.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    t = t.replace(/__(.*?)__/g, '<span class="underline">$1</span>');
    t = t.replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>");
    t = t.replace(/(^|[^*])\*(?!\*)(.*?)\*(?!\*)/g, "$1<em>$2</em>");
    t = t.replace(/(^|[^_])_(?!_)(.*?)_(?!_)/g, "$1<em>$2</em>");
    t = t.replace(/~~(.*?)~~/g, "<del>$1</del>");
    t = t.replace(/^(?:-|\•) (.*)$/gm, `<li>$1</li>`);
    t = t.replace(/(<li>[\s\S]*?<\/li>)/g, `<ul class="news-list">$1</ul>`);
    t = t.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, `<a href="$2" target="_blank" rel="noopener">$1</a>`);
    t = t.replace(/\n/g, "<br>");
    return t;
  }

  document.addEventListener("click", e => {
    if (e.target.classList.contains("spoiler"))
      e.target.classList.toggle("revealed");
  });

  async function _0xB() {
    const s = document.getElementById("news-select");
    try {
      const r = await fetch(_0x1.q("index.json"));
      const j = await r.json();
      s.innerHTML = `<option value="">Selecciona una noticia...</option>`;
      j.forEach(x => {
        const o = document.createElement("option");
        o.value = x.ruta;
        o.textContent = `${x.titulo} (${x.fecha})`;
        s.appendChild(o);
      });
      if (j.length) {
        _0xC(j[0].ruta);
        s.value = j[0].ruta;
      }
    } catch (z) {
      document.getElementById("news-view").innerHTML =
        `<p style="color:red">❌ Error cargando index.json.</p>`;
      console.error(z);
    }
  }

  async function _0xC(p) {
    try {
      const r = await fetch(_0x1.p(p));
      const d = await r.json();

      let h = `
        <h2>${d.titulo}</h2>
        <p class="lead">${d.fecha} — ${d.hora ?? "??:??"}</p>
        <div style="margin-top:15px;">
          ${_0xA(d.contenido)}
        </div>
      `;

      if (d.imagen_base64) {
        h += `
          <img src="data:image/png;base64,${d.imagen_base64}"
               style="max-width:100%;border-radius:10px;margin-top:15px;">
        `;
      }

      document.getElementById("news-view").innerHTML = h;

    } catch (e) {
      document.getElementById("news-view").innerHTML =
        `<p style="color:red">❌ Error cargando noticia.</p>`;
      console.error(e);
    }
  }

  document.getElementById("news-select").addEventListener("change", e => {
    if (e.target.value) _0xC(e.target.value);
  });

  _0xB();
})();