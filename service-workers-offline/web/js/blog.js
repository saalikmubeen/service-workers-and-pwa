(function Blog(global) {
  'use strict';

  var offlineIcon;

  // Check if the browser is online
  var isOnline = 'onLine' in navigator && navigator.onLine;

  var isLoggedIn = /isLoggedIn=1/.test(
    document.cookie.toString() || ''
  );
  var usingSW = 'serviceWorker' in navigator;
  var swRegistration;
  var svcworker;

  if (usingSW) {
    initServiceWorker().catch(console.error);
  }

  global.isBlogOnline = isBlogOnline;

  document.addEventListener('DOMContentLoaded', ready, false);

  // **********************************

  function ready() {
    offlineIcon = document.getElementById('connectivity-status');

    if (!isOnline) {
      offlineIcon.classList.remove('hidden');
    }

    // Add event listeners for online and offline events (when the browser goes online or offline)
    window.addEventListener(
      'online',
      function online() {
        offlineIcon.classList.add('hidden');
        isOnline = true;
        sendStatusUpdate();
      },
      false
    );
    window.addEventListener(
      'offline',
      function offline() {
        offlineIcon.classList.remove('hidden');
        isOnline = false;
        sendStatusUpdate();
      },
      false
    );
  }

  function isBlogOnline() {
    return isOnline;
  }

  async function initServiceWorker() {
    // If we load the service worker as "/js/sw.js" which were it's actually located, the service worker
    // will only be able to control or handle requests for files that are in the same directory or subdirectory
    // as the service worker itself. But we want the service worker to be able to control or handle requests
    // for all the files in the web root directory. So we want to load it like "/sw.js" which is the root
    // directory of the web app. Even though we want to locate it inside the "/js" directory, to be able to
    // do that i.e load it like "/sw.js" and still locate it inside the "/js" directory, we need to
    // take care of this thing on the server side using URL rewriting such that /sw.js actually loads
    // the service worker from /js/sw.js. The another simple way to avoid this is to locate the service worker
    // in the root directory of the web app and not nest it inside the "/js" directory.
    // requests
    swRegistration = await navigator.serviceWorker.register(
      '/sw.js',
      // The browser always checks for the new service worker every page load it unconditionally checks for
      // the new service worker to see if it's different from the old one. So if you want to make an
      // update to the service worker for your users, you can just update the service worker file by for example
      // changing a comment in the service worker file or changing the version number in the service worker file
      // and the browser will automatically check for the new service worker on the next page load.
      {
        updateViaCache: 'none', // don't update the service worker via cache, always check for updates on the server
      }
    );

    svcworker =
      swRegistration.installing ||
      swRegistration.waiting ||
      swRegistration.active;
    sendStatusUpdate(svcworker);

    // listen for new service worker to take over
    // When a new service worker takes over(when the new updated service worker is installed and activated
    // in place of the old service worker), the controllerchange event is fired, so listen for this event
    navigator.serviceWorker.addEventListener(
      'controllerchange',
      async function onController() {
        // The new service worker has taken over so assign the new service worker to svcworker
        svcworker = navigator.serviceWorker.controller;

        // send the status update to the new service worker thread that has taken over
        sendStatusUpdate(svcworker);
      }
    );

    // listen for messages from the service worker
    // The service worker attached to this tab/page can send messages to this page/tab and this page/tab
    // can send messages to the service worker. So we need to listen for messages from the service worker
    // and send messages to the service worker. The service worker can be communicating with multiple clients.
    navigator.serviceWorker.addEventListener(
      'message',
      onSWMessage,
      false
    );
  }

  function onSWMessage(evt) {
    var { data } = evt;

    // The page receives a message from the service worker requesting a status update
    // about the online status and the login status
    if (data.statusUpdateRequest) {
      console.log(
        'Status update requested from service worker, responding...'
      );

      // Since the service worker can be communicating with multiple clients (tabs, or pages), the service worker
      // can send a message to the client that it requested the status update from  by sending the message
      // to the port that is associated with that specific client/tab. Service worker uses the
      // MessageChannel API to make these connections and communications. It ends up creating a unique
      // set of ports that those communications can happen over. So message channel comes up with unique
      // set of ports for that communication to happen, which means we need to send ours to that port.
      // So for each client that is communicating with the service worker, the service worker will have
      // a unique set of ports that it can communicate with that client over.

      // MessageChannel API:
      // const messageChannel = new MessageChannel();
      // const port1 = messageChannel.port1;
      // const port2 = messageChannel.port2;

      // port1 = evt.ports[0] and port2 = evt.ports[1]
      // port1 is how service worker receive messages, so this page/tab is gonna send on port1
      // port2 is how you this page/tab receive messages, so service worker will send messages to
      // this page/tab on port2

      // Send the status update to the service worker through the port by which the service worker
      // is associated with this page/tab.
      sendStatusUpdate(evt.ports && evt.ports[0]);
    } else if (data == 'force-logout') {
      // receive a message from the service worker to force a logout
      document.cookie = 'isLoggedIn='; // clear the isLoggedIn cookie
      isLoggedIn = false;
      sendStatusUpdate(); // send the status update to the service worker that the user is logged out
    }
  }

  function sendStatusUpdate(target) {
    sendSWMessage({ statusUpdate: { isOnline, isLoggedIn } }, target);
  }

  function sendSWMessage(msg, target) {
    if (target) {
      target.postMessage(msg);
    } else if (svcworker) {
      svcworker.postMessage(msg);
    } else if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage(msg);
    }
  }
})(window);
