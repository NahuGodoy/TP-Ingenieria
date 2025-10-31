import { centros } from "./centros.js";

document.addEventListener("DOMContentLoaded", function () {
    const map = L.map("map").setView([-38.0055, -57.5826], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19, minZoom: 12,
    }).addTo(map);

    const accordionContainer = document.getElementById("accordionCentros");

    accordionContainer.innerHTML = centros.map((centro, i) => `
        <div class="accordion-item">
            <h2 class="accordion-header" id="heading${centro.id}">
            <button class="accordion-button ${i !== 0 ? 'collapsed' : ''}" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#collapse${centro.id}" 
                    aria-expanded="${i === 0}" 
                    aria-controls="collapse${centro.id}"
                    data-id="${centro.id}">
                ${centro.nombre}
            </button>
            </h2>
            <div id="collapse${centro.id}" 
                class="accordion-collapse collapse ${i === 0 ? 'show' : ''}" 
                aria-labelledby="heading${centro.id}" 
                data-bs-parent="#accordionCentros">
            <div class="accordion-body">
                <p><strong>Dirección:</strong> ${centro.direccion}</p>
                <p><strong>Horario:</strong> ${centro.horario}</p>
                <p><strong>Tipo:</strong> ${centro.tipo}</p>
            </div>
            </div>
        </div>
        `).join("");


    var iconoFijo = L.icon({
        iconUrl: './recursos/fijo.png',
        iconSize: [50, 50],
        iconAnchor: [22, 94],
        popupAnchor: [-3, -76]
    });

    var iconoMovil = L.icon({
        iconUrl: './recursos/movil.png',
        iconSize: [50, 50],
        iconAnchor: [22, 94],
        popupAnchor: [-3, -76]
    });

    const marcadores = {};
    centros.forEach(centro => {
        var iconoCentro;

        if (centro.tipo == "Fijo") {
            iconoCentro = iconoFijo;
        } else {
            iconoCentro = iconoMovil;
        }

        const marcador = L.marker(centro.coords, { icon: iconoCentro })
            .addTo(map)
            .bindPopup(`<b>${centro.nombre}</b>`);

        marcadores[centro.id] = marcador;

        marcador.on('click', () => {
            const collapseEl = document.getElementById(`collapse${centro.id}`);
            const bsCollapse = new bootstrap.Collapse(collapseEl, { toggle: true });

            document.querySelectorAll('.accordion-collapse.show').forEach(openEl => {
                if (openEl.id !== `collapse${centro.id}`) {
                    new bootstrap.Collapse(openEl, { toggle: false });
                }
            });
        });
    });

    document.querySelectorAll(".accordion-button").forEach(button => {
        button.addEventListener("click", (e) => {
            const idCentro = parseInt(e.target.dataset.id);
            const centro = centros.find(c => c.id === idCentro);

            if (centro) {
                map.flyTo([centro.coords[0], centro.coords[1]], 15, { animate: true, duration: 1.2 });
                setTimeout(() => marcadores[idCentro].openPopup(), 800);
            }
        });
    });
});