'use strict';

importScripts('/js/external/idb-keyval-iife.min.js');

// As soon as we call regsiter in the main thread, the service worker file is downloaded and
// and loaded up in the browser in the background, it starts and runs this file/program. The service
// worker may not have finished it's installation, activation and all other stuff. So it's gonna stay
// running for the entirety of the time your page is up. I don't know any scenario where a browser kills a
// service worker while somebody's actually on the page. It keeps it alive while they are on the page. If
// they go away from the page, it still might be alive for for some 30 seconds.

// When you revisit the site and there is no new update to the service worker (meaning the file sw.js
//  has not changed), the service worker doesn’t go through the installation or activation process again.
// These lifecycle events only run when a new service worker is being installed or updated.
// The service worker file (sw.js) is already registered and in use, so it doesn't need to reinstall
// or reactivate. However, the service worker script is loaded into memory and begins execution, just like
// any other script that runs when you open a web page.
// All the global variables and code in the service worker are reinitialized every time the page loads.
// This means that even though install and activate events don’t run, the code inside the service worker
// itself (e.g., top-level code outside event listeners) runs from scratch each time the service worker
// starts executing.

var version = 8;
var isOnline = true;
var isLoggedIn = false;
var cacheName = `ramblings-${version}`;
var allPostsCaching = false;

// Serice workers can't access the DOM, neither localStorage nor sessionStorage
// Localstorage and sessionStorage are synchronous APIs, they are blocking APIs, they take the
// thread and they don't release it until they are done. Localstorage typically has a limit of 5MB
// of data that you can store in it and sessionStorage has a limit of 12MB of data that you can store in it.
// So we should try avoiding using localstorage and sessionStorage in out applications moving foeward.

// Servive Worker:
// A JavaScript file running in its own thread that will act as a middleware offering a local installed
// web server or web proxy for your PWA, including resources and API calls

var urlsToCache = {
  loggedOut: [
    '/',
    '/about',
    '/contact',
    '/404',
    '/login',
    '/offline',
    '/css/style.css',
    '/js/blog.js',
    '/js/home.js',
    '/js/login.js',
    '/js/add-post.js',
    '/js/external/idb-keyval-iife.min.js',
    '/images/logo.gif',
    '/images/offline.png',
  ],
};

// Runs each time a new service worker is installed. Each service worker refers to the unique
// combination of bits that make up the service worker file. If the service worker file changes even
// by a single bit like adding a comment, it will be considered a new service worker and will be
// installed again. The service worker will be installed but not activated until all tabs that are
// currently open are closed and the new service worker is ready to take over.
self.addEventListener('install', onInstall);

// You can only have one service worker active at a time. When a new service worker is installed, it
// will not take over until all tabs that are currently open are closed and the new service worker is
// ready to take over. This event is fired when the service worker is activated and is ready to take
// over the current service worker. This is where you want to clean up old caches, take control of
// all clients(tabs) that are currently open and using the old service worker, and start any background
// processes like caching all the posts.
self.addEventListener('activate', onActivate);
self.addEventListener('message', onMessage);
self.addEventListener('fetch', onFetch);

// This runs everytime the service worker is started even if it's already installed
main().catch(console.error);

// ****************************

// This runs everytime the servicee worker is started even if it's already installed
async function main() {
  console.log(`Service Worker (v${version}) is starting...`);

  // Send message to the main application thread when the service worker starts to
  // ask for the satus of login and online.
  await sendMessage({ statusUpdateRequest: true });
  await cacheLoggedOutFiles();
  return cacheAllPosts();
}

function onInstall(evt) {
  console.log(`Service Worker (v${version}) installed`);

  // This will skip the waiting phase and activate the service worker immediately after installation
  self.skipWaiting();
}

function onActivate(evt) {
  // wait until the handleActivation() function is done executing before you decide to shut
  // down the service worker (because service workers are terminated by the browser anytime
  // when they are not in use)
  evt.waitUntil(handleActivation());
}

async function handleActivation() {
  // clear old caches (any cache key that is not the current version) before activating the new
  // service worker version
  // We are clearing the old caches because we have been activated which lets us know that the old
  // service worker is no longer in use and is deactivated and no longer using any of those resources.
  // It'd be a really bad idea to delete the cache during installation because the old service worker
  // might still be using those resources and we could crash something.
  await clearCaches();

  // cache all logged out files on service worker activation
  await cacheLoggedOutFiles(/*forceReload=*/ true);

  // take control of all clients(tabs) that are currently open and using the old service worker
  // This will cause the old service worker to be terminated and the new service worker to take over
  // This is done to ensure that the new service worker is in control of all the clients that are
  // currently open. This will fire the "controllerchange" event in the main thread.
  await clients.claim();
  console.log(`Service Worker (v${version}) activated`);

  // spin off background caching of all past posts (over time)
  cacheAllPosts(/*forceReload=*/ true).catch(console.error);
}

