const express = require("express");
const router = express.Router();

const db = require("../config/firebase");

router.get("/", async (req, res) => {

    try {

        const snapshot = await db
            .collection("accesos")
            .where("estado", "==", "activo")
            .get();

        const personasDentro = [];

        snapshot.forEach(doc => {

            const acceso = doc.data();

            const entrada = acceso.entrada.toDate();

            const ahora = new Date();

            const tiempoSegundos = Math.floor(
                (ahora - entrada) / 1000
            );

            personasDentro.push({
                id: doc.id,
                nombre: acceso.nombre,
                area: acceso.area,
                asunto: acceso.asunto,
                numeroCandado: acceso.numeroCandado,
                tiempoSegundos
            });

        });

        res.json({
            ocupacion: personasDentro.length,
            personasDentro
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});

module.exports = router;