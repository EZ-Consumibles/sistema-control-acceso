const admin = require("firebase-admin");

console.log("PROJECT:", process.env.FIREBASE_PROJECT_ID);
console.log("EMAIL:", process.env.FIREBASE_CLIENT_EMAIL);
console.log(
  "KEY START:",
  process.env.FIREBASE_PRIVATE_KEY?.substring(0, 50)
);

admin.initializeApp({
    
    credential: admin.credential.cert({
        projectId:
            process.env.FIREBASE_PROJECT_ID,

        clientEmail:
            process.env.FIREBASE_CLIENT_EMAIL,

        privateKey:
            process.env.FIREBASE_PRIVATE_KEY
                .replace(/\\n/g, "\n")
    })
});



const db = admin.firestore();

module.exports = db;