🚀 PWA Push Notification Demo (React + Node.js)

Questo repository contiene un esempio completo e funzionante di implementazione delle Notifiche Push Web (Web Push Notifications) in una Progressive Web App (PWA).

Il progetto è diviso in due parti:

Frontend (Client): Un'applicazione creata con React e Vite, che gestisce la registrazione del Service Worker, la richiesta di permessi per le notifiche e l'iscrizione al servizio Push (utilizzando le chiavi VAPID).

Backend (Server): Un server Node.js con Express che memorizza le sottoscrizioni e utilizza la libreria web-push per inviare effettivamente le notifiche.

🌟 Caratteristiche Principali

Sicurezza migliorata: Le chiavi VAPID private sono gestite tramite variabili d'ambiente (.env).

Setup Completo: Dalla sottoscrizione al client all'invio della notifica dal server.

Gestione VAPID: Recupero della chiave pubblica VAPID dal server e conversione in Uint8Array sul client per l'iscrizione.

Service Worker Minimalista: public/sw.js configurato solo per intercettare gli eventi push e gestire i notificationclick.

Configurazione Vite Proxy: Utilizzo del proxy di Vite per instradare le chiamate API (/api/\*) al server Node.js.

🛠️ Come Avviare il Progetto

Prerequisiti

Node.js (versione 14+)

Un set di chiavi VAPID (pubblica e privata).

La libreria dotenv (installata via npm install dotenv per il server).

1. Configurazione del Backend (Sicurezza)

ATTENZIONE: Il file server.js legge ora le chiavi segrete da variabili d'ambiente per garantire la sicurezza del codice pubblicato.

Crea il file .env: Nella root del progetto Node.js, crea un file chiamato .env.

Aggiungi le tue chiavi: Inserisci le tue chiavi VAPID pubbliche e private reali nel file .env nel seguente formato:

VAPID_PUBLIC_KEY="LA_TUA_CHIAVE_PUBBLICA"
VAPID_PRIVATE_KEY="LA_TUA_CHIAVE_PRIVATA_SECRETA"
VAPID_MAILTO="mailto:tua.email@esempio.com"

Proteggi le chiavi: Assicurati di aggiungere .env al tuo file .gitignore in modo che le chiavi private non vengano mai caricate su GitHub.

2. Esecuzione

Avvia il server e l'applicazione frontend in due terminali separati.

Terminale 1: Avvia il Server Node.js

# Assumendo che tu abbia installato le dipendenze del server

node server.js

Terminale 2: Avvia l'App Frontend (Vite/React)

# Assumendo che tu sia nella cartella del progetto React

npm install
npm run dev

3. Test dell'Invio della Notifica

Apri l'applicazione nel browser (es. http://localhost:5173).

Accetta la richiesta di autorizzazione per le notifiche.

Controlla la console per vedere la sottoscrizione inviata con successo al server.

Per inviare una notifica di prova, apri una nuova scheda del browser e vai all'endpoint di test:

http://localhost:3000/api/push

Il server tenterà di inviare la notifica a tutte le sottoscrizioni salvate (in memoria). Se tutto è configurato correttamente, vedrai la notifica comparire sul tuo desktop!

📜 Struttura dei File

File

Ruolo

src/App.tsx

Componente React principale. Gestisce il recupero della chiave VAPID e l'iscrizione Push.

public/sw.js

Service Worker. Intercetta gli eventi push e notificationclick.

server.js

Server Node.js (Express). Fornisce la chiave VAPID pubblica e gestisce l'invio delle notifiche.

vite.config.ts

Configurazione del proxy per connettere il frontend (:5173) al server (:3000).

.env

Contiene le chiavi VAPID private e pubbliche, tenute fuori dal controllo di versione (Git).
