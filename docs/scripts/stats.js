async function loadStats() {
  try {
    const res = await fetch("stats.json", { cache: "no-cache" });

    if (!res.ok) throw new Error("No se pudo cargar stats.json");

    const stats = await res.json();

    const container = document.getElementById("stats-container");
    container.innerHTML = "";

    // Guardamos updated_at para mostrarlo AL FINAL
    const updatedAt = stats.updated_at;
    delete stats.updated_at;

    for (const key in stats) {
      const value = stats[key];

      const card = document.createElement("div");
      card.className = "stat-card";

      // --- UPTIME ---
      if (key === "uptime") {
        card.innerHTML = `
          <div class="stat-title">${formatTitle(key)}</div>
          <div class="stat-value">${value.formatted}</div>
          <div class="stat-subvalue">${value.ms.toLocaleString()} ms</div>
        `;
      }

      // --- VALORES NORMALES ---
      else {
        card.innerHTML = `
          <div class="stat-title">${formatTitle(key)}</div>
          <div class="stat-value">${value.toLocaleString()}</div>
        `;
      }

      container.appendChild(card);
    }

    // --- AGREGAR "Última Actualización" ABAJO DEL TODO ---
    const updatedCard = document.createElement("div");
    updatedCard.className = "stat-card updated-card";
    updatedCard.innerHTML = `
      <div class="stat-title">Última Actualización</div>
      <div class="stat-value">${new Date(updatedAt).toLocaleString()}</div>
    `;
    container.appendChild(updatedCard);

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
