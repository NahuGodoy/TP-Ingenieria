document.addEventListener("DOMContentLoaded", function () {
    const map = L.map("map").setView([-38.0055, -57.5826], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19, minZoom: 12,
    }).addTo(map);

    const accordionContainer = document.getElementById("accordionCentros");

    var centros = [
        {
            id: 1,
            nombre: "Centro San Luis",
            direccion: "San Luis 2220",
            horario: "8:00 - 15:00",
            tipo: "Fijo",
            coords: [-38.003357, -57.551457],
        },
        {
            id: 2,
            nombre: "Centro Colon",
            direccion: "Avenida Colón 3950",
            horario: "9:00 - 17:00",
            tipo: "Fijo",
            coords: [-37.9969, -57.5640],
        },
        {
            id: 3,
            nombre: "Centro Entre Ríos",
            direccion: "Entre Ríos 3805",
            horario: "10:00 - 18:00",
            tipo: "Movil",
            coords: [-38.0185, -57.5568],
        },
        {
            id: 4,
            nombre: "Centro Moreno",
            direccion: "Moreno 5451",
            horario: "9:00 - 16:00",
            tipo: "Movil",
            coords: [-37.9872, -57.5773],
        },
        {
            id: 5,
            nombre: "Centro Mogotes",
            direccion: "Balneario Punta Mogotes 2611",
            horario: "9:00 - 16:00",
            tipo: "Movil",
            coords: [-38.066913, -57.545017],
        }
    ];

    function renderizarAccordion(listaCentros) {
        accordionContainer.innerHTML = listaCentros.map((centro, i) => `
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
        linkearClicks();
    }

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

    function linkearClicks() {
        document.querySelectorAll(".accordion-button").forEach(button => {
            button.addEventListener("click", (e) => {
                const idCentro = parseInt(e.target.dataset.id);
                const centro = centros.find(c => c.id === idCentro);

                if (centro) {
                    map.flyTo([centro.coords[0], centro.coords[1]], 18, { animate: true, duration: 1.5 });
                    setTimeout(() => marcadores[idCentro].openPopup(), 800);
                }
            });
        });
    }

    const busqueda = document.getElementById("floatingInput");

    const todos = document.getElementById("todos");
    const fijo = document.getElementById("fijo");
    const movil = document.getElementById("movil");

    todos.addEventListener("change", () => {
        if (todos.checked) {
            movil.checked = false;
            fijo.checked = false;
        };
        filtrarCentros();
        map.flyTo([-38.0055, -57.5826], 13, { animate: true, duration: 1.5 });
    });

    fijo.addEventListener("change", () => {
        if (fijo.checked) {
            movil.checked = false;
            todos.checked = false;
        };
        filtrarCentros();
    });

    movil.addEventListener("change", () => {
        if (movil.checked) {
            fijo.checked = false;
            todos.checked = false;
        };
        filtrarCentros();
    });

    busqueda.addEventListener("input", filtrarCentros);

    function filtrarCentros() {
        const fijoChecked = fijo.checked;
        const movilChecked = movil.checked;
        let filtrados = centros;

        if (fijoChecked) {
            filtrados = filtrados.filter(c => c.tipo === "Fijo");
        } else if (movilChecked) {
            filtrados = filtrados.filter(c => c.tipo === "Movil");
        }

        const filtro = busqueda.value.toLowerCase();
        filtrados = filtrados.filter(cen =>
            cen.nombre.toLowerCase().includes(filtro));

        renderizarAccordion(filtrados);
    }

    renderizarAccordion(centros);
});