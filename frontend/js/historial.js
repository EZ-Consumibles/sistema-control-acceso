if (
    sessionStorage.getItem(
        "admin"
    ) !== "true"
){

    location.href =
        "login.html";

}

function formatearTiempo(segundos) {

    const horas = Math.floor(segundos / 3600);

    const minutos = Math.floor( (segundos % 3600) / 60 );

    const segundosRestantes = segundos % 60;

    return `${horas
        .toString()
        .padStart(2, "0")}:${minutos
        .toString()
        .padStart(2, "0")}:${segundosRestantes
        .toString()
        .padStart(2, "0")}`;

}

function formatearFecha(fecha) {

    if (!fecha) {
        return "-";
    }

    try {

        const fechaObj = new Date( fecha._seconds * 1000 );

        return fechaObj.toLocaleString(
            "es-MX",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }
        );

    } catch (error) {

        return "-";

    }

}

function renderizarTabla(datos) {

    const tbody =
        document.querySelector(
            "#tabla tbody"
        );

    tbody.innerHTML = "";

    datos.forEach(acceso => {

        tbody.innerHTML += `

        <tr>

            <td>${acceso.nombre}</td>

            <td>${acceso.area}</td>

            <td>${acceso.asunto || "-"}</td>

            <td>${acceso.numeroCandado}</td>

            <td>${formatearFecha(acceso.entrada)}</td>

            <td>${formatearFecha(acceso.salida)}</td>

            <td>${formatearTiempo(
                acceso.tiempoSegundos || 0
            )}</td>

            <td class="${
                acceso.estado === "activo"
                ? "estado-activo"
                : "estado-finalizado"
            }">

                ${
                    acceso.estado === "activo"
                    ? "🟢 Activo"
                    : "🔴 Finalizado"
                }

            </td>

        </tr>

        `;

    });

}

async function cargarHistorial() {

    try {

        const respuesta = await fetch( "/api/historial" );

        const historial = await respuesta.json();

        historial.sort((a, b) => {

            const fechaA =a.entrada?._seconds || 0;

            const fechaB = b.entrada?._seconds || 0;

            return fechaB - fechaA;

        });

        window.historialCompleto =  historial;

        renderizarTabla(historial);

    } catch (error) {

        console.error( "Error al cargar historial:", error );

    }

}

function aplicarFiltros() {

    const nombre =
        document
        .getElementById("buscarNombre")
        .value
        .toLowerCase();

    const area =
        document
        .getElementById("filtroArea")
        .value;

    const fechaFiltro =
        document
        .getElementById("filtroFecha")
        .value;

    const filtrados =
        window.historialCompleto.filter(
            acceso => {

                const coincideNombre =
                    acceso.nombre
                    .toLowerCase()
                    .includes(nombre);

                const coincideArea =
                    !area ||
                    acceso.area === area;

                let coincideFecha = true;

                if (fechaFiltro) {

                    const fechaAcceso =
                        new Date(
                            acceso.entrada._seconds * 1000
                        );

                    const fechaFormateada =
                        fechaAcceso
                        .toISOString()
                        .split("T")[0];

                    coincideFecha =
                        fechaFormateada === fechaFiltro;

                }

                return (
                    coincideNombre &&
                    coincideArea &&
                    coincideFecha
                );

            }
        );

    renderizarTabla(
        filtrados
    );

}

        document.getElementById("buscarNombre").addEventListener( "input", aplicarFiltros);

        document.getElementById("filtroArea").addEventListener( "change",aplicarFiltros);

        document.getElementById("filtroFecha").addEventListener("change",aplicarFiltros);

        document.getElementById("btnExcel").addEventListener(
            "click",
            () => {

                document
        .getElementById("btnExcel")
        .addEventListener(
            "click",
            () => {

        const inicio = document.getElementById( "fechaInicio" ) .value;

        const fin =document .getElementById( "fechaFin" ) .value;

        let url = "/api/exportar";

        if (inicio && fin) {

            url +=`?inicio=${inicio}&fin=${fin}`;

        }

        window.open( url, "_blank");

    }
);

    }
);

cargarHistorial();