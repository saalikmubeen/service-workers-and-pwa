var functions = require('firebase-functions');
var admin = require('firebase-admin');
var cors = require('cors')({ origin: true });
var webpush = require('web-push');
var formidable = require('formidable');
var fs = require('fs');
var UUID = require('uuid-v4');
var os = require('os');
var Busboy = require('busboy');
var path = require('path');

// const vapidKeys = webPush.generateVAPIDKeys();

// console.log(vapidKeys.publicKey);  // Used in the frontend
// console.log(vapidKeys.privateKey); // Kept secret on your server

/*

VAPID (Voluntary Application Server Identification for Web Push)
VAPID is a protocol used to verify that the push messages come from a trusted server, your
application server. It’s a mechanism that allows the browser’s push service to verify that the
messages are legitimately coming from your app and not from a malicious source who has somehow
got access to user's subscription data.

How VAPID Works:

Public Key: This key is shared with the browser and included in the subscription.
            Since JavaScript is exposed to anyone who views your webpage, this key is not confidential.

Private Key: This is kept on your backend server and is used to sign push messages. It remains secret,
              ensuring only your server can send valid push messages.


The browser push service uses these keys to verify that the push messages are coming from the legitimate server.
If the signature created by the private key doesn’t match the public key, the browser rejects the message.

Why Use Public and Private Keys?

    Public Key: Think of it like a “lock.” Anyone can have a copy of the public key, but without the “key”
                (the private key), they can't generate a valid signature.
    Private Key: This is the “key” that allows your server to prove it is the rightful sender of push
                  messages. It must remain secret to prevent unauthorized messages from being sent.

JWT (JSON Web Tokens)
VAPID uses JWT to authenticate your server. A JWT is a token that contains information
(like your server’s identity) and is cryptographically signed by the private key. This signed token is
sent with every push message.

The push service validates the token to ensure that the message is coming from the correct server.
If the JWT is valid, the message is delivered to the user.

Base64 Encoding
The VAPID keys are base64-encoded strings, which is a format suitable for use in URLs or HTTP headers.
These encoded strings make the keys easier to handle in a web application.


web-push
While it's technically possible to manually generate VAPID keys and create the JWTs,
it’s complex and unnecessary. Libraries like web-push simplify the process by:

Generating VAPID keys for you.
Automatically creating and signing JWTs.
Sending push notifications to the browser’s push service.


Protecting Users
By implementing VAPID, you:

Ensure that only your server can send push notifications to your users, even if someone else knows
the subscription’s endpoint.
Prevent spam or malicious actors from abusing your push notification service.

*/

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions
//

var serviceAccount = require('./pwagram-fb-key.json');

var gcconfig = {
  projectId: 'YOUR_PROJECT_ID',
  keyFilename: 'pwagram-fb-key.json',
};

var gcs = require('@google-cloud/storage')(gcconfig);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://YOUR_PROJECT_ID.firebaseio.com/',
});

exports.storePostData = functions.https.onRequest(function (
  request,
  response
) {
  cors(request, response, function () {
    var uuid = UUID();

    const busboy = new Busboy({ headers: request.headers });
    // These objects will store the values (file + fields) extracted from busboy
    let upload;
    const fields = {};

    // This callback will be invoked for each file uploaded
    busboy.on(
      'file',
      (fieldname, file, filename, encoding, mimetype) => {
        console.log(
          `File [${fieldname}] filename: ${filename}, encoding: ${encoding}, mimetype: ${mimetype}`
        );
        const filepath = path.join(os.tmpdir(), filename);
        upload = { file: filepath, type: mimetype };
        file.pipe(fs.createWriteStream(filepath));
      }
    );

    // This will invoked on every field detected
    busboy.on(
      'field',
      function (
        fieldname,
        val,
        fieldnameTruncated,
        valTruncated,
        encoding,
        mimetype
      ) {
        fields[fieldname] = val;
      }
    );

    // This callback will be invoked after all uploaded files are saved.
    busboy.on('finish', () => {
      var bucket = gcs.bucket('YOUR_PROJECT_ID.appspot.com');
      bucket.upload(
        upload.file,
        {
          uploadType: 'media',
          metadata: {
            metadata: {
              contentType: upload.type,
              firebaseStorageDownloadTokens: uuid,
            },
          },
        },
        function (err, uploadedFile) {
          if (!err) {
            admin
              .database()
              .ref('posts')
              .push({
                title: fields.title,
                location: fields.location,
                rawLocation: {
                  lat: fields.rawLocationLat,
                  lng: fields.rawLocationLng,
                },
                image:
                  'https://firebasestorage.googleapis.com/v0/b/' +
                  bucket.name +
                  '/o/' +
                  encodeURIComponent(uploadedFile.name) +
                  '?alt=media&token=' +
                  uuid,
              })
              .then(function () {
                webpush.setVapidDetails(
                  'mailto:business@academind.com', // Your email
                  'BKapuZ3XLgt9UZhuEkodCrtnfBo9Smo-w1YXCIH8YidjHOFAU6XHpEnXefbuYslZY9vtlEnOAmU7Mc-kWh4gfmE', // Public Key
                  'AyVHwGh16Kfxrh5AU69E81nVWIKcUwR6a9f1X4zXT_s' // Private Key
                );
                return admin
                  .database()
                  .ref('subscriptions')
                  .once('value');
              })
              .then(function (subscriptions) {
                subscriptions.forEach(function (sub) {
                  var pushConfig = {
                    endpoint: sub.val().endpoint, // The endpoint that identifies a specific user on a specific browser on a specific device
                    // keys is used to encrypt the push message so that only the user's browser can decrypt it.
                    // The payload and the body of the push message are encrypted using the private key.
                    keys: {
                      auth: sub.val().keys.auth,
                      p256dh: sub.val().keys.p256dh,
                    },
                  };

                  webpush
                    .sendNotification(
                      pushConfig, // this is the subscription object of the user that we stored in the database
                      JSON.stringify({
                        title: 'New Post',
                        content: 'New Post added!',
                        openUrl: '/help',
                      })
                    )
                    .catch(function (err) {
                      console.log(err);
                    });
                });
                response
                  .status(201)
                  .json({ message: 'Data stored', id: fields.id });
              })
              .catch(function (err) {
                response.status(500).json({ error: err });
              });
          } else {
            console.log(err);
          }
        }
      );
    });

    // The raw bytes of the upload will be in request.rawBody.  Send it to busboy, and get
    // a callback when it's finished.
    busboy.end(request.rawBody);
    // formData.parse(request, function(err, fields, files) {
    //   fs.rename(files.file.path, "/tmp/" + files.file.name);
    //   var bucket = gcs.bucket("YOUR_PROJECT_ID.appspot.com");
    // });
  });
});
