const express = require("express");
const router = express.Router();

const db = require("../config/firebase");

router.get("/", async (req, res) => {

    try {

        const snapshot = await db.collection("areas").get();

        const areas = [];

        snapshot.forEach(doc => {

            areas.push({
                id: doc.id,
                ...doc.data()
            });

        });

        res.json(areas);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});

module.exports = router;