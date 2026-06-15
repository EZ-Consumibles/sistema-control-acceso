const express = require("express");
const router = express.Router();

const db = require("../config/firebase");

router.post("/", async (req, res) => {

    try {

        const { nombre, numeroCandado } = req.body;

        if (!nombre || !numeroCandado) {

            return res.status(400).json({
                mensaje: "Nombre y número de candado son obligatorios"
            });

        }

        const accesoSnapshot = await db
            .collection("accesos")
            .where("nombre", "==", nombre)
            .where("estado", "==", "activo")
            .get();

        if (accesoSnapshot.empty) {

            return res.status(404).json({
                mensaje: "No existe una entrada activa para este usuario"
            });

        }

        const accesoDoc = accesoSnapshot.docs[0];

        const acceso = accesoDoc.data();

        if (acceso.numeroCandado !== numeroCandado) {

            return res.status(400).json({
                mensaje: "El número de candado no coincide"
            });

        }

        const fechaSalida = new Date();

        const fechaEntrada = acceso.entrada.toDate();

        const tiempoSegundos = Math.floor(
            (fechaSalida - fechaEntrada) / 1000
        );

        await accesoDoc.ref.update({

            salida: fechaSalida,

            tiempoSegundos,

            estado: "finalizado"

        });

        res.json({
            mensaje: "Salida registrada",
            tiempoSegundos
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});

module.exports = router;