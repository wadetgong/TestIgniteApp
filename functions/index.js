const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


exports.initUser = functions.auth.user()
  .onCreate(event => {
    // The Firebase user.
    const { displayName, email, photoURL, uid } = event.data; 
    const user = { 
      displayName, email, fb_thumbnail: photoURL, 
      friends: null,
      journeys: null,
      profilePicture: null,
      username: null,
    }
    
    return admin.database().ref('/users').child(uid).set(user)
  });
