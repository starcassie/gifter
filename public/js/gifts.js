window.onload = event => {
    // retains user state between html pages.
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log('Logged in as: ' + user.displayName);
            const googleUserId = user.uid;
            const giftsRef = firebase.database().ref(`users/${googleUserId}`);
            giftsRef.on("value", (snapshot) => {
                const gifts = snapshot.val();
                makeCard(gifts);
            })
        } else {
            // if not logged in, navigate back to login page.
            window.location = 'index.html'; 
        };
    });
}

function makeCard(gifts) {
    // creates the cards for each of the gifts
    const cardHolder = document.querySelector('#cardHolder')
    console.log(gifts)
    cardHolder.innerHTML = "";
    for (let gift in gifts) {
        cardHolder.innerHTML +=
        `<div class="is-half mt-4 cardItem">
            <!-- CARD -->
            <div class="card">
            <div class="card-content">
                <div class="content">
                    <p class="title is-4">${gifts[gift].gift}</p>
                    <p class="title is-5">${gifts[gift].recipient}</p>
                    <p class="title is-5">${gifts[gift].birthday}</p>
                    <p class="title is-5">${gifts[gift].notes}</p>
                    <p class="title is-5">tracked on: ${gifts[gift].created}</p>
                    <a class="title is-5" href="${gifts[gift].link}">${gifts[gift].link}</a>
                </div>
            </div> 
            </div>
        </div>`;
    }
}

function back() {
    // takes them back to the write note page
    window.location = "writeNote.html";
}