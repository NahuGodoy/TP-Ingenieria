document.addEventListener("DOMContentLoaded", function () {
    const map = L.map("map").setView([-38.0055, -57.5826], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);

    const centros = [
        {
            id: 1,
            nombre: "Centro 1",
            direccion: "Calle Rivadavia 3050",
            horario: "8:00 - 15:00",
            coords: [-38.0028, -57.5491],
        },
        {
            id: 2,
            nombre: "Centro 2",
            direccion: "Av. Colón 4560",
            horario: "9:00 - 17:00",
            coords: [-37.9959, -57.5635],
        },
        {
            id: 3,
            nombre: "Centro 3",
            direccion: "Av. Edison 1100",
            horario: "10:00 - 18:00",
            coords: [-38.0185, -57.5568],
        },
        {
            id: 4,
            nombre: "Centro 4",
            direccion: "Av. Constitución 5700",
            horario: "9:00 - 16:00",
            coords: [-37.9872, -57.5773],
        },
    ];

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
            </div>
            </div>
        </div>
        `).join("");


    const marcadores = {};
    centros.forEach(centro => {
        marcadores[centro.id] = L.marker(centro.coords)
            .addTo(map)
            .bindPopup(`<b>${centro.nombre}</b>`);
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