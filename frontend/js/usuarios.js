document
.getElementById("area")
.addEventListener("change", () => {

    const area =
        document
        .getElementById("area")
        .value;

    document
        .getElementById("otroAreaContainer")
        .style.display =
        area === "Otros"
        ? "block"
        : "none";

});

document
.getElementById("btnRegistrar")
.addEventListener("click", async () => {

    const nombre =
        document
        .getElementById("nombre")
        .value
        .trim();

    let area =
        document
        .getElementById("area")
        .value;

    if (area === "Otros") {

        area =
            document
            .getElementById("otroArea")
            .value
            .trim();

    }

    if (!nombre || !area) {

        alert(
            "Complete todos los campos"
        );

        return;

    }

    const respuesta =
        await fetch("/api/usuarios", {

            method: "POST",

            headers: {
                "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
                nombre,
                area
            })

        });

    const resultado =
        await respuesta.json();

    alert(resultado.mensaje);

});