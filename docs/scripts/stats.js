async function loadStats() {
  try {
    const res = await fetch("stats.json", { cache: "no-cache" });

    if (!res.ok) throw new Error("No se pudo cargar stats.json");

    const stats = await res.json();

    const container = document.getElementById("stats-container");
    container.innerHTML = ""; // vaciar grid

    // Guardamos updated_at
    const updatedAt = stats.updated_at;
    delete stats.updated_at;

    // Crear tarjetas directamente dentro del grid existente
    for (const key in stats) {
      const value = stats[key];

      const card = document.createElement("div");
      card.className = "stat-card";

      if (key === "uptime") {
        card.innerHTML = `
          <div class="stat-title">${formatTitle(key)}</div>
          <div class="stat-value">${value.formatted}</div>
          <div class="stat-subvalue">${value.ms.toLocaleString()} ms</div>
        `;
      } else {
        card.innerHTML = `
          <div class="stat-title">${formatTitle(key)}</div>
          <div class="stat-value">${value.toLocaleString()}</div>
        `;
      }

      container.appendChild(card);
    }

    // FOOTER ELEGANTE PARA LA FECHA
    const updatedFooter = document.createElement("div");
    updatedFooter.className = "stats-updated";
    updatedFooter.textContent = `Última actualización: ${new Date(updatedAt).toLocaleString()}`;

    // Lo colocamos después del grid
    container.insertAdjacentElement("afterend", updatedFooter);

  } catch (err) {
    console.error("Error cargando estadísticas:", err);
    document.getElementById("stats-container").innerHTML =
      "<p>No se pudieron cargar las estadísticas.</p>";
  }
}

function formatTitle(key) {
  const titles = {
    servers: "Servidores",
    users: "Usuarios",
    commands: "Comandos Disponibles",
    ping: "Ping",
    uptime: "Uptime"
  };

  return titles[key] || key.replace(/_/g, " ");
}

loadStats();
