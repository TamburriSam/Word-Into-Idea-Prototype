//const { default: firebase } = require("firebase");


/* var firebaseConfig = {
    apiKey: "AIzaSyADzwgs6pxSZ6eHJx1VcHsy22VXQ63T-TE",
    authDomain: "good-luck-ab5fc.firebaseapp.com",
    projectId: "good-luck-ab5fc",
    storageBucket: "good-luck-ab5fc.appspot.com",
    messagingSenderId: "924157428091",
    appId: "1:924157428091:web:ff7aef4bcd052692967dde"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig); */

  const user = firebase.auth().currentUser;
  console.log(user)


  var ui = new firebaseui.auth.AuthUI(firebase.auth());

  //we need to put callbacks here to save 
  var uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {
        // User successfully signed in.
        // Return type determines whether we continue the redirect automatically
        // or whether we leave that to developer to handle.
        return true;
      },
      uiShown: function() {
        // The widget is rendered.
        // Hide the loader.
        document.getElementById('loader').style.display = 'none';
      }
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInSuccessUrl: 'rooms.html',
    signInOptions: [
      // Leave the lines as is for the providers you want to offer your users.
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
    // Terms of service url.
    tosUrl: 'rooms.html',
    // Privacy policy url.
    privacyPolicyUrl: '<your-privacy-policy-url>'
  };

  ui.start('#firebaseui-auth-container', uiConfig);
