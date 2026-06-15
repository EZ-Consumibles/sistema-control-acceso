import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const firebaseConfig = {

    apiKey: "AIzaSyAuSI6yMxfI7cTgIjM6e82lKcfLBd8t7ns",
    authDomain: "control-acceso-cb7a4.firebaseapp.com",
    projectId: "control-acceso-cb7a4",
    storageBucket: "control-acceso-cb7a4.firebasestorage.app",
    messagingSenderId: "163230632228",
    appId: "1:163230632228:web:f864f6c8da9bdf89fe0bb1",
    measurementId: "G-85Q0G62F2R"

};

const app =
    initializeApp(
        firebaseConfig
    );

const auth =
    getAuth(app);

document
.getElementById("btnLogin")
.addEventListener(
    "click",
    async () => {

        try {

            const email =
                document
                .getElementById("email")
                .value;

            const password =
                document
                .getElementById("password")
                .value;

            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            sessionStorage.setItem(
                "admin",
                "true"
            );

            const destino =
                sessionStorage.getItem(
                    "destino"
                );

            location.href =
                destino ||
                "index.html";

        } catch(error){

            alert(
                "Credenciales incorrectas"
            );

        }

    }
);