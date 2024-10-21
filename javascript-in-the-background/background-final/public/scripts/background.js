// Page Visibility API
let backgroundInitialTime;

/*
* Visibility Change Event:

The code listens for visibility changes on the window object and checks the visibilityState on the document.
If the state is "hidden", it indicates that the app is going into the background.
Unknown Background Conditions:
The app might be running in different background contexts:
  A background tab
  A background window
  The user closing the whole browser
However, the specific reason for the app going to the background is not clear,
so we only know that the app is not in the foreground and that's all we need to know about.



* Browser Process Termination:
Scenario: If the browser process is forcefully killed (e.g., by ending it through a Task Manager),
          the visibilitychange event won't fire.
Explanation: When the browser or a specific tab is forcefully closed, the application doesn’t get
              a chance to execute any cleanup or event handling code. As a result, any logic that you
              want to run when a user moves away from your page (such as saving data or stopping timers)
              won’t execute because the process is terminated abruptly.
Impact: Your app won’t be able to handle any background tasks or data persistence in such cases,
        so it's important to consider this limitation in your design.


* Mobile vs. Desktop
On mobile devices, apps are often suspended and removed from memory when the user switches apps,
so you need to design with this in mind:

1. Mobile apps often restore state automatically, regardless of whether the app was closed or switched away.
  It’s common for mobile apps to "save user data" and "reload state" when they reopen.

2. On web apps (especially desktop), restoring state isn’t as common on full navigation(when user hits
    enter in the url bar) because websites tend to treat every new visit as a fresh session.
    However, you can choose to replicate the mobile behavior by saving session state and restoring it
    when the user returns even on full page navigation/refresh.

Example (Mobile UX Pattern):
Think about how a mobile app like Instagram works. If you exit the app and come back a few minutes later,
it shows you the same place you were last viewing, unless a significant amount of time has passed.
This state restoration ensures a seamless user experience.



* Understanding Chrome Discards
Chrome has a built-in memory management feature where tabs can be discarded when the system is running
out of memory (RAM). Discarding a tab means completely unloading it from memory while leaving it in the
tab bar. The next time the user switches back to that tab, it will reload from scratch, losing its previous
state unless the app saved the data before.

How to Check Tab Discards:

You can manually check which tabs are discarded by visiting a special Chrome URL:
  Open a new Chrome tab and go to chrome://discards/.
  You’ll see a list of all open tabs and their status, including whether they’ve been discarded.

The Discard Interface:
  The interface shows information such as for each open tab:
      Visibility state: Whether the tab is currently "visible" or "hidden".
      Loading state: Whether the page is currently loading or fully loaded. ("unloaded", "loading", loaded")
                      "unloaded" means the tab is discarded.
      Lifecycle state: Whether the tab is active, discarded, or suspended. ("discarded", "hidden", active")
      Discard count: How many times the tab has been discarded.
      Tab URL: The URL of the tab.
      Tab title: The title of the tab.
      Last active: The last time the tab was active.
      Actions: You can manually discard or undiscard tabs from this interface.
      Site Engagement Score: A score that determines user engagement with the site, activity on a site
                            increases the score, up to some maximum amount per day. The score is used to
                            determine how often the site is allowed to run (periodic) background tasks.

Example Use Case:

Let’s say you have 20 tabs open, and Chrome decides to discard some inactive ones because the system
is running out of memory. When you return to a discarded tab, it will reload from scratch.
If your web app didn’t save the state before the discard (using the freeze event, for example),
the user might lose any unsaved data.

Using "The Great Discarder" Extension:
https://chromewebstore.google.com/detail/the-great-er-discarder-er/plpkmjcnhhnpkblimgenmdhghfgghdpp
"The Great Discarder" is an extension for Chromium browsers that helps users manually discard tabs to
free up memory. This can be useful when you’re running a lot of tabs and want to optimize memory
usage proactively.

How to Use "The Great Discarder":
Install the extension and pin it to your toolbar.
When you want to free up memory, click on the extension and choose which tabs to discard.
The extension will discard the selected tabs, and they will only reload when you revisit them.


*/

