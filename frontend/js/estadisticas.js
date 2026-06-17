if (
    sessionStorage.getItem(
        "admin"
    ) !== "true"
){

    location.href = "login.html";
}

function formatearTiempo(segundos) {

    const horas =Math.floor(segundos / 3600);

    const minutos =Math.floor( (segundos % 3600) / 60 );

    const segundosRestantes = segundos % 60;

    return `${horas
        .toString()
        .padStart(2, "0")}:${minutos
        .toString()
        .padStart(2, "0")}:${segundosRestantes
        .toString()
        .padStart(2, "0")}`;

}

async function cargarEstadisticas() {

    try {

        const accesosResp =  await fetch("/api/historial");

        const accesos = await accesosResp.json();

        const usuariosResp = await fetch("/api/usuarios");

        const usuarios =  await usuariosResp.json();

        document.getElementById( "totalAccesos" ) .textContent = accesos.length;

        document.getElementById("totalUsuarios") .textContent = usuarios.length;

        const areas = {};

        accesos.forEach(acceso => {

            if (!areas[acceso.area]) {

                areas[acceso.area] = {

                    ingresos: 0,

                    tiempo: 0

                };

            }

            areas[acceso.area].ingresos++;

            areas[acceso.area].tiempo += acceso.tiempoSegundos || 0;

        });

        const areasOrdenadas =
            Object.entries(areas)
            .sort(
                (a, b) =>
                    b[1].ingresos -
                    a[1].ingresos
            );

        const contenedor =
            document.getElementById(
                "estadisticasAreas"
            );

        contenedor.innerHTML = "";

        areasOrdenadas.forEach(
            ([area, datos]) => {

                contenedor.innerHTML += `

                <div class="persona">

                    <h3>${area}</h3>

                    <p>
                    Ingresos:
                    ${datos.ingresos}
                    </p>

                    <p>
                    Tiempo acumulado:
                    ${formatearTiempo(
                        datos.tiempo
                    )}
                    </p>

                </div>

                <br>

                `;

            });

        const etiquetas = [];
        const valores = [];

        areasOrdenadas.forEach(
            ([area, datos]) => {

                etiquetas.push(area);

                valores.push( datos.ingresos);

            });

        new Chart(

            document.getElementById("graficaAreas"),

            {

                type: "bar",

                data: {

                    labels: etiquetas,

                    datasets: [

                        {

                            label:
                                "Ingresos por área",

                            data:
                                valores

                        }

                    ]

                }

            }

        );

    } catch (error) {

        console.error(error);

    }

}

cargarEstadisticas();