const express=require("express");
const router = express.Router();

const db = require("../config/firebase");

router.get("/",async (req,res)=> {
    try {
        const snapshot = await db.collection("accesos").get();
        const historial = [];
        snapshot.forEach(doc=> {
            historial.push({
                id:doc.id, ...doc.data()
            });
        });
        res.json(historial);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

module.exports = router;