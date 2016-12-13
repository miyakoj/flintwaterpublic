importScripts('https://www.gstatic.com/firebasejs/3.5.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.5.2/firebase-messaging.js');

config = {
	apiKey: "AIzaSyAphuqStHEGm66EUi4fsdaU8OtOwuUnOrY",
	authDomain: "uniteflint.firebaseapp.com",
	databaseURL: "https://uniteflint.firebaseio.com",
	storageBucket: "uniteflint.appspot.com",
	messagingSenderId: "402781339047"
};
app = firebase.initializeApp(config);

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