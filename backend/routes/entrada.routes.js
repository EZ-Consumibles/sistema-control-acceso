const express = require("express");
const router = express.Router();

const db = require("../config/firebase");

router.post("/", async (req, res) => {

    try {

        const {nombre,  numeroCandado, asunto} = req.body;

        if (!nombre || !numeroCandado) {

            return res.status(400).json({
                mensaje: "Nombre y número de candado son obligatorios"
            });

        }

        const usuarioSnapshot = await db
            .collection("usuarios")
            .where("nombre", "==", nombre)
            .get();

        if (usuarioSnapshot.empty) {

            return res.status(404).json({
                mensaje: "Usuario no encontrado"
            });

        }

        const usuarioDoc = usuarioSnapshot.docs[0];

        const usuario = usuarioDoc.data();

        const accesoActivo = await db
            .collection("accesos")
            .where("nombre", "==", nombre)
            .where("estado", "==", "activo")
            .get();

        if (!accesoActivo.empty) {

            return res.status(400).json({
                mensaje: "El usuario ya tiene una entrada activa"
            });

        }

        const candadoActivo = await db
            .collection("accesos")
            .where("numeroCandado", "==", numeroCandado)
            .where("estado", "==", "activo")
            .get();

        if (!candadoActivo.empty) {

            return res.status(400).json({
                mensaje: "El candado ya está en uso"
            });

        }

        const acceso = {
            usuarioId: usuarioDoc.id,
            nombre: usuario.nombre,
            area: usuario.area,

            numeroCandado,

            asunto,

            entrada: new Date(),

            salida: null,

            tiempoSegundos: 0,

            estado: "activo"
        };

        const docRef = await db
            .collection("accesos")
            .add(acceso);

        res.status(201).json({
            mensaje: "Entrada registrada",
            id: docRef.id
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});

module.exports = router;