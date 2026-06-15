const txtNombre = document.getElementById("nombre");

const sugerencias = document.getElementById("sugerencias");

let usuarioSeleccionado = null;

txtNombre.addEventListener("input", async () => {

    const texto = txtNombre.value.trim();

    if(texto.length < 2){

        sugerencias.innerHTML = "";
        return;

    }

    const respuesta =await fetch(`/api/usuarios/buscar?nombre=${texto}`);

    const usuarios = await respuesta.json();

    sugerencias.innerHTML = "";

    usuarios.forEach(usuario => {

        const div = document.createElement("div");

        div.classList.add("persona");

        div.textContent =`${usuario.nombre} - ${usuario.area}`;

        div.onclick = () => {

            txtNombre.value = usuario.nombre;

            usuarioSeleccionado = usuario;

            sugerencias.innerHTML = "";

        };

        sugerencias.appendChild(div);

    });

});

    document
    .getElementById("btnRegistrar")
    .addEventListener("click", async () => {

    const nombre = txtNombre.value.trim();

    const numeroCandado = document.getElementById("numeroCandado").value.trim();

    const asunto =document.getElementById("asunto").value.trim();    

    const respuesta = await fetch("/api/entrada", {

            method: "POST",

            headers: {
                "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
                nombre,
                numeroCandado,
                asunto
            })

        });

    const resultado =await respuesta.json();

    alert(resultado.mensaje);

});