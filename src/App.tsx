import React, { useEffect, useState } from "react";

//Contains the React logic to register the Service Worker, request permission, and subscribe to the push service.

// Nome del canale broadcast usato per comunicare dal Service Worker all'app
const BROADCAST_CHANNEL_NAME = "test_push_channel";

const setupPwa = async () => {
  //Registration of Service Worker
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      console.log("SW successfully registered:", registration);

      //Request permission to the user => //denied, granted or default
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        console.log("Notification authorisation granted.");

        //Subscribe to the Push service (Client-side)
        await subscribeUserToPush(registration);
      } else {
        console.warn("Notification permission was NOT granted.");
      }
    } catch (error) {
      console.error("SW registration failed:", error);
    }
  }
};

// Funzione di utilità per convertire la chiave VAPID da base64 URL safe a Uint8Array
// (Necessario per l'iscrizione Push)
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const subscribeUserToPush = async (registration: ServiceWorkerRegistration) => {
  //VAPID

  // Check if a subscription already exists to avoid duplicate requests
  const existingSubscription = await registration.pushManager.getSubscription();
  if (existingSubscription) {
    console.log("Existing Push Subscription found:", existingSubscription);
    // You might want to resend the existing subscription to the server here
    return existingSubscription;
  }

  try {
    //Retrieve the public VAPID KEY
    const response = await fetch("/api/vapid-key");
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();

    console.log({ data });

    const options = {
      //   applicationServerKey: urlBase64ToUint8Array(result.publciKey),
      applicationServerKey: urlBase64ToUint8Array(data.publicKey),
      userVisibleOnly: true,
    } as PushSubscriptionOptionsInit;

    //Obetain the subscription
    const subscription = await registration.pushManager.subscribe(options);

    //Send the subscription to the backend server to save it
    //For example:
    await fetch("/api/subscribe", {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify(subscription),
    });

    console.log("Subscribed to PUSH", subscription);
  } catch (error) {
    // This often fails if the user declines the permission mid-process
    console.error("Push subscription failed:", error);
  }
};

// Interfaccia per il payload (per TypeScript)
interface PushPayload {
  title: string;
  message: string;
  url?: string;
}

const App: React.FC = () => {
  // Status to view the last notification received in-app
  const [lastNotification, setLastNotification] = useState<PushPayload | null>(
    null
  );
  const [messageSource, setMessageSource] = useState<string | null>(null);
  const [status, setStatus] = useState("Initializing...");

  useEffect(() => {
    // 1. Start Service Worker registration and Push subscription
    setStatus("Attempting notification setup...");
    setupPwa()
      .then(() =>
        setStatus(
          "Notification Setup completed. Check the console for details."
        )
      )
      .catch((e) => setStatus(`Critical error during setup: ${e.message}`));

    // 2. Listening via broadcast channel
    const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
    channel.onmessage = (event) => {
      if (event.data && event.data.type === "PUSH_NOTIFICATION_ARRIVED") {
        setLastNotification(event.data.payload as PushPayload);
        setMessageSource("BroadcastChannel");
        console.log(
          "Received PUSH data via BroadcastChannel:",
          event.data.payload
        );
      }
    };

    // Clean up when unmounting the component
    return () => {
      channel.close();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          PWA Push Notification Demo
        </h1>
        <p className="text-gray-600">Logica Push integrata in App.tsx.</p>
      </header>

      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-lg border border-gray-200 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-indigo-600">
          Stato Service Worker
        </h2>
        <p className="text-lg font-medium text-gray-700">
          Stato:{" "}
          <span className="font-mono text-sm px-2 py-1 rounded-md bg-indigo-100 text-indigo-700">
            {status}
          </span>
        </p>
        <p className="mt-4 text-sm text-gray-500">
          Controlla la console per lo stato del Service Worker e
          dell'iscrizione.
        </p>
      </div>

      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-green-600">
          Ultima Notifica In-App
        </h2>

        {lastNotification ? (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-bold text-green-700">
              🔔 Messaggio Push Ricevuto
            </h3>
            <p className="text-sm text-gray-700">Fonte: {messageSource}</p>
            <p className="text-lg mt-1 font-mono break-words">
              **{lastNotification.title || "Nessun Titolo"}**:{" "}
              {lastNotification.message || "Nessun Messaggio"}
            </p>
          </div>
        ) : (
          <p className="text-gray-600">
            In attesa di ricevere una notifica push in-app...
          </p>
        )}

        <div className="mt-4 border-t pt-4">
          <p className="text-xs text-gray-400">
            Per testare, assicurati che il server Node.js sia in esecuzione
            (porta 3000) e apri:
            <code className="bg-gray-100 p-1 rounded block mt-1">
              http://localhost:3000/api/push
            </code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
