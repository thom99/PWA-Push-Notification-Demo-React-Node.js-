import React, { useEffect } from "react";

//Contains the React logic to register the Service Worker, request permission, and subscribe to the push service.

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

const App: React.FC = () => {
  // State is used to show the status to the user
  const [status, setStatus] = React.useState("Initializing...");

  useEffect(() => {
    setStatus("Attempting notification setup...");
    setupPwa()
      .then(() =>
        setStatus(
          "Notification Setup completed. Check the console for details."
        )
      )
      .catch((e) => setStatus(`Critical error during setup: ${e.message}`));
  }, []); // Run only on component mount

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          PWA Push Notification Demo
        </h1>
        <p className="text-gray-600">
          Logic managed by App.tsx and public/sw.js.
        </p>
      </header>

      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-indigo-600">
          Service Worker Status
        </h2>
        <p className="text-lg font-medium text-gray-700">
          Status:{" "}
          <span className="font-mono text-sm px-2 py-1 rounded-md bg-indigo-100 text-indigo-700">
            {status}
          </span>
        </p>

        <p className="mt-4 text-sm text-gray-500">
          Check the browser console to see the "Push Subscription obtained"
          object, which you must send to your server.
        </p>
        <p className="mt-2 text-xs text-red-500">
          Remember to replace the `VAPID_PUBLIC_KEY` variable in `App.tsx`!
        </p>
      </div>
    </div>
  );
};
export default App;
