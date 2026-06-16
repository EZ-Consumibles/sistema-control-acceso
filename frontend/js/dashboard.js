async function cargarDashboard() {

    try {

        const respuesta = await fetch("/api/dashboard");

        const datos = await respuesta.json();

        document.getElementById("ocupacion").textContent = datos.ocupacion;

        const estado = document.getElementById("estado");

        estado.textContent = datos.ocupacion > 0  ? "🔴 OCUPADO" : "🟢 LIBRE";

        const contenedor = document.getElementById("contenedorPersonas");

        contenedor.innerHTML = "";

        datos.personasDentro.forEach(persona => {

            contenedor.innerHTML += `
                <div class="persona">

                    <h3>${persona.nombre}</h3>

                    <p>
                        <strong>Área:</strong>
                        ${persona.area}
                    </p>

                    <p>
                        <strong>Asunto:</strong>
                        ${persona.asunto || "-"}
                    </p>

                    <p>
                        <strong>Candado:</strong>
                        ${persona.numeroCandado}
                    </p>

                    <p><strong>Tiempo:</strong> ${formatearTiempo( persona.tiempoSegundos )}</p>

                </div>
            `;

        });

    } catch(error){

        console.error(error);

    }

}

function formatearTiempo(segundos) {

    const horas = Math.floor(segundos / 3600);

    const minutos = Math.floor((segundos % 3600) / 60);

    const segundosRestantes = segundos % 60;

    return `${horas
        .toString()
        .padStart(2, "0")}:${minutos
        .toString()
        .padStart(2, "0")}:${segundosRestantes
        .toString()
        .padStart(2, "0")}`;

}

async function cargarResumen() {

    try {

        const usuariosResp =
            await fetch("/api/usuarios");

        const usuarios =
            await usuariosResp.json();

        const historialResp =
            await fetch("/api/historial");

        const historial =
            await historialResp.json();

        const activos =
            historial.filter(
                acceso =>
                acceso.estado === "activo"
            );

        const tiempoTotal =
            historial.reduce(
                (total, acceso) =>
                total +
                (acceso.tiempoSegundos || 0),
                0
            );

        const hoy =
            new Date();

        const accesosHoy =
            historial.filter(acceso => {

                if (!acceso.entrada?._seconds) {

                    return false;

                }

                const fechaAcceso =
                    new Date(
                        acceso.entrada._seconds * 1000
                    );

                return (

                    fechaAcceso.getDate() === hoy.getDate()

                    &&

                    fechaAcceso.getMonth() === hoy.getMonth()

                    &&

                    fechaAcceso.getFullYear() === hoy.getFullYear()

                );

            });

        const areas = {};

        historial.forEach(acceso => {

            if (!areas[acceso.area]) {

                areas[acceso.area] = 0;

            }

            areas[acceso.area]++;

        });

        let areaMasActiva = "-";
        let maxIngresos = 0;

        for (const area in areas) {

            if (areas[area] > maxIngresos) {

                maxIngresos =
                    areas[area];

                areaMasActiva =
                    area;

            }

        }

        document
            .getElementById(
                "usuariosRegistrados"
            )
            .textContent =
            usuarios.length;

        document
            .getElementById(
                "personasDentro"
            )
            .textContent =
            activos.length;

        document
            .getElementById(
                "accesosTotales"
            )
            .textContent =
            historial.length;

        document
            .getElementById(
                "accesosHoy"
            )
            .textContent =
            accesosHoy.length;

        document
            .getElementById(
                "tiempoTotal"
            )
            .textContent =
            formatearTiempo(
                tiempoTotal
            );

        document
            .getElementById(
                "areaMasActiva"
            )
            .textContent =
            areaMasActiva;

    } catch(error){

        console.error(
            error
        );

    }

}

function irHistorial(){

    sessionStorage.setItem(
        "destino",
        "historial.html"
    );

    location.href =
        "login.html";

}

function irEstadisticas(){

    sessionStorage.setItem(
        "destino",
        "estadisticas.html"
    );

    location.href =
        "login.html";

}

function cerrarSesion(){

    sessionStorage.removeItem(
        "admin"
    );

    sessionStorage.removeItem(
        "destino"
    );

    alert(
        "Sesión cerrada"
    );

}

cargarDashboard();
cargarResumen();

setInterval(() => {

    cargarDashboard();
    cargarResumen();

}, 60000);