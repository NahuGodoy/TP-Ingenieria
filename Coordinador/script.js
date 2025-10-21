document.addEventListener('DOMContentLoaded', () => {
    cargarDatosUsuario();
    cargarTablaIncidencias();
    cargarTablaActualizaciones();
    cargarCardUltimaActualizacon();

    const botonReintentarActualizacion = document.getElementById('boton-reintentar-actualizacion');
    if (botonReintentarActualizacion) {
        botonReintentarActualizacion.addEventListener('click', reintentarActualizacion);
    }
});

function cargarDatosUsuario() {
    const elementoNombreUsuario = document.getElementById('nombre-usuario');
    const elementoApellidoUsuario = document.getElementById('apellido-usuario');

    const urlJson = 'coordinador.json';
    
    fetch(urlJson)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar el JSON.');
            }
            return response.json(); // Convierte el texto JSON a un objeto JavaScript
        })
        .then(data => {
            // 4. Inyectar los valores del objeto 'data' en el HTML

            // Nombre
            if (elementoNombreUsuario) {
                elementoNombreUsuario.textContent = data.nombre;
            }

            // Apellido
            if (elementoApellidoUsuario) {
                elementoApellidoUsuario.textContent = data.apellido;
            }
        })
        .catch(error => {
            console.error('Hubo un problema:', error);
            // Mostrar un mensaje de error si falla
            if (elementoNombreUsuario) elementoNombreUsuario.textContent = 'Error de carga.';
        });
}

function cargarTablaIncidencias() {
    var idCuerpoTabla = 'tabla-incidencias-cuerpo';
    var idEncabezadosTabla = 'tabla-incidencias-encabezados';
    var urlJson = 'incidencias.json';
    cargarTabla(idCuerpoTabla, idEncabezadosTabla, urlJson);
}

function cargarTablaActualizaciones() {
    var idCuerpoTabla = 'tabla-actualizaciones-cuerpo';
    var idEncabezadosTabla = 'tabla-actualizaciones-encabezados';
    var urlJson = 'actualizaciones.json';
    cargarTabla(idCuerpoTabla, idEncabezadosTabla, urlJson);
}

function cargarTabla(idCuerpoTabla, idEncabezadosTabla, urlJson) {
    const cuerpoTabla = document.getElementById(idCuerpoTabla);
    const encabezadosTabla = document.getElementById(idEncabezadosTabla);

    fetch(urlJson)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            return response.json(); // Convierte la respuesta a objeto JavaScript
        })
        .then(data => {
            if (data.length === 0) {
                cuerpoTabla.innerHTML = '<tr><td colspan="3">No hay datos para mostrar.</td></tr>';
                return;
            }

            // A. CREAR ENCABEZADOS (<thead>)
            // Tomamos las claves (keys) del primer objeto para usarlas como encabezados
            const claves = Object.keys(data[0]);
            let encabezadosHtml = '<tr>';
            claves.forEach(clave => {
                // Usamos una clase de Bootstrap para poner en mayúsculas los encabezados si quieres
                encabezadosHtml += `<th scope="col">${clave.toUpperCase()}</th>`;
            });
            encabezadosHtml += '</tr>';
            encabezadosTabla.innerHTML = encabezadosHtml;

            // B. CREAR CUERPO DE LA TABLA (<tbody>)
            let filasHtml = '';
            data.forEach(item => {
                filasHtml += '<tr>';
                // Iteramos sobre los valores de cada objeto
                claves.forEach(clave => {
                    filasHtml += `<td>${item[clave]}</td>`;
                });
                filasHtml += '</tr>';
            });

            cuerpoTabla.innerHTML = filasHtml;
        })
        .catch(error => {
            console.error('Hubo un problema al cargar el JSON:', error);
            cuerpoTabla.innerHTML = `<tr><td colspan="3" class="text-danger">Error: ${error.message}</td></tr>`;
        });
}

function cargarCardUltimaActualizacon() {
    var fechaUltimaActualizacion = "18/10/2025, 00:00:01 hs";
    var estadoUltimaActualizacion = "EXITO";

    const elementofechaUltimaActualizacion = document.getElementById('fecha-ultima-actualizacion');
    const elementoEstadoUltimaActualizacion = document.getElementById('estado-ultima-actualizacion');

    if (elementofechaUltimaActualizacion) {
        elementofechaUltimaActualizacion.textContent = fechaUltimaActualizacion;
    }

    if (elementoEstadoUltimaActualizacion) {
        elementoEstadoUltimaActualizacion.textContent = estadoUltimaActualizacion;
    }
}

function reintentarActualizacion() {
    var fechaActual = new Date();

    const fechaFormateada = fechaActual.toLocaleString('es-ES');

    const elementofechaUltimaActualizacion = document.getElementById('fecha-ultima-actualizacion');

    if (elementofechaUltimaActualizacion) {
        elementofechaUltimaActualizacion.textContent = fechaFormateada + " hs";
    }
}