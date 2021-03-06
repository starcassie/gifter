let userG = {};

window.onload = event => {
    // retains user state between html pages.
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            userG = user;
            console.log(userG);
            console.log('Logged in as: ' + user.displayName);
            const googleUserId = user.uid;
            const giftsRef = firebase.database().ref(`users/${googleUserId}/active`);
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
        console.log(person);
        holdsOptions.innerHTML += `<option value=${person}>${person}</option>`
        for (let gift in gifts[person]) {
            info = gifts[person]
            console.log(info)
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
                        <button class="button is-link has-text-weight-medium is-medium is-centered" onclick="editCard('${gifts[person][gift].recipient}', '${gift}')">edit</button>
                        <button class="button is-link has-text-weight-medium is-medium is-centered" onclick="archiveCard('${gifts[person][gift].recipient}', '${gift}')">archive</button>
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
                    <button class="button is-link has-text-weight-medium is-medium is-centered" onclick="editCard('${gifts[person][gift].recipient}', '${gift}')">edit</button>
                    <button class="button is-link has-text-weight-medium is-medium is-centered" onclick="archiveCard('${gifts[person][gift].recipient}', '${gift}')">archive</button>
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

function viewArchive() {
    // takes them back to the write note page
    window.location = "archive.html";
}

function filter() {
    // filters what cards are shown
    console.log("change");
    const select = document.querySelector('#holdsOptions');
    const person = select.options[select.selectedIndex].value;
    const googleUserId = userG.uid;
    const giftsRef = firebase.database().ref(`users/${googleUserId}/active`);
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
    const googleUserId = userG.uid;
    const giftsRef = firebase.database().ref(`users/${googleUserId}/active`);
    giftsRef.on("value", (snapshot) => {
        const gifts = snapshot.val();
        if (Object.keys(gifts[person]).length === 1) {
            firebase.database().ref(`users/${googleUserId}/active/${person}/${id}`).remove();
            filter("all")
        } else {
            firebase.database().ref(`users/${googleUserId}/active/${person}/${id}`).remove();
        }
    })
}

function changeFont() {
    // changes the font
    let fontPicker = document.querySelector("#holdsFonts");
    let font = fontPicker.options[fontPicker.selectedIndex].value;
    let cardContent = document.querySelectorAll(".card-content");
    for (let card in cardContent) {
        cardContent[card].style.fontFamily = font;
    // cardContent.setAttribute('style', "'Josefin Sans',sans-serif;");
    }
}

function editCard(person, id) {
    console.log(person + id);
    const googleUserId = userG.uid;
    const notesRef = firebase.database().ref(`users/${googleUserId}/active/${person}`);
    notesRef.on('value', (snapshot) => {
        const data = snapshot.val();
        const details = data[id];
        document.querySelector('#gift').value = details.gift;
        document.querySelector('#recipient').value = details.recipient;
        document.querySelector('#birthday').value = details.birthday;
        document.querySelector('#notes').value = details.notes;
        document.querySelector('#link').value = details.link;
        document.querySelector('#color').value = details.color;

    });
    editNoteModal.classList.toggle('is-active');
    const saveEditBtn = document.querySelector('#saveEdit');
    saveEditBtn.onclick = handleSaveEdit.bind(this, person, id);

}

function handleSaveEdit(person, id) {
    console.log("clicked");
    const gift = document.querySelector('#gift');
    const notes = document.querySelector('#notes');
    const recipient = document.querySelector('#recipient');
    const link = document.querySelector('#link');
    const birthday = document.querySelector('#birthday');
    const color = document.querySelector('#color');
    const currentDate = new Date();
    if (recipient.value == "") {
        alert("you need a recipient");
    } else {
        const dateString = (currentDate.getMonth() + 1) + "/" + currentDate.getDate() + "/" + currentDate.getFullYear();
        // formats the data and write it to our database
        if (person != recipient.value) {
            deleteCard(person, id)
        }
        firebase.database().ref(`users/${userG.uid}/active/${recipient.value}/${id}`).set({
            gift: gift.value,
            notes: notes.value,
            created: dateString,
            recipient: recipient.value,
            link: link.value,
            birthday: birthday.value,
            color: color.value
        })
        console.log(editNoteModal.classList);
        editNoteModal.classList.toggle('is-active');
        console.log(editNoteModal.classList);
    }
}

function archiveCard(person, id) {
    const giftsRef = firebase.database().ref(`users/${userG.uid}/active/${person}`);
    giftsRef.on("value", (snapshot) => {
        const gifts = snapshot.val();
        firebase.database().ref(`users/${userG.uid}/in-active/${gifts[id].recipient}`).push({
            gift: gifts[id].gift,
            notes: gifts[id].notes,
            created: gifts[id].created,
            recipient: gifts[id].recipient,
            link: gifts[id].link,
            birthday: gifts[id].birthday,
            color: gifts[id].color
        })
    })
    deleteCard(person, id)
}

function closeEditModal() {
    editNoteModal.classList.toggle('is-active');
}