module.exports = {
  "globDirectory": "public/",

  // Files to cache
  "globPatterns": [
    "**/*.{html,ico,json,css,js}",
    "src/images/*.{jpg,png}"
  ],
  "swSrc": "public/sw-base.js",  // Your custom service worker file
  "swDest": "public/service-worker.js", // The file that will be generated by Workbox CLI
  "globIgnores": [
    "../workbox-cli-config.js",
    "help/**"
  ]
};