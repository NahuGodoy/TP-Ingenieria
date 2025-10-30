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
            tipo: "Fijo",
            coords: [-38.0028, -57.5491],
        },
        {
            id: 2,
            nombre: "Centro 2",
            direccion: "Av. Colón 4560",
            horario: "9:00 - 17:00",
            tipo: "Fijo",
            coords: [-37.9959, -57.5635],
        },
        {
            id: 3,
            nombre: "Centro 3",
            direccion: "Av. Edison 1100",
            horario: "10:00 - 18:00",
            tipo: "Movil",
            coords: [-38.0185, -57.5568],
        },
        {
            id: 4,
            nombre: "Centro 4",
            direccion: "Av. Constitución 5700",
            horario: "9:00 - 16:00",
            tipo: "Movil",
            coords: [-37.9872, -57.5773],
        }
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
                <p><strong>Tipo:</strong> ${centro.tipo}</p>
            </div>
            </div>
        </div>
        `).join("");


    var iconoFijo = L.icon({
        iconUrl: './recursos/fijo.png', // https://www.flaticon.es/icono-gratis/camion_5977865
        iconSize: [50, 50], // size of the icon
        iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
        popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    var iconoMovil = L.icon({
        iconUrl: './recursos/movil.png', // https://www.flaticon.es/icono-gratis/punto-de-informacion_5639418
        iconSize: [50, 50], // size of the icon
        iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
        popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
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