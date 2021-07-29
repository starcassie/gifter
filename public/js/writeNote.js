let googleUser;
console.log("test")
window.onload = (event) => {
  // retaims the user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      const title = document.querySelector("#title");
      title.innerHTML = user.displayName + "'s Gifter";
      console.log('Logged in as: ' + user.displayName);
      googleUser = user;
    } else {
      window.location = 'index.html'; // if not logged in, navigate back to login page.
    }
  });
};

const handleNoteSubmit = () => {
  // captures the form data
  const gift = document.querySelector('#gift');
  const notes = document.querySelector('#notes');
  const recipient = document.querySelector('#recipient');
  const link = document.querySelector('#link');
  const birthday = document.querySelector('#birthday');
  const color = document.querySelector('#color');
  const currentDate = new Date();
  const dateString = (currentDate.getMonth() + 1) + "/" + currentDate.getDate() + "/" + currentDate.getFullYear();
  // formats the data and write it to our database
  if (recipient.value == "") {
      alert("you need a recipient");
  } else {
    firebase.database().ref(`users/${googleUser.uid}/active/${recipient.value}`).push({
        gift: gift.value,
        notes: notes.value,
        created: dateString,
        recipient: recipient.value,
        link: link.value,
        birthday: birthday.value,
        color: color.value
    })
    // clears the form so that we can write a new note
    .then(() => {
        gift.value = "";
        notes.value = "";
        recipient.value = "";
        link.value = "";
        birthday.value = "";
        color.value = "#ffffff";
    });
    }
};

function openGifts() {
    // takes the user to the gift page
    window.location = "gifts.html";
}

function signOut() {
   firebase.auth().signOut()
	
   .then(function() {
      console.log('Signout Succesfull')
   }, function(error) {
      console.log('Signout Failed')  
   });
}