// Listen for visibility change events
window.addEventListener('visibilitychange', (event) => {
  // If the app is going to the background
  if (document.visibilityState === 'hidden') {
    const now = new Date().toLocaleTimeString();
    log(`Going to the background at ${now}`);
    backgroundInitialTime = performance.now();

    // Save the state of the app or any important data before it goes to the background
  } else {
    // If the app is coming back from the background to the foreground

    // Calculate the time elapsed between the time the app went to the background
    // and the time it came back to the foreground in seconds
    const timeElapsed = parseInt(
      (performance.now() - backgroundInitialTime) / 1000
    );
    log(`Back from the background after ${timeElapsed}s`);

    // Restore the state of the app when it comes back to the foreground
    // Using the saved timestamp, you can decide whether to restore the state using
    // the data read from the indexdDB/localStorage or start a completely new navigation.
  }
});

// ** Check if the browser supports the Page Lifecycle API
// The Page Lifecycle API is supported on Chromium-based browsers (e.g., Google Chrome, Brave).
//  Other browsers like Firefox or Safari may not support it fully or behave differently.
if ('onfreeze' in document) {
  // Event listener for when the page is about to freeze
  // This event signals that the browser is about to freeze (suspend) the tab.
  // This is the last opportunity for the page to save any important data before execution stops.
  // After this event, the page will be frozen and won't execute any code. So this is the last
  // chance to save any important data before the page is frozen.
  document.addEventListener('freeze', () => {
    console.log('Tab is about to freeze, save your data now!');
    // Save important data, like form inputs or user state
    saveData();
  });

  // Event listener for when the page resumes from a frozen state
  // This event fires when a frozen tab is brought back to life (unfrozen) and becomes active again.
  // When the user comes back, everything remains intact because the tab wasn’t fully discarded, it was
  // only suspended.  The resume event triggers, and all the context—such as global variables,
  // cursor position, and form inputs are still preserved. There is no need to restore the state
  // from scratch because the data is still in memory.
  // The resume event in the Page Lifecycle API only fires if the tab or app was suspended but
  // still remained in memory. When a suspended tab is brought back into focus, the resume event
  // triggers because the app is resuming from suspension without having been discarded.

  document.addEventListener('resume', () => {
    console.log('Tab has resumed from frozen state');
    // No need to restore data, it's still in memory
  });
}

// If the tab was discarded, the resume event will not fire. Instead, the page will undergo
// a full reload, and events like DOMContentLoaded or load will trigger. In this case, you can
// check the wasDiscarded property to know if the tab was discarded and decide if the state
// needs to be restored.
window.addEventListener('DOMContentLoaded', (event) => {
  if (document.wasDiscarded) {
    console.log('Tab was discarded');
    // We are back from suspension, but the page was discarded fully
    // Restore data or reinitialize the app
    restoreData(); // by maybe reading the state from localStorage/indexedDB that you saved when the page was about to freeze
  }
});

// Function to simulate data saving
// Save user data (like form inputs, scroll position, etc.) periodically to storage like localStorage or
// IndexedDB. This way, if the tab is discarded, you can restore the state when the page reloads.
// On mobile web apps, design your app to restore the user's state by default, even after the app was
// closed or suspended.
function saveData() {
  // Save critical information like form data or app state
  localStorage.setItem('importantData', 'user input or state');
}

// Function to simulate data restoration
function restoreData() {
  let data = localStorage.getItem('importantData');
  if (data) {
    console.log('Restored data:', data);
  }
}

// * Beacon API, it's available in all modern browsers.
// If our web app goes to the background while a network request is in process, it may be
// aborted by the browser. To prevent this, we can use the Beacon API to send data in the
// background. The Beacon API allows you to send data to the server asynchronously without
// blocking the main thread. This is useful for sending analytics data, logging, or any
// other data that needs to be sent to the server without being affected by the page lifecycle.
// This is for requests, where we don't care about the response, we ignore the response.
// If you close the tab or the browser, the browser will add the request to a queue of beacons
// to be sent later. The browser will send the request when it can, even if the page is closed.
// And even if I kill the browser's process, it will still be in the queue and will be sent
// the next time the browser is opened.
// But you cannot set your own http headers or control the request in any way.
document
  .getElementById('btnBeacon')
  .addEventListener('click', (event) => {
    const data = { message: 'Hey from the browser! ' };

    // To send or set appropriate headers, you can use the Blob API to create a blob object
    const blob = new Blob([JSON.stringify(data)], {
      type: 'application/json',
    });

    // /log is the endpoint on the server where the data will be sent
    navigator.sendBeacon('/log', blob);
  });

