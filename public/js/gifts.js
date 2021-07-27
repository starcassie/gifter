let userG = {};

window.onload = event => {
    // retains user state between html pages.
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            userG = user;
            console.log(userG);
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
    const holdsOptions = document.querySelector('#holdsOptions');
    console.log(gifts)
    cardHolder.innerHTML = "";
    holdsOptions.innerHTML = `<option value="all">all</option>`;
    for (let person in gifts) {
        holdsOptions.innerHTML += `<option value=${person}>${person}</option>`
        for (let gift in gifts[person]) {
            cardHolder.innerHTML +=
            `<div class="is-half mt-4 cardItem">
                <!-- CARD -->
                <div class="card">
                <div class="card-content">
                    <div class="content">
                        <p class="title is-4">${gifts[person][gift].gift}</p>
                        <p class="title is-5">${gifts[person][gift].recipient}</p>
                        <p class="title is-5">${gifts[person][gift].birthday}</p>
                        <p class="title is-5">${gifts[person][gift].notes}</p>
                        <p class="title is-5">tracked on: ${gifts[person][gift].created}</p>
                        <a class="title is-5" href="${gifts[person][gift].link}">${gifts[person][gift].link}</a>
                    </div>
                </div> 
                </div>
            </div>`;
        }
    }
}

function makeCardPerson(gifts, person) {
    // creates the cards for each of the gifts
    const cardHolder = document.querySelector('#cardHolder')
    console.log(gifts)
    cardHolder.innerHTML = "";
    for (let gift in gifts[person]) {
        cardHolder.innerHTML +=
        `<div class="is-half mt-4 cardItem">
            <!-- CARD -->
            <div class="card">
            <div class="card-content">
                <div class="content">
                    <p class="title is-4">${gifts[person][gift].gift}</p>
                    <p class="title is-5">${gifts[person][gift].recipient}</p>
                    <p class="title is-5">${gifts[person][gift].birthday}</p>
                    <p class="title is-5">${gifts[person][gift].notes}</p>
                    <p class="title is-5">tracked on: ${gifts[person][gift].created}</p>
                    <a class="title is-5" href="${gifts[person][gift].link}">${gifts[person][gift].link}</a>
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

function filter() {
    console.log("change");
    const select = document.querySelector('#holdsOptions');
    const person = select.options[select.selectedIndex].value;
    const googleUserId = userG.uid;
    const giftsRef = firebase.database().ref(`users/${googleUserId}`);
    giftsRef.on("value", (snapshot) => {
        const gifts = snapshot.val();
        if (person === "all") {
            makeCard(gifts);
        } else {
            makeCardPerson(gifts, person);
        }
    }) 
}