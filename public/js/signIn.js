const signIn = () => {
  var provider = new firebase.auth.GoogleAuthProvider();
  // console.log(provider)
  firebase.auth()
  .signInWithPopup(provider)
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    var credential = result.credential;
    var token = credential.accessToken;

    // The signed-in user info.
    var user = result.user;
    window.location = 'writeNote.html';
  }).catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    const err = {
      errorCode,
      errorMessage,
      email,
      credential
    };
    console.log(err);
  });
}

const signInWithPhoneButton = document.querySelector("#signInWithPhone");
const getCode = document.querySelector("#getCode");
const codeInput = document.querySelector("#code");

const auth = firebase.auth();

window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
  "recaptcha-container"
);

recaptchaVerifier.render().then(widgetId => {
  window.recaptchaWidgetId = widgetId;
});

const sendCode = () => {
  // const phoneNumber = "+1" + document.querySelector("#phoneNumber").value;
  const phoneNumber = "+16504403166";
  console.log("sending code");
  const appVerifier = window.recaptchaVerifier;
  auth
    .signInWithPhoneNumber(phoneNumber, appVerifier)
    .then(confirmationResult => {
      const sentCodeId = confirmationResult.verificationId;
      signInWithPhoneButton.addEventListener("click", () =>
        signInWithPhone(sentCodeId)
      );
    });
};

const signInWithPhone = sentCodeId => {
  const code = codeInput.value;
  const credential = firebase.auth.PhoneAuthProvider.credential(
    sentCodeId,
    code
  );
  auth
    .signInWithCredential(credential)
    .then(() => {
      window.location = "writeNote.html";
    })
    .catch(error => {
      console.error(error);
    });
};
getCode.addEventListener("click", sendCode);