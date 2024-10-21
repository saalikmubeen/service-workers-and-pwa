var dbPromise = idb.open('posts-store', 1, function (db) {
  if (!db.objectStoreNames.contains('posts')) {
    db.createObjectStore('posts', { keyPath: 'id' });
  }
  if (!db.objectStoreNames.contains('sync-posts')) {
    db.createObjectStore('sync-posts', { keyPath: 'id' });
  }
});

function writeData(st, data) {
  return dbPromise.then(function (db) {
    var tx = db.transaction(st, 'readwrite');
    var store = tx.objectStore(st);
    store.put(data);
    return tx.complete;
  });
}

function readAllData(st) {
  return dbPromise.then(function (db) {
    var tx = db.transaction(st, 'readonly');
    var store = tx.objectStore(st);
    return store.getAll();
  });
}

function clearAllData(st) {
  return dbPromise.then(function (db) {
    var tx = db.transaction(st, 'readwrite');
    var store = tx.objectStore(st);
    store.clear();
    return tx.complete;
  });
}

function deleteItemFromData(st, id) {
  dbPromise
    .then(function (db) {
      var tx = db.transaction(st, 'readwrite');
      var store = tx.objectStore(st);
      store.delete(id);
      return tx.complete;
    })
    .then(function () {
      console.log('Item deleted!');
    });
}

