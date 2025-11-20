// Script Service Worker  => notification management and offline cache
// (intercept push event from server to show the notification)

//Catch the event by Service worker

// push => receives the data payload sent from your server and uses self.registration.showNotification() to display the notification banner to the user
self.addEventListener("push", (event) => {
  // Check the permission
  if (!(self.Notification && self.Notification.permission === "granted")) {
    return;
  }

  // event.waitUntil => ensure that the Service Worker is not terminated before the notification is displayed
  event.waitUntil(
    //anonymous arrow function
    (async () => {
      let data;
      try {
        // Obtains data from the JSON payload sent by the server
        data = event.data ? event.data.json() : {};
        console.log("Push event data received:", data);
      } catch (e) {
        // Handling cases where the payload is not valid JSON
        console.error("Failed to parse push event data:", e);
        data = {
          title: "Notifica Generica",
          body: "Controlla l'app per aggiornamenti.",
          url: "/",
        };
      }

      const title = data.title || "Nuova Notifica";
      const message = data.message || data.body || "Messaggio notifica";

      const options = {
        body: message,
        icon: data.icon || "/Icon.png", // Icon to show (look if exist into /public/)
        data: {
          // Save the destination URL
          url: data.url || "/",
        },
      };

      await self.registration.showNotification(title, options);
    })()
  );

  //Get Notifications, specified with options tag (so we can managed different type of notification)
  // const options = { tag: "user_alerts" };

  // navigator.serviceWorker.ready.then((registration) => {
  //   registration.getNotifications(options).then((notifications) => {
  //     // do something with your notifications
  //   });
  // });
});

//notificationclick: Detects when the user clicks on the notification (not on the close button) and typically uses clients.openWindow() to open a specific URL within your PWA
self.addEventListener("notificationclick", (event) => {
  const clickedNotification = event.notification;
  clickedNotification.close(); //Close notifaction after click

  const targetUrl = event.notification.data.url || "/";

  // Action after click: open new window with the url passed as parameter
  event.waitUntil(clients.openWindow(targetUrl));
});

//OFFLINE CACHE

// 1. Lifecycle fo Service Worker => Installation and Activation

// // install => installed at the time of initial registration, used for static caching of web app assets like HTML, CSS, JavaScript and static imagine for offline use
// // activate => activated after the installation
// self.addEventListener("install", (event) => {
//   event.waitUntil(
//     caches.open("v1").then((cache) => {
//       return cache.addAll([
//         "/",
//         "/index.html",
//         "/style.css",
//         "/app.js",
//         // Aggiungi tutti i file essenziali
//       ]);
//     })
//   );
// });

// // 2. Network management (Caching Runtime)

// // fetch => It intercepts every single network request made by your PWA
// // It allows you to decide to respond with a resource saved in the cache or retrieve it from the network
// self.addEventListener("fetch", (event) => {
//   event.respondWith(
//     // Cache First (try cache, after the network)
//     caches.match(event.request).then((response) => {
//       return response || fetch(event.request);
//     })
//   );
// });
