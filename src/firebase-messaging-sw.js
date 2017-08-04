importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js');
firebase.initializeApp({
   'messagingSenderId': '196351881945'
});
const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
   // Customize notification here




   const notificationTitle = 'Sonub';
   const notificationOptions = {
       click_action: 'https://www.sonub.com/view/1234'
   };

   return self.registration.showNotification(notificationTitle,
       notificationOptions);
});
