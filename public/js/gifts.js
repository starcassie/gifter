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
            const holdsFonts = document.querySelector("#holdsFonts");
            console.log(holdsFonts);
            //option (value) / actual css styling guide
            let fontOptions = new Map();
            fontOptions.set("Josefin Sans", "'Josefin Sans',sans-serif");
            fontOptions.set("Indie Flower", "'Indie Flower',cursive");
            fontOptions.set("Amatic SC", "'Amatic SC',cursive");

            for (const [key, val] of fontOptions) {
                holdsFonts.innerHTML += `<option value="${val}">${key}</option>`;
            }
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
                <div class="card" style="background-color:${gifts[person][gift].color};">
                <div class="card-content">
                    <div class="content">
                        <p class="title is-4">${gifts[person][gift].gift}</p>
                        <p class="title is-5">${gifts[person][gift].recipient}</p>
                        <p class="title is-5">${gifts[person][gift].birthday}</p>
                        <p class="title is-5">${gifts[person][gift].notes}</p>
                        <p class="title is-5">tracked on: ${gifts[person][gift].created}</p>
                        <a class="title is-5" href="${gifts[person][gift].link}">link</a>
                        <br />
                        <button class="button is-link has-text-weight-medium is-medium is-centered" onclick="deleteCard('${gifts[person][gift].recipient}', '${gift}')">delete</button>
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
            <div class="card" style="background-color:${gifts[person][gift].color};">
            <div class="card-content">
                <div class="content">
                    <p class="title is-4">${gifts[person][gift].gift}</p>
                    <p class="title is-5">${gifts[person][gift].recipient}</p>
                    <p class="title is-5">${gifts[person][gift].birthday}</p>
                    <p class="title is-5">${gifts[person][gift].notes}</p>
                    <p class="title is-5">tracked on: ${gifts[person][gift].created}</p>
                    <a class="title is-5" href="${gifts[person][gift].link}">link</a>
                    <br />
                    <button class="button is-link has-text-weight-medium is-medium is-centered" onclick="deleteCard('${gifts[person][gift].recipient}', '${gift}')">delete</button>
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
    // filters what cards are shown
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

function deleteCard(person, id) {
    // deletes card
    console.log(person + id);
    const googleUserId = userG.uid;
    firebase.database().ref(`users/${googleUserId}/${person}/${id}`).remove();
}

function changeFont() {
    // changes the font
    console.log("change");
    let fontPicker = document.querySelector("#holdsFonts");
    let font = fontPicker.options[fontPicker.selectedIndex].value;
    let cardContent = document.querySelectorAll(".card-content");
    console.log(cardContent);
    for (let card in cardContent) {
        cardContent[card].style.fontFamily = font;
    // cardContent.setAttribute('style', "'Josefin Sans',sans-serif;");
    }
}