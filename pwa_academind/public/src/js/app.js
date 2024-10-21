var deferredPrompt;
var enableNotificationsButtons = document.querySelectorAll(
  '.enable-notifications'
);

if (!window.Promise) {
  window.Promise = Promise;
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/service-worker.js')
    .then(function () {
      console.log('Service worker registered!');
    })
    .catch(function (err) {
      console.log(err);
    });
}

window.addEventListener('beforeinstallprompt', function (event) {
  console.log('beforeinstallprompt fired');
  event.preventDefault();
  deferredPrompt = event;
  return false;
});

function displayConfirmNotification() {
  if ('serviceWorker' in navigator) {
    var options = {
      body: 'You successfully subscribed to our Notification service!',
      icon: '/src/images/icons/app-icon-96x96.png',
      image: '/src/images/sf-boat.jpg',
      dir: 'ltr',
      lang: 'en-US', // BCP 47,
      vibrate: [100, 50, 200], // vibrate for 100ms, pause for 50ms, then vibrate for 200ms
      badge: '/src/images/icons/app-icon-96x96.png', // Android only, The little icon that appears on the Android status or notification bar
      tag: 'confirm-notification', // If user receives multiple notifications with the same tag, they will only see one notification
      renotify: true, // If set to true, the notification will vibrate again if the notificationn with the same tag is still open
      actions: [
        {
          action: 'confirm',
          title: 'Okay',
          icon: '/src/images/icons/app-icon-96x96.png',
        },
        {
          action: 'cancel',
          title: 'Cancel',
          icon: '/src/images/icons/app-icon-96x96.png',
        },
      ],
    };

    // const notification = new Notification('Successfully subscribed!', options);
    // notification.close(); // Close the notification after it is shown

    navigator.serviceWorker.ready.then(function (swreg) {
      swreg.showNotification('Successfully subscribed!', options);
    });
  }
}

function configurePushSub() {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  var reg;

  // Get the service worker registration
  navigator.serviceWorker.ready
    .then(function (swreg) {
      reg = swreg;

      // Get the push subscription
      return swreg.pushManager.getSubscription();
    })
    .then(function (sub) {
      if (sub === null) {
        // Create a new subscription for the user
        // subscription is a unique identifier for the user’s device and browser combination,
        // and it allows your server to send notifications to that specific client or
        // combination (specific browser on a specific device)
        var vapidPublicKey =
          'BKapuZ3XLgt9UZhuEkodCrtnfBo9Smo-w1YXCIH8YidjHOFAU6XHpEnXefbuYslZY9vtlEnOAmU7Mc-kWh4gfmE';
        var convertedVapidPublicKey =
          urlBase64ToUint8Array(vapidPublicKey); // Convert the public key to a UInt8Array (required by the browser)
        return reg.pushManager.subscribe({
          userVisibleOnly: true, // The user must be able to see the notification (silent push notifications are not allowed)
          applicationServerKey: convertedVapidPublicKey,
        });
      } else {
        // We already have a subscription
      }
    })
    .then(function (newSub) {
      // send the subscription to the server and store it in the database
      // You need a backend server to send push messages to the browser vendor’s push server.
      // The backend stores the subscription information (like the endpoint URL for each user)
      // and is responsible for sending the actual push messages.
      // When an event occurs that requires sending a notification (like a new message or update),
      // your server sends a push message to the browser vendor’s push server  using the stored endpoint.
      // The push server forwards this message to the browser, which then uses the service worker to
      // display the notification to the user.
      return fetch(
        'https://pwagram-99adf.firebaseio.com/subscriptions.json',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(newSub),
        }
      );
    })
    .then(function (res) {
      if (res.ok) {
        displayConfirmNotification();
      }
    })
    .catch(function (err) {
      console.log(err);
    });
}

function askForNotificationPermission() {
  if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
    console.log("Notifications aren't supported.");
    return;
  }

  Notification.requestPermission(function (result) {
    console.log('User Choice', result);
    if (result !== 'granted') {
      console.log('No notification permission granted!');
    } else {
      configurePushSub();
      // displayConfirmNotification();
    }
  });
}

if ('Notification' in window && 'serviceWorker' in navigator) {
  for (var i = 0; i < enableNotificationsButtons.length; i++) {
    enableNotificationsButtons[i].style.display = 'inline-block';
    enableNotificationsButtons[i].addEventListener(
      'click',
      askForNotificationPermission
    );
  }
}