// clear old caches (any cache key that is not the current version)
async function clearCaches() {
  var cacheNames = await caches.keys();
  var oldCacheNames = cacheNames.filter(function matchOldCache(
    cacheName
  ) {
    // find the cache key that has the pattern of ramblings-<number> and that number is not
    // the current version
    var [, cacheNameVersion] =
      cacheName.match(/^ramblings-(\d+)$/) || [];
    cacheNameVersion =
      cacheNameVersion != null
        ? Number(cacheNameVersion)
        : cacheNameVersion;
    return cacheNameVersion > 0 && version !== cacheNameVersion;
  });
  await Promise.all(
    oldCacheNames.map(function deleteCache(cacheName) {
      return caches.delete(cacheName);
    })
  );
}

async function cacheLoggedOutFiles(forceReload = false) {
  var cache = await caches.open(cacheName);

  return Promise.all(
    urlsToCache.loggedOut.map(async function requestFile(url) {
      try {
        let res;

        if (!forceReload) {
          res = await cache.match(url);
          if (res) {
            return;
          }
        }

        let fetchOptions = {
          method: 'GET',
          // don't use the cache as we don't want browser to store this response in it's
          // intermediary cache, we want fresh response from the server, we are making the AJAX
          // request and we really want to get the latest data from the server not from intermediary
          // cache of the browser.
          cache: 'no-store',
          credentials: 'omit', // don't need cookies as it's a public resource
        };
        res = await fetch(url, fetchOptions);
        if (res.ok) {
          // If you cache something that is not a Response object and also return it to the
          // browser at the same time, you have to clone the thing you put in the cache and return
          // the original response. If you don't you get these weird errors about the headers
          // already being closed. Response can only be used/read once.

          // A Response object represents the response to a request made by the Fetch API.
          // Once a Response has been read (for example, by calling response.json() or response.text()),
          // it cannot be read again. This means you cannot use the same response object in multiple
          // places without cloning it first.
          // The body of a Response is a stream, which can be consumed only once. When you read from the
          // response body, it is consumed and cannot be accessed again. This is why cloning is essential
          // if you want to use the response for both caching and serving it to the client.
          // When you want to cache a response and also return it to the calling code,
          // you need to clone the response
          // return cache.put(url, res.clone());
          return cache.put(url, res);
        }
      } catch (err) {}
    })
  );
}

async function cacheAllPosts(forceReload = false) {
  // already caching the posts?
  // if allPostsCaching is true, then we are already in the process of caching all the posts
  // so we don't want to start caching all the posts again, we want to wait until the current
  // process of caching all the posts is done.
  if (allPostsCaching) {
    return;
  }

  // set allPostsCaching to true to indicate that we are currently caching all the posts
  allPostsCaching = true;
  await delay(5000);

  var cache = await caches.open(cacheName);
  var postIDs;

  try {
    if (isOnline) {
      let fetchOptions = {
        method: 'GET',
        cache: 'no-store',
        credentials: 'omit',
      };
      let res = await fetch('/api/get-posts', fetchOptions);
      if (res && res.ok) {
        await cache.put('/api/get-posts', res.clone());
        postIDs = await res.json();
      }
    } else {
      let res = await cache.match('/api/get-posts');
      if (res) {
        let resCopy = res.clone();
        postIDs = await res.json();
      }
      // caching not started, try to start again (later)
      else {
        allPostsCaching = false;
        return cacheAllPosts(forceReload);
      }
    }
  } catch (err) {
    console.error(err);
  }

  if (postIDs && postIDs.length > 0) {
    return cachePost(postIDs.shift());
  } else {
    allPostsCaching = false;
  }

  // *************************

  async function cachePost(postID) {
    var postURL = `/post/${postID}`;
    var needCaching = true;

    if (!forceReload) {
      // check if post is already cached
      let res = await cache.match(postURL);
      if (res) {
        // if post is already cached, don't need to cache it again, so set needCaching to false
        needCaching = false;
      }
    }

    // if post is not cached i.e needCaching is true, then fetch the post from the server and cache it
    if (needCaching) {
      await delay(10000);
      if (isOnline) {
        try {
          let fetchOptions = {
            method: 'GET',
            cache: 'no-store',
            credentials: 'omit',
          };
          let res = await fetch(postURL, fetchOptions);
          if (res && res.ok) {
            await cache.put(postURL, res.clone());
            needCaching = false;
          }
        } catch (err) {}
      }

      // failed, try caching this post again?
      if (needCaching) {
        return cachePost(postID);
      }
    }

    // any more posts to cache?
    if (postIDs.length > 0) {
      // recursively cache the next post
      return cachePost(postIDs.shift());
    } else {
      // no more posts to cache, so set allPostsCaching to false
      // to indicate that we are done caching all the posts
      allPostsCaching = false;
    }
  }
}

