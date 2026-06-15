const express = require("express");
const router = express.Router();

const ExcelJS = require("exceljs");

const db = require("../config/firebase");

router.get("/", async (req, res) => {

    try {

        const { inicio, fin } = req.query;

        const snapshot = await db
        .collection("accesos")
        .get();

        const workbook =new ExcelJS.Workbook();

        const worksheet =workbook.addWorksheet("Historial");

        if (inicio && fin) {

    worksheet.addRow([
        `REPORTE DE ACCESOS DEL ${inicio} AL ${fin}`
    ]);

    worksheet.addRow([]);

}

        worksheet.columns = [

            {
                header: "Nombre",
                key: "nombre",
                width: 30
            },

            {
                header: "Área",
                key: "area",
                width: 20
            },

            {
                header: "Candado",
                key: "candado",
                width: 15
            },

            {
                header: "Asunto",
                key: "asunto",
                width: 40
            },

            {
                header: "Entrada",
                key: "entrada",
                width: 25
            },

            {
                header: "Salida",
                key: "salida",
                width: 25
            },

            {
                header: "Tiempo",
                key: "tiempo",
                width: 20
            },

            {
                header: "Estado",
                key: "estado",
                width: 15
            }

        ];

        const registros = [];

snapshot.forEach(doc => {

    const acceso =
        doc.data();

    if (
        inicio &&
        fin &&
        acceso.entrada
    ) {

        const fechaAcceso =
            new Date(
                acceso.entrada._seconds *
                1000
            );

        const fechaInicio =
            new Date(inicio);

        const fechaFin =
            new Date(fin);

        fechaFin.setHours(
            23,59,59,999
        );

        if (
            fechaAcceso >= fechaInicio &&
            fechaAcceso <= fechaFin
        ) {

            registros.push(
                acceso
            );

        }

    }
    else {

        registros.push(
            acceso
        );

    }

});

        snapshot.forEach(acceso => {

            worksheet.addRow({

                nombre:
                    acceso.nombre,

                area:
                    acceso.area,

                candado:
                    acceso.numeroCandado,

                asunto: acceso.asunto || "-",    

                entrada:
                    acceso.entrada
                        ? new Date(
                            acceso.entrada._seconds * 1000
                        ).toLocaleString("es-MX")
                        : "-",

                salida:
                    acceso.salida
                        ? new Date(
                            acceso.salida._seconds * 1000
                        ).toLocaleString("es-MX")
                        : "-",

                tiempo:
                    acceso.tiempoSegundos || 0,

                estado:
                    acceso.estado

            });

        });

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "Content-Disposition",
            "attachment; filename=HistorialAccesos.xlsx"
        );

        await workbook.xlsx.write(
            res
        );

        res.end();

    } catch(error){

        res.status(500).json({
            error:error.message
        });

    }

});

module.exports = router;