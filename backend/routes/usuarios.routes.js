const express = require("express");
const router = express.Router();

const db = require("../config/firebase");

// Obtener todos los usuarios
router.get("/", async (req, res) => {

    try {

        const snapshot = await db.collection("usuarios").get();

        const usuarios = [];

        snapshot.forEach(doc => {

            usuarios.push({
                id: doc.id,
                ...doc.data()
            });

        });

        res.json(usuarios);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});

// Registrar usuario
router.post("/", async (req, res) => {

    try {

        const { nombre, area } = req.body;

        if (!nombre || !area) {

            return res.status(400).json({
                mensaje: "Nombre y área son obligatorios"
            });

        }

        const consulta = await db
            .collection("usuarios")
            .where("nombre", "==", nombre)
            .where("area", "==", area)
            .get();

        if (!consulta.empty) {

            return res.status(400).json({
                mensaje: "El usuario ya existe"
            });

        }

        const nuevoUsuario = {
            nombre,
            area,
            activo: true,
            fechaRegistro: new Date()
        };

        const docRef = await db
            .collection("usuarios")
            .add(nuevoUsuario);

        res.status(201).json({
            mensaje: "Usuario registrado",
            id: docRef.id
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});


router.get("/buscar", async (req, res) => {
    try{
        const trexto=req.query.nombre || "";
        const snapshot = await db.collection("usuarios").get();
        const usuarios = [];
        snapshot.forEach(doc => {
            const usuario=doc.data();
            if (usuario.nombre.toLowerCase.includes(texto.toLowerCase())) {
                usuarios.push({
                    id: doc.id, ...usuario
                });
            }
        });
        res.json(usuarios);
    }catch(error){
        res.status(500).json({
            error:error.message
        });
    }
});
module.exports = router;