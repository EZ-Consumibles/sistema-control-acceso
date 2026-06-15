const dashboardRoutes= require("./routes/dashboard.routes");
const areasRoutes= require("./routes/areas.routes");
const historialRoutes= require("./routes/historial.routes");
const path=require("path");
const salidaRoutes= require("./routes/salida.routes");
const usuariosRoutes= require("./routes/usuarios.routes");
const entradaRoutes= require("./routes/entrada.routes");
const exportarRoutes = require("./routes/exportar.routes");
const express = require("express");
const cors = require("cors");

const db = require("./config/firebase");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));
app.use("/api/dashboard",dashboardRoutes);
app.use("/api/areas",areasRoutes);
app.use("/api/historial",historialRoutes);
app.use("/api/exportar",exportarRoutes);
app.use("/api/salida",salidaRoutes);
app.use("/api/usuarios",usuariosRoutes);
app.use("/api/entrada",entradaRoutes);

app.get("/", (req, res) => {
    res.send("Servidor Control de Acceso funcionando ");
});

app.get("/test-firebase", async (req, res) => {

    try {

        const snapshot = await db.collection("areas").get();
       

        res.json({
            documentos: snapshot.size
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});

app.listen(3000, () => {
    console.log("Servidor iniciado en puerto 3000");
});