// sendMessage is a function that sends a message to all the clients(tabs or pages) that are currently
// open and using the service worker. The service worker sends a message to all the clients requesting
// for a status update about the online status and the login status.
async function sendMessage(msg) {
  // There might me multiple clients(tabs or pages)
  var allClients = await clients.matchAll({
    includeUncontrolled: true,
  });

  // Post Messages in service workers are promise returning APIs

  return Promise.all(
    allClients.map(function sendTo(client) {
      var chan = new MessageChannel();
      chan.port1.onmessage = onMessage; // port1 is how I receive messages, so I'm gonna listen on port1
      return client.postMessage(msg, [chan.port2]); // port2 is how you receive messages, so I'm gonna send on port2
    })
  );
}

function onMessage({ data }) {
  if ('statusUpdate' in data) {
    ({ isOnline, isLoggedIn } = data.statusUpdate);
    console.log(
      `Service Worker (v${version}) status update... isOnline:${isOnline}, isLoggedIn:${isLoggedIn}`
    );
  }
}

function onFetch(evt) {
  evt.respondWith(router(evt.request));
}

async function router(req) {
  var url = new URL(req.url);
  var reqURL = url.pathname; // URL path only, like /about, /contact, /login, etc
  var cache = await caches.open(cacheName);

  // request for site's own URL?
  // is the web app making a request to the server that is hosting the web app?
  // (requests to our own server)
  if (url.origin == location.origin) {
    // are we making an API request?
    // if the URL path starts with /api/
    if (/^\/api\/.+$/.test(reqURL)) {
      let fetchOptions = {
        credentials: 'same-origin',
        cache: 'no-store',
      };
      let res = await safeRequest(
        reqURL,
        req,
        fetchOptions,
        /*cacheResponse=*/ false,
        /*checkCacheFirst=*/ false,
        /*checkCacheLast=*/ true,
        /*useRequestDirectly=*/ true
      );
      if (res) {
        // If we got a successful response from the server, we are going to cache the response
        // if the request method is GET. (dont't cache POST requests)
        if (req.method == 'GET') {
          await cache.put(reqURL, res.clone());
        }
        // clear offline-backup of successful post?
        // If we got the successful response from the server, and the request method is POST,
        // we are going to clear the offline backup of the post from the IndexedDB because the post
        // was successfully added to the server.
        // if the request URL is /api/add-post, then we are going to delete the offline backup
        // of the post from the IndexedDB because the post was successfully added to the server
        else if (reqURL == '/api/add-post') {
          await idbKeyval.del('add-post-backup');
        }
        return res;
      }

      return notFoundResponse();
    }

    // are we requesting a page? (an HTML file)
    else if (req.headers.get('Accept').includes('text/html')) {
      // login-aware requests?
      if (/^\/(?:login|logout|add-post)$/.test(reqURL)) {
        let res;

        if (reqURL == '/login') {
          // If user is online, let the request go through to the server and let
          // the server handle everything (user auth status, etc).
          if (isOnline) {
            let fetchOptions = {
              method: req.method,
              headers: req.headers,
              credentials: 'same-origin',
              cache: 'no-store',
              redirect: 'manual',
            };
            res = await safeRequest(reqURL, req, fetchOptions);
            if (res) {
              // server sets type to "opaqueredirect" when redirecting
              // so on the frontend we can redirect to the same URL as the server
              // would have redirected to. (we are trying to mimic the server as closely as possible)
              if (res.type == 'opaqueredirect') {
                return Response.redirect('/add-post', 307);
              }
              return res;
            }
            if (isLoggedIn) {
              return Response.redirect('/add-post', 307);
            }
            res = await cache.match('/login');
            if (res) {
              return res;
            }
            return Response.redirect('/', 307);
          } else if (isLoggedIn) {
            // If user is offline but logged in, redirect to add-post page
            return Response.redirect('/add-post', 307);
          } else {
            // If user is offline and not logged in, show login page from cache
            res = await cache.match('/login');
            if (res) {
              return res;
            }
            return cache.match('/offline');
          }
        } else if (reqURL == '/logout') {
          // If user is online, let the request go through to the server
          if (isOnline) {
            let fetchOptions = {
              method: req.method,
              headers: req.headers,
              credentials: 'same-origin',
              cache: 'no-store',
              redirect: 'manual',
            };
            res = await safeRequest(reqURL, req, fetchOptions);
            if (res) {
              // If the server is redirecting to /login, we want to redirect to /login as well
              if (res.type == 'opaqueredirect') {
                return Response.redirect('/', 307);
              }
              return res;
            }

            // If we are online but contacting the server failed:
            // If user is logged in, force logout  and redirect to home page
            if (isLoggedIn) {
              isLoggedIn = false;

              // Send message to all clients to force logout (clear session and delete cookies)
              await sendMessage('force-logout');
              await delay(100);
            }

            return Response.redirect('/', 307);
          } else if (isLoggedIn) {
            // If user is offline but logged in, force logout and redirect to home page
            isLoggedIn = false;
            await sendMessage('force-logout');
            await delay(100);
            return Response.redirect('/', 307);
          } else {
            // If user is offline and not logged in, redirect to home page
            return Response.redirect('/', 307);
          }
        } else if (reqURL == '/add-post') {
          if (isOnline) {
            // If user is online, let the request go through to the server
            let fetchOptions = {
              method: req.method,
              headers: req.headers,
              credentials: 'same-origin',
              cache: 'no-store',
            };
            res = await safeRequest(
              reqURL,
              req,
              fetchOptions,
              /*cacheResponse=*/ true
            );
            if (res) {
              return res;
            }
            res = await cache.match(
              isLoggedIn ? '/add-post' : '/login'
            );
            if (res) {
              return res;
            }
            return Response.redirect('/', 307);
          } else if (isLoggedIn) {
            // If user is offline but logged in, show add-post page from cache
            res = await cache.match('/add-post');
            if (res) {
              return res;
            }
            // If user is offline but logged in and add-post page is not in cache, show offline page
            return cache.match('/offline');
          } else {
            // If user is offline and not logged in, show login page from cache
            res = await cache.match('/login');
            if (res) {
              return res;
            }
            // If user is offline and not logged in and login page is not in cache, show offline page
            return cache.match('/offline');
          }
        }
      }
      // otherwise, just use "network-and-cache"
      else {
        let fetchOptions = {
          method: req.method,
          headers: req.headers,
          cache: 'no-store',
        };
        let res = await safeRequest(
          reqURL,
          req,
          fetchOptions,
          /*cacheResponse=*/ false,
          /*checkCacheFirst=*/ false,
          /*checkCacheLast=*/ true
        );
        if (res) {
          if (!res.headers.get('X-Not-Found')) {
            await cache.put(reqURL, res.clone());
          } else {
            await cache.delete(reqURL);
          }
          return res;
        }

        // otherwise, return an offline-friendly page
        return cache.match('/offline');
      }
    }
    // all other files use "cache-first"
    else {
      let fetchOptions = {
        method: req.method,
        headers: req.headers,
        cache: 'no-store',
      };
      let res = await safeRequest(
        reqURL,
        req,
        fetchOptions,
        /*cacheResponse=*/ true,
        /*checkCacheFirst=*/ true
      );
      if (res) {
        return res;
      }

      // otherwise, force a network-level 404 response
      return notFoundResponse();
    }
  }
}

async function safeRequest(
  reqURL,
  req,
  options,
  cacheResponse = false,
  checkCacheFirst = false,
  checkCacheLast = false,
  useRequestDirectly = false
) {
  var cache = await caches.open(cacheName);
  var res;

  if (checkCacheFirst) {
    res = await cache.match(reqURL);
    if (res) {
      return res;
    }
  }

  if (isOnline) {
    try {
      // If useRequestDirectly is true, we are going to use the request object directly to make the
      // request to the server. It's required when we are making a POST request to the server, we have to
      // use the request object directly instead of the URL because we have to pass the body of the request
      // as well.
      if (useRequestDirectly) {
        res = await fetch(req, options);
      } else {
        res = await fetch(req.url, options);
      }

      if (res && (res.ok || res.type == 'opaqueredirect')) {
        if (cacheResponse) {
          await cache.put(reqURL, res.clone());
        }
        return res;
      }
    } catch (err) {}
  }

  if (checkCacheLast) {
    res = await cache.match(reqURL);
    if (res) {
      return res;
    }
  }
}

function notFoundResponse() {
  return new Response('', {
    status: 404,
    statusText: 'Not Found',
  });
}

function delay(ms) {
  return new Promise(function c(res) {
    setTimeout(res, ms);
  });
}