/*

* Storage Eviction: Best Effort vs Persistent Storage

Best Effort storage is the default for most browsers, where data can be automatically cleared when:
  - The device is low on storage (storage pressure).
  - The website has been inactive for a long time (e.g., Safari claims it deletes data after 7 days of
    inactivity, though this is hard to confirm).
  - The user manually clears site data through browser settings.


Persistent Storage:
  - This must be explicitly requested by the app. Once granted, the data will remain on the device unless
    the user manually deletes it or the device is reset.
  - For PWAs (Progressive Web Apps), persistent storage is often granted by default when the app is
    installed, ensuring that data is not evicted under storage pressure unless the user manually clears it.


* Understanding Quotas
    Quotas refer to the limits that web browsers impose on how much data a web application can store
    locally on a user's device. Different types of web storage systems like localStorage, IndexedDB,
    Cache Storage, and others are subject to these limits. These limits help ensure that no single website
    can consume too much storage space, affecting the performance or other applications on the user’s device.


  Here’s a breakdown of where the quota comes into play:

  Quota applies to all storages like IndexedDB, Cache Storage, and service worker files. All data stored
  in these systems is counted toward a site’s quota.
  Service worker registrations (the files and their dependencies) and Web App Manifests (including icons)
  are also part of this quota.

  However, there are exceptions:
    Cookies and sessionStorage are not part of the quota. The quota is primarily related to longer-term
    storage mechanisms.
    Files that are cached by the browser (e.g., HTTP cache) are also not counted as part of the quota.
    Localstorage typically has a limit of 5MB  of data that you can store in it and sessionStorage has a
    limit of 12MB of data that you can store in it. So we should try avoiding using localstorage and
    sessionStorage in out applications moving foeward.


* Quota Allocation in Different Browsers:

  - Chromium-based browsers (like Chrome) allocate 60% of the total disk space per origin, meaning a web app
    can store up to 60% of the user’s available disk space. The total quota for the entire browser can be up
    to 80% of the disk space.
    Each origin (domain) gets 60% of the total disk space. In total, all storage can take up 80% of
    the total disk space, but individual sites are limited to 60%.

  - Firefox allocates 50% of the total disk space, with a maximum cap of 2GB per eTLD+1
    (Effective Top-Level Domain + 1, meaning a domain and all its subdomains).
    Firefox offers 50% of the total disk space, but limits each domain to a maximum of 2 GB.
    This includes subdomains; for example, example.com and sub.example.com share the same 2 GB quota.

  - Safari allows 1GB per partition (typically per origin), but uniquely lets users bypass the limit
    through explicit permission dialogs. (1GB per partition with increments of 200Mb with user's permission)

* Quota Handling in Special Modes

  - Incognito Mode (or private browsing):
      - In Chrome, only 5% of the total disk space is available for storage in incognito mode.
        Once the session ends, all data is wiped.
      - In Firefox, some APIs might not be available, or storage may be temporary (ephemeral) and
        automatically deleted after the session ends.

  - Clear Cookies and Site Data: If Chrome is set to clear cookies and site data on exit,
    the quota is significantly reduced to 300MB.

*/

// Requesting permission for persistent storage for our website
(async function () {
  // Navigator.storage object is a part of an spec in the W3C known as StorageManager API
  // and persistent is just one part of it, the other part of it is about storage estimation.
  if (navigator.storage && navigator.storage.persist) {
    if (!(await navigator.storage.persisted())) {
      const result = await navigator.storage.persist();
      console.log(
        `Was Persistent Storage Request granted? ${result}`
      );
    } else {
      console.log(`Persistent Storage already granted`);
    }
  }
})();

// Checking the storage quota
// Quotas are estimations, they are not exact values, they are not guaranteed to be accurate.
// They will never give you the exact data.
// It’s important to note that the storage estimation is not exact because of potential security
// concerns such as fingerprinting. Browsers may sometimes fake the size of stored data to prevent
// websites from tracking users through storage usage.
(async function () {
  if (navigator.storage && navigator.storage.estimate) {
    // This will return a promise that will resolve to a StorageEstimate object
    // that will have two properties: quota and usage in bytes.
    const q = await navigator.storage.estimate();

    // Convert bytes to megabytes (or kibibytes if you prefer)
    console.log(
      `quota available: ${parseInt(q.quota / 1024 / 1024)}MiB`
    );
    console.log(`quota usage: ${q.usage / 1024}KiB`);
  }
})();
