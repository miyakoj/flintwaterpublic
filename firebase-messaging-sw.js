importScripts('https://www.gstatic.com/firebasejs/3.5.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.5.2/firebase-messaging.js');

firebase.initializeApp({
  'messagingSenderId': '[FIREBASE MESSAGING SENDER ID]'
});

const messaging = firebase.messaging();

messaging.requestPermission().then(function() {
	console.log('Notification permission granted.');
	
	return messaging.getToken();
}).catch(function(err) {
	console.log('Unable to get permission to notify.', err);
});

messaging.onMessage(function(payload) {
	console.log(payload);
});