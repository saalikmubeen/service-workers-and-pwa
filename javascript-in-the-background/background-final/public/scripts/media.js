// * Media playing
document
  .getElementById('btnPlay')
  .addEventListener('click', (event) => {
    document.querySelector('audio').play();

    // What this does is it sets the metadata for the media session.
    // This is what the browser will show when the media is playing.
    // This allows the OS to show the media information in the lock screen, for example
    // and user can control the media from there and execute event listeners registered
    // here in the javascript code using the operating system's media controls.
    // The Media Session API allows interaction between web media elements and the operating system's
    // media controls (e.g., lock screen controls, smartwatches, etc.), so you control the
    // the media playing in web pages from the operating system's media controls.

    // Metadata such as the song title, artist, album, and artwork are set using navigator.mediaSession.metadata.
    // These fields are essential for displaying relevant information when playing media in the
    // background, allowing users to interact with the content without having the page in focus.
    navigator.mediaSession.metadata = new MediaMetadata({
      title: 'Too Much Funk', // required
      artist: 'Steve Oaks', // required
      album: 'Frontend Masters Greatest Hits',

      // required
      artwork: [
        {
          src: '/media/thumb.png',
          type: 'image/png',
          sizes: '800x800',
        },
      ],
    });
  });
document
  .getElementById('btnStop')
  .addEventListener('click', (event) => {
    document.querySelector('audio').pause();
  });

// * PiP (Picture-in-Picture)
// PiP allows playing videos in a floating window while the user continues to interact with other content
// or applications.
// PiP can stay active when switching tabs or minimizing the browser. It works across operating systems,
// both desktop and mobile (with some limitations on mobile).
// On compatible browsers, PiP can be automatically available for all videos, and users can toggle it
// even without any custom JavaScript.
// Media content (like music or video) can continue running smoothly in the background without
// being throttled, unlike regular background processes.
document
  .getElementById('btnPiP')
  .addEventListener('click', (event) => {
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture();
    } else if (document.pictureInPictureEnabled) {
      document.querySelector('video').requestPictureInPicture();
    }
  });