function urlBase64ToUint8Array(base64String) {
  var padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  var base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function dataURItoBlob(dataURI) {
  var byteString = atob(dataURI.split(',')[1]);
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  var blob = new Blob([ab], { type: mimeString });
  return blob;
}

// * IndexedDB
// Newer version of the idb library (wrapper for IndexedDB):
// Link to the idb library (wrapper for IndexedDB):
// <script src="https://cdn.jsdelivr.net/npm/idb@7/build/umd.js"></script>

// IndexedDB uses an event-driven API, but to simplify things, we can use modern promises and async/await
// to interact with it (using a third party wrapper library):

// indexedDB.open("databaseName", versionNumberofDatabase)

/*


Basic Concepts of IndexedDB:

Before we work with IndexedDB, let’s break down its key components:

- Database:
    A database in IndexedDB is a collection of object stores (like tables in SQL).
    Each origin (a website or web app) can have multiple IndexedDB databases, each identified by a
    name and a version number.

- Object Store:
    An object store is the equivalent of a table in SQL databases, but instead of rows, it holds objects.
    Every object stored must have a key that uniquely identifies it.

- Primary Key:
    Each entry in an object store has a key that uniquely identifies it. This key can be manually set or
    automatically generated. (auto-incrementing)

- Indexes:
    In addition to the primary key, you can create indexes on other object properties, allowing for more
    efficient querying.




const request = indexedDB.open('myDatabase', 1);

request.onsuccess = function (event) {
  const db = event.target.result; // Access the database
};

request.onerror = function (event) {
  console.error('Database error:', event.target.errorCode);
};

request.onupgradeneeded = function (event) {
  const db = event.target.result;
  // Create an object store or upgrade the schema
  if (!db.objectStoreNames.contains('myStore')) {
    const objectStore = db.createObjectStore('myStore', {
      keyPath: 'id', // Key Path: The keyPath is the property in the object that will serve as the primary key.
    });

    // Create indexes for querying
    objectStore.createIndex('name', 'name', { unique: false });
    objectStore.createIndex('email', 'email', { unique: true });
  }
};


indexedDB.open(name, version):
    Opens or creates a new database. If the database does not exist, it's created with the specified name.
    If the database exists but the version number is higher than the current version, the onupgradeneeded
    event fires, allowing you to modify the schema.

onsuccess:
    Fired when the database is successfully opened.

onupgradeneeded:
    Triggered when a new database is created or the version is increased, allowing you to create or update
    object stores.

Object stores are created in the onupgradeneeded event handler. When creating an object store, you can
define the keyPath (the property to use as the primary key).






const db = request.result;

const transaction = db.transaction(['users'], 'readwrite');
const objectStore = transaction.objectStore('users');

// Adding data
objectStore.add({
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
});

// Reading data
const getRequest = objectStore.get(1);
getRequest.onsuccess = function (event) {
  console.log('User:', event.target.result);
};


transaction.onerror = function (event) {
  console.error('Transaction failed:', event.target.errorCode);
};

transaction.oncomplete = function () {
  console.log('Data added successfully.');
};


// Updating data
const updateRequest = objectStore.put({ id: 1, name: 'Alice', email: 'alice@newemail.com' });

updateRequest.onsuccess = function() {
  console.log('User updated successfully.');
};


// Deleting data
const deleteRequest = objectStore.delete(1);

deleteRequest.onsuccess = function() {
  console.log('User deleted successfully.');
};


** Versioning and Schema Upgrades
When you need to change the structure of your database (e.g., adding a new object store), you must
update the database version. This triggers the onupgradeneeded event. Here you can migrate the data
from the old schema to the new one.

const request = indexedDB.open('myDatabase', 2); // New version number

request.onupgradeneeded = function(event) {
  const db = event.target.result;

  if (!db.objectStoreNames.contains('orders')) {
    const orderStore = db.createObjectStore('orders', { keyPath: 'orderId' });
  }
};

If a user loads your app with a newer version, the database is upgraded, and you can
migrate the data or schema.



IndexedDB Best Practices:

  - Use Transactions: Always perform read/write operations inside transactions.
  - Error Handling: Ensure you handle errors, particularly in asynchronous operations.
  - Avoid Large Objects on the Main Thread: If you're working with large objects,
    move IndexedDB operations to a Web Worker to avoid blocking the main thread. When saving the
    data or large objects in IndexedDB, though the save operation is asynchronous, but copying the
    large object in memory to the IndexedDB is synchronous and can block the main thread.
    When storing objects, IDB clones them, and cloning happens synchronously.
  - Use Wrappers: Libraries like Dexie.js or idb simplify the API and let you use promises and async/await.






const objectStore = await db.createObjectStore(name); No key

const objectStore = await db.createObjectStore(name,
{ keyPath: property_name } ); // With keyPath

const objectStore = await db.createObjectStore(name,
{ autoIncrement: true } ); // With Key generator


*/

// * File System Access API:

// 1. Open a file picker and read file contents
async function readFile() {
  // Opens the file picker dialog and allows the user to select a file
  const [fileHandle] = await window.showOpenFilePicker();

  // Gets the File object from the selected file handle
  const file = await fileHandle.getFile();

  // Reads the content of the file as text
  const contents = await file.text();

  // Logs the file content to the console
  console.log(contents);
}

// 2. Request write access and write to the file
async function writeFile() {
  // Opens the file picker to select a file for writing
  const [fileHandle] = await window.showOpenFilePicker();

  // Requests a writable stream to modify the file
  const writableStream = await fileHandle.createWritable();

  // Writes the content "Hello World!" to the file
  await writableStream.write('Hello World!');

  // Closes the stream, finalizing the write operation
  await writableStream.close();
}

// 3. Create a new file using the save file picker
async function createNewFile() {
  // Opens the save file picker dialog and allows the user to choose or type a file name
  const newFileHandle = await window.showSaveFilePicker({
    suggestedName: 'my-new-file.txt', // Suggested name for the new file
    types: [
      {
        description: 'Text Files', // Description of the file type
        accept: { 'text/plain': ['.txt'] }, // Acceptable file type extensions
      },
    ],
  });

  // Creates a writable stream for the new file
  const writableStream = await newFileHandle.createWritable();

  // Writes the string "This is a new file" to the file
  await writableStream.write('This is a new file');

  // Closes the writable stream and saves the file
  await writableStream.close();
}

// 4. Select a directory and list files within it
async function readDirectoryContents() {
  // Opens a directory picker, allowing the user to select a folder
  const directoryHandle = await window.showDirectoryPicker();

  // Iterates through the directory contents
  for await (const entry of directoryHandle.values()) {
    // Logs each file or folder name found within the directory
    console.log(entry.name);
  }
}

// 5. Create a file within a selected directory
async function createFileInDirectory() {
  // Opens a directory picker for the user to select a folder
  const directoryHandle = await window.showDirectoryPicker();

  // Creates or retrieves a file named 'newFile.txt' within the selected directory
  const newFileHandle = await directoryHandle.getFileHandle(
    'newFile.txt',
    { create: true }
  );

  // Creates a writable stream for the new file
  const writableStream = await newFileHandle.createWritable();

  // Writes some content to the file
  await writableStream.write('Content in the new file');

  // Closes the writable stream, finalizing the write operation
  await writableStream.close();
}

// 6. Read a binary file (e.g., image)
async function readBinaryFile() {
  // Opens a file picker dialog and lets the user choose a file
  const [fileHandle] = await window.showOpenFilePicker();

  // Retrieves the file selected by the user
  const file = await fileHandle.getFile();

  // Reads the file as an ArrayBuffer (for binary data)
  const arrayBuffer = await file.arrayBuffer();

  // Logs the binary data as an ArrayBuffer object
  console.log(arrayBuffer);
}

// 7. Use Origin Private File System (Safari)
async function usePrivateFileSystem() {
  // Gets access to the origin private file system
  const fileHandle = await navigator.storage.getDirectory();

  // Creates a file within the origin private file system
  const newFileHandle = await fileHandle.getFileHandle(
    'privateFile.txt',
    { create: true }
  );

  // Creates a writable stream to write to the file
  const writableStream = await newFileHandle.createWritable();

  // Writes "Private content" into the file
  await writableStream.write('Private content');

  // Closes the writable stream, saving the file in the private storage
  await writableStream.close();
}

/*
Explanation:

window.showOpenFilePicker():
    Opens a dialog for the user to select files. Returns an array of file handles (we're using
    [fileHandle] to grab the first one).

getFile(): Retrieves the file object from the file handle, which you can read as text or binary.
createWritable(): Requests a writable stream that allows writing content to the file.
showSaveFilePicker(): Opens a dialog for the user to select a save location or create a new file.
showDirectoryPicker(): Opens a dialog for selecting a folder.
getFileHandle(): Allows creating or getting a handle for a file inside the chosen directory.
arrayBuffer(): Reads the file as binary data, useful for images or other binary formats.

navigator.storage.getDirectory():
    Used for accessing the Origin Private File System (Safari only), a private space that isn't accessible from outside the web app.

*/

/*

File System Access API:

This API enables web applications to read from and write to files and directories on the user's local
file system with their explicit permission. It's used in scenarios like web-based IDEs (e.g., VS Code)
and other apps where persistent file access is necessary.

Security and Permissions:
  - The API is designed to respect security boundaries. Users need to explicitly select files or folders
  using a file picker dialog before the web app gains access. After the selection, the app can request
  additional permissions like write access.


  - No Quota Management: Unlike IndexedDB, which has storage quotas to prevent excessive usage,
    the files you manage via the File System Access API are directly on the user's local file system,
    so there’s no storage quota managed by the browser. This can be useful when working with large files
    like images, videos, or datasets.




Origin Private File System:
  Some browsers (like Safari) implement a private storage system called Origin Private File System.
  In this case, files are not saved to the user's visible file system, but instead stored in a private
  area that only the web app can access. This storage behaves similarly to IndexedDB, and files saved here
  don’t count toward the browser’s storage quota.

Origin Private File System Use Case:
  Imagine a photo-editing web app where you don't want the user
  to directly manage the temporary working files. The private file system lets the app store these files
  invisibly to the user, ensuring they aren't cluttered with temp files.

*/
