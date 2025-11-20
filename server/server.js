// Server di Test per Push Notifications (Node.js + Express)

import express from "express";
import webpush from "web-push";
import bodyParser from "body-parser";

import dotenv from "dotenv";

dotenv.config();
// require("dotenv").config();

const app = express();
app.use(bodyParser.json());

// 1. CHIAVI VAPID (USA QUELLE CHE HAI GENERATO)

const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

// Indirizzo email o URL del sito per identificazione (richiesto da VAPID)
const vapidMailto = "mailto:il_tuo_indirizzo_email@example.com";

// Configurazione di web-push
webpush.setVapidDetails(vapidMailto, vapidPublicKey, vapidPrivateKey);

// Array per salvare temporaneamente le sottoscrizioni
let pushSubscriptions = [];

app.get("/api/vapid-key", (req, res) => {
  return res.json({ publicKey: vapidPublicKey });
});

// ENDPOINT 1: RICEZIONE DELLA SOTTOSCRIZIONE DAL CLIENT (REACT)

app.post("/api/subscribe", (req, res) => {
  const subscription = req.body;

  pushSubscriptions.push(subscription);

  console.log({ subscription });

  console.log("✅ Nuova sottoscrizione salvata:", subscription.endpoint);
  res.status(201).json({ message: "Subscription saved successfully" });
});

// ENDPOINT 2: INVIO DELLA NOTIFICA (PER IL TEST)

app.get("/api/push", (req, res) => {
  if (pushSubscriptions.length === 0) {
    return res
      .status(400)
      .json({ message: "No subscriptions found to send a notification." });
  }

  // Payload (il messaggio che il tuo Service Worker riceverà)
  const payload = JSON.stringify({
    title: "🎉 Test Notifica OK!",
    message: "Questo messaggio è stato inviato dal tuo server Node.js!",
    url: "/", // Questo verrà aperto al click, gestito da sw.js
    icon: "/vite.svg",
  });

  let successCount = 0;
  let failureCount = 0;

  // Invia la notifica a TUTTE le sottoscrizioni salvate
  pushSubscriptions.forEach((subscription, index) => {
    webpush
      .sendNotification(subscription, payload)
      .then(() => {
        successCount++;
        console.log(
          `Notifica inviata con successo alla sottoscrizione ${index}`
        );
      })
      .catch((error) => {
        failureCount++;
        // Se c'è un errore (es. il token è scaduto), dovresti rimuovere la sottoscrizione
        console.error(
          `Errore nell'invio della notifica alla sottoscrizione ${index}:`,
          error.body
        );
      });
  });

  res.json({
    message: "Push notifications sent/attempted.",
    totalSubscriptions: pushSubscriptions.length,
  });
});

// Avvia il server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server di test avviato sulla porta ${PORT}`);
  console.log(
    `Per inviare la notifica, visita: http://localhost:${PORT}/api/push`
  );
});
