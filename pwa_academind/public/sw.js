importScripts('/src/js/idb.js');
importScripts('/src/js/utility.js');

var CACHE_STATIC_NAME = 'static-v40';
var CACHE_DYNAMIC_NAME = 'dynamic-v3';
var STATIC_FILES = [
  '/',
  '/index.html',
  '/offline.html',
  '/src/js/app.js',
  '/src/js/utility.js',
  '/src/js/feed.js',
  '/src/js/idb.js',
  '/src/js/promise.js',
  '/src/js/fetch.js',
  '/src/js/material.min.js',
  '/src/css/app.css',
  '/src/css/feed.css',
  '/src/images/main-image.jpg',
  'https://fonts.googleapis.com/css?family=Roboto:400,700',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css',
];

// function trimCache(cacheName, maxItems) {
//   caches.open(cacheName)
//     .then(function (cache) {
//       return cache.keys()
//         .then(function (keys) {
//           if (keys.length > maxItems) {
//             cache.delete(keys[0])
//               .then(trimCache(cacheName, maxItems));
//           }
//         });
//     })
// }

self.addEventListener('install', function (event) {
  console.log(
    '[Service Worker] Installing Service Worker ...',
    event
  );
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME).then(function (cache) {
      console.log('[Service Worker] Precaching App Shell');
      cache.addAll(STATIC_FILES);
    })
  );
});

