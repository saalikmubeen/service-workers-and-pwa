self.addEventListener('sync', (event) => {
  if (event.tag === 'mySyncTag') {
    // read the data from the indexedDB
    event.waitUntil(
      fetch('/create-post', {
        method: 'POST',
        body: JSON.stringify({ data: 'your data' }),
        headers: { 'Content-Type': 'application/json' },
      })
    );
  }
});

self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'periodic') {
    // read the data from the indexedDB
    event.waitUntil(
      // do something here
      console.log('Periodic Sync');
    );
  }
});



// Triggered when the background fetch is successful and the data is downloaded
addEventListener('backgroundfetchsuccess', (event) => {
  const bgFetch = event.registration;

  event.waitUntil(async function() {
    // Create/open a cache.
    const cache = await caches.open('downloads');
    // Get all the records that were downloaded.
    const records = await bgFetch.matchAll();
    // Copy each request/response across.
    const promises = records.map(async (record) => {
      const response = await record.responseReady;
      await cache.put(record.request, response);
    });

    // Wait for the copying to complete.
    await Promise.all(promises);

    // Update the progress notification.
    event.updateUI({ title: 'Episode 5 ready to listen!' });
  }());
});

// Triggered when the background fetch fails
self.addEventListener('backgroundfetchfailure', (event) => {
  console.error('Background fetch failed:', event);
});


// The UI displaying the download progress and result is clickable. The backgroundfetchclick event
// in the service worker lets you react to this.
addEventListener('backgroundfetchclick', (event) => {
  const bgFetch = event.registration;

  if (bgFetch.result === 'success') {
    clients.openWindow('/latest-podcasts');
  } else {
    clients.openWindow('/download-progress');
  }
});






self.addEventListener('pushsubscriptionchange', function () {
  // do something, usually resubscribe to push and
  // send the new subscription details back to the
  // server via XHR or Fetch
});

self.addEventListener('notificationclose', function (event) {
  // Useful for tracking
});

self.addEventListener('notificationclick', function (event) {
  // optional data sent with the notification
  var notificationData = event.notification.data;

  if (!event.action) {
    console.log('Notification Click with no action');
    return;
  } else {
    // event action has the action id
    if (event.action == 'action-yes') {
      // fetch('/save/yes');
    } else if (event.action == 'action-no') {
      // fetch('/save/no');
    }
  }
  event.notification.close();

  event.waitUntil(
    self.clients.matchAll().then(function (clientList) {
      console.log('There are ' + clientList.length + ' client(s)');
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return self.clients.openWindow(
        '/?params=' + event.notification.data
      );
    })
  );
});

self.addEventListener('push', function (event) {
  console.log('Received a push message', event);
  if (event.data) {
    // Payload data available, we notify directly
    console.log(event.data.json().customData);
    event.waitUntil(showNotification(event.data.json().text));
  } else {
    // Payload not available, we need to download the message somehow (fetch?)
    // if not, we must show a generic notification
    event.waitUntil(
      showNotification('We have something new for you')
    );
  }
});

function showNotification(text) {
  self.registration.showNotification('Frontend Masters', {
    body: text,
    // dir: "auto|rtl|ltr",
    actions: [
      {
        action: 'action-yes',
        title: 'Yes',
        icon: 'http://localhost:4000/images/action_yes.png',
      },
      {
        action: 'action-no',
        title: 'No',
        icon: 'http://localhost:4000/images/action_no.png',
      },
    ],
    icon: 'http://localhost:4000/images/icon.png',
    badge: 'http://localhost:4000/images/badge.png',
    // image: "https://...",
    vibrate: [100, 50, 100, 50, 100],
    // sound: "https://",
    tag: 'notification-id-tag',
    data: '???',
    timestamp: 2342342343,
    requireInteraction: true,
    renotify: true,
    silent: false,
  });
}
