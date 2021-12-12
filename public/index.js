const user = firebase.auth().currentUser;

var ui = new firebaseui.auth.AuthUI(firebase.auth());

//we need to put callbacks here to save
var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      return true;
    },
    uiShown: function () {
      document.getElementById("loader").style.display = "none";
    },
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: "redirect",
  signInSuccessUrl: "firstPage.html",
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
  // Terms of service url.
  tosUrl: "",
  // Privacy policy url.
  privacyPolicyUrl: "<your-privacy-policy-url>",
};

/* ui.start("#firebaseui-auth-container", uiConfig);
 */