// Background Sync
document
  .getElementById('btnSync')
  .addEventListener('click', async (event) => {
    if ('SyncManager' in window) {
      // Store the data in the indexedDB

      const registration = await navigator.serviceWorker.ready;
      registration.sync.register('mySyncTag');
    } else {
      log('Background sync not available');
    }
  });

// ** Background Periodic Sync
// PWA can register a periodic sync task that runs at regular intervals, even when the app is not open.
// When registering a periodic sync task, PWA asks the user for permission to periodically execute
// code in the background. This is useful for tasks like syncing data, fetching updates, or sending
// analytics data at regular intervals, if battery and network conditions are met.
// Right now, chrome fires the periodic sync task with the maximum of once every 12 hours.
// Execution frequency will be honored based on a 'Site Engagement Score' (a double from 0-100)
// defined by the browser, (background execution rights are granted based on an app engagement score on
// IOS native apps).
document
  .getElementById('btnPeriodicSync')
  .addEventListener('click', async (event) => {
    const registration = await navigator.serviceWorker.ready;
    if ('periodicSync' in registration) {
      // This is actually reuesting the permission to the browser, not really to the user.
      // The user will never see a dialog asking for permission to run the periodic sync task.
      const permissionStatus = await navigator.permissions.query({
        name: 'periodic-background-sync',
      });
      if (permissionStatus.state === 'granted') {
        log('Periodic Background Sync granted');
      } else {
        log('Periodic Background Sync denied');
      }

      try {
        // If permission is granted, register the periodic sync task.
        // Every 24 hours, the service worker will wake up and run the code inside the sync event.

        if (!registration.periodicSync) {
          log('Periodic Background Sync not available');
          return;
        }

        await registration.periodicSync.register('periodic', {
          minInterval: 24 * 60 * 60 * 1000, // One day in milliseconds
        });
        log('Periodic Background Sync registered');
      } catch (error) {
        log('Periodic Background Sync not registered');
      }
    } else {
      log('Periodic Background Sync not available');
    }
  });

// ** Background Fetch
// The API is currently available only in Chromium-based browsers.
// Background Fetch enables the downloading of files separate from the app's main UI, allowing the
// process to continue even if the user closes the app or browser.
// Files are not saved to the file system; instead, they are downloaded to the app itself and
// handled and received by the service worker. When the download is complete, the service worker
// is notified by an event, and the service worker can then handle the downloaded files as needed:
//          - backgroundfetchsuccess: Triggered when all files are downloaded.
//          - backgroundfetchfailure: Triggered if the download fails.
//          - backgroundfetchclick: Triggered when the user clicks the notification.
// The download continues even if the app is closed, and the service worker will be woken up once the
// download is finished. Developers can manage downloaded files in the service worker, including parsing
// or storing them in cache storage.
// Users receive OS notifications about the download process. On Android, a fixed notification is
// shown that cannot be cleared until the download completes.
// Multiple events can be fired in the service worker, including download progress, success, failure,
// and user interaction with notifications.
// The functionality for uploading files is not yet available, but the Chrome team is working on it.

// The alternative of this for other browsers is to download the files with a fetch in the service worker
// and then communicate with the main thread to show a notification to the user with messages API.
// The problem is that if it takes a day to download and receive the file from the server, probably the
// browser will kill the service worker before the file arrives. With the Background Fetch API, the
// browser will still kill the service worker, but the browser will keep downloading the file in the
// background even if it takes a day and will wake up the service worker when the download is complete.
document
  .getElementById('btnFetch')
  .addEventListener('click', async (event) => {
    const registration = await navigator.serviceWorker.ready;
    if ('backgroundFetch' in registration) {
      const fetch = await registration.backgroundFetch.fetch(
        'media', // Unique name for the fetch
        ['/media/audio.mp3', '/media/video.mp4'], // Array of URLs to download

        // Metadata for notification
        {
          title: 'Frontend Masters Media files',
          icons: [
            {
              src: '/media/thumb.png',
              sizes: '800x800',
              type: 'image/png',
            },
          ],
        }
      );
      log('Background Fetch registered');
    } else {
      log('Background Fetch not available');
    }
  });
