importScripts("https://www.gstatic.com/firebasejs/8.0.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.0.0/firebase-messaging.js");
firebase.initializeApp({
  apiKey: "", //isi
  authDomain: "", //konfirgurasi ini
  projectId: "", //dari
  storageBucket: "", //firebase SDK
  messagingSenderId: "", //sesuai dengan yang digunakan pada script
  appId: "", //firebase di index.html
  measurementId: "", //
});
const messaging = firebase.messaging();