self.addEventListener('activate', function (event) {
  console.log(
    '[Service Worker] Activating Service Worker ....',
    event
  );
  event.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(
        keyList.map(function (key) {
          if (
            key !== CACHE_STATIC_NAME &&
            key !== CACHE_DYNAMIC_NAME
          ) {
            console.log('[Service Worker] Removing old cache.', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

function isInArray(string, array) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] === string) {
      return true;
    }
  }
  return false;
}

self.addEventListener('fetch', function (event) {
  var url = 'https://pwagram-99adf.firebaseio.com/posts';
  if (event.request.url.indexOf(url) > -1) {
    event.respondWith(
      fetch(event.request).then(function (res) {
        var clonedRes = res.clone();
        clearAllData('posts')
          .then(function () {
            return clonedRes.json();
          })
          .then(function (data) {
            for (var key in data) {
              writeData('posts', data[key]);
            }
          });
        return res;
      })
    );
  } else if (isInArray(event.request.url, STATIC_FILES)) {
    event.respondWith(caches.match(event.request));
  } else {
    event.respondWith(
      caches.match(event.request).then(function (response) {
        if (response) {
          return response;
        } else {
          return fetch(event.request)
            .then(function (res) {
              return caches
                .open(CACHE_DYNAMIC_NAME)
                .then(function (cache) {
                  // trimCache(CACHE_DYNAMIC_NAME, 3);
                  cache.put(event.request.url, res.clone());
                  return res;
                });
            })
            .catch(function (err) {
              return caches
                .open(CACHE_STATIC_NAME)
                .then(function (cache) {
                  if (
                    event.request.headers
                      .get('accept')
                      .includes('text/html')
                  ) {
                    return cache.match('/offline.html');
                  }
                });
            });
        }
      })
    );
  }
});

// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     caches.match(event.request)
//       .then(function(response) {
//         if (response) {
//           return response;
//         } else {
//           return fetch(event.request)
//             .then(function(res) {
//               return caches.open(CACHE_DYNAMIC_NAME)
//                 .then(function(cache) {
//                   cache.put(event.request.url, res.clone());
//                   return res;
//                 })
//             })
//             .catch(function(err) {
//               return caches.open(CACHE_STATIC_NAME)
//                 .then(function(cache) {
//                   return cache.match('/offline.html');
//                 });
//             });
//         }
//       })
//   );
// });

// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     fetch(event.request)
//       .then(function(res) {
//         return caches.open(CACHE_DYNAMIC_NAME)
//                 .then(function(cache) {
//                   cache.put(event.request.url, res.clone());
//                   return res;
//                 })
//       })
//       .catch(function(err) {
//         return caches.match(event.request);
//       })
//   );
// });

// Cache-only
// self.addEventListener('fetch', function (event) {
//   event.respondWith(
//     caches.match(event.request)
//   );
// });

// Network-only
// self.addEventListener('fetch', function (event) {
//   event.respondWith(
//     fetch(event.request)
//   );
// });

// The sync event is designed to fire when the browser detects that the device has a stable
// internet connection, which typically happens when the app is in the background or when the
// user reconnects to the internet. The service worker will keep the event in a queue until the
// browser detects a stable internet connection and will kepp trying to send the data to the server
// and to make the network request until it succeeds.
self.addEventListener('sync', function (event) {
  console.log('[Service Worker] Background syncing', event);
  if (event.tag === 'sync-new-posts') {
    console.log('[Service Worker] Syncing new Posts');
    event.waitUntil(
      readAllData('sync-posts').then(function (data) {
        for (var dt of data) {
          var postData = new FormData();
          postData.append('id', dt.id);
          postData.append('title', dt.title);
          postData.append('location', dt.location);
          postData.append('rawLocationLat', dt.rawLocation.lat);
          postData.append('rawLocationLng', dt.rawLocation.lng);
          postData.append('file', dt.picture, dt.id + '.png');

          fetch(
            'https://us-central1-pwagram-99adf.cloudfunctions.net/storePostData',
            {
              method: 'POST',
              body: postData,
            }
          )
            .then(function (res) {
              console.log('Sent data', res);
              if (res.ok) {
                res.json().then(function (resData) {
                  // After sending the data to the server, we can remove it from the IndexedDB
                  deleteItemFromData('sync-posts', resData.id);
                });
              }
            })
            .catch(function (err) {
              console.log('Error while sending data', err);
            });
        }
      })
    );
  }
});

self.addEventListener('notificationclick', function (event) {
  var notification = event.notification; // Retrieve the clicked notification
  var action = event.action; // Retrieve the action (button) clicked, if any
  // var data = event.data; // Retrieve the data passed to the notification
  // var tag = event.tag; // Retrieve the tag of the notification

  console.log(notification);

  // Handling specific actions based on their IDs
  if (action === 'confirm') {
    console.log('Confirm was chosen');
    notification.close();
  } else {
    // the whole notification was clicked and not a specific action
    console.log(action);
    event.waitUntil(
      clients.matchAll().then(function (clis) {
        var client = clis.find(function (c) {
          return c.visibilityState === 'visible'; // Find a visible client i.e a client that is open
        });

        // if a tab exists (TAB is open), navigate to the URL
        if (client !== undefined) {
          client.navigate(notification.data.url);
          client.focus();
        } else {
          // if no client/tab is open, open a new one
          // clients.openWindow, this is the only place in the service worker where they have the permission and
          // we can open a new window i.e within a notification click event, otherwise service workers are
          // not allowed to open new windows as they run in the background and are not directly connected
          // to the DOM.
          clients.openWindow(notification.data.url);
        }
        notification.close();
      })
    );
  }
});

self.addEventListener('notificationclose', function (event) {
  console.log('Notification was closed', event);
});

// The push event is fired when a push message is received from the server.
// Push messages can arrive when a web app is active or when it's closed.
self.addEventListener('push', function (event) {
  console.log('Push Notification received', event);

  // You are not forced to notify the user with the payload's body that you receive from the server,
  //  but you are forced to notify something.
  var data = {
    title: 'New!',
    content: 'Something new happened!',
    openUrl: '/',
  };

  if (event.data) {
    data = JSON.parse(event.data.text()); // event.data.json();
  }

  var options = {
    body: data.content,
    icon: '/src/images/icons/app-icon-96x96.png',
    badge: '/src/images/icons/app-icon-96x96.png',
    data: {
      url: data.openUrl,
    },
  };

  /*
  const options = {
    body: event.data.json().content,
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
    badge: 'http://localhost:4000/images/badge.png', // The little icon that appears on the Android status or notification bar (Android only)
    // image: "https://...",
    vibrate: [100, 50, 100, 50, 100], // vibrate for 100ms, pause for 50ms, then vibrate for 100ms (Android only)
    // sound: "https://",
    tag: 'notification-id-tag',
    data: '???',
    timestamp: 2342342343, // The time the notification was created
    requireInteraction: true,
    renotify: true,
    silent: false, // If set to true, the notification will not make a sound or vibrate
  };

  */

  // The event.waitUntil() ensures the service worker remains active until the notification is displayed.
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});
