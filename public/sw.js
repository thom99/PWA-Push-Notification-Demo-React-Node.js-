// Script Service Worker  => notification management and offline cache
// (intercept push event from server to show the notification)

//Catch the event by Service worker

//Create a broadcast channel for real-time communication between SW and React Apps
const broadcastChannel = new BroadcastChannel("test_push_channel");

// push => receives the data payload sent from your server and uses self.registration.showNotification() to display the notification banner to the user
self.addEventListener("push", (event) => {
  // Check the permission
  if (!(self.Notification && self.Notification.permission === "granted")) {
    // Send data to the app even if notifications are blocked
    // (The app can update an internal counter or display a banner)
    broadcastChannel.postMessage({
      type: "PUSH_DATA",
      payload: event.data ? event.data.json() : {},
    });
    return;
  }

  let data;
  try {
    // Obtains data from the JSON payload sent by the server
    data = event.data ? event.data.json() : {};
    console.log("Push event data received:", data);
  } catch (e) {
    // Handling cases where the payload is not valid JSON
    console.error("Failed to parse push event data:", e);
    return;
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
    // Other options to improve the UX
    // badge: '/badge.png',
    // tag: 'unique-alert-tag' // To avoid duplicate notifications
  };

  // event.waitUntil => ensure that the Service Worker is not terminated before the notification is displayed
  event.waitUntil(
    //anonymous arrow function
    (async () => {
      // 1. BROADCAST: Send data to all open windows via Broadcast Channel
      broadcastChannel.postMessage({
        type: "PUSH_NOTIFICATION_ARRIVED",
        payload: data,
      });

      // 2. CLIENTS API: Send data to all open tabs via direct postMessage => ANOTHER ALTERNATIVE TO BROADCAST CHANNEL
      // This is an alternative/redundant, but robust method.
      // const clients = await self.clients.matchAll({
      //   type: "window",
      //   includeUncontrolled: true,
      // });
      // clients.forEach((client) => {
      //   // You can use postMessage to send more complex data directly to the client.
      //   client.postMessage({
      //     type: "PUSH_NOTIFICATION_ARRIVED",
      //     payload: data,
      //   });
      // });

      // 3. NOTIFICA: Show the system notification
      self.registration.showNotification(title, options).catch((error) => {
        console.error("Failed to show notification:", error);
      });
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
