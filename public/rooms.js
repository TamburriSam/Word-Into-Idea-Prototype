const userName = document.querySelector("#user");
const roomList = document.querySelector(".rooms");
const db = firebase.firestore();

const auth = firebase.auth();
let toggleSwitch = document.querySelector(".switch");
const createForm = document.querySelector(".create-room");

let roomName = document.querySelector("#room-name");
let roomCount = document.querySelector("#room-count");

toggleSwitch.addEventListener("click", function () {
  if (!document.getElementById("check").checked) {
    document.getElementById("container").style.display = "none";
    document.getElementById("comingSoon").style.display = "block";
  } else {
    document.getElementById("comingSoon").style.display = "none";
    document.getElementById("container").style.display = "block";
  }
});

function populateListOneOnCreation() {
  // Create a reference to the SF doc.
  var userRef = db.collection("users").doc(auth.currentUser.uid);
  let roomCode = "";
  let roomCount = "";

  return db.runTransaction((transaction) => {
    // This code may get re-run multiple times if there are conflicts.
    return transaction
      .get(userRef)
      .then((doc) => {
        console.log(doc.data().rooms_joined);
        roomCode = doc.data().rooms_joined;
      })
      .catch((err) => {
        console.log("err", err);
      })
      .then(() => {
        db.collection("rooms")
          .doc(roomCode)
          .get()
          .then((doc) => {
            roomCount = doc.data().total_count;
          })
          .catch((err) => {
            console.log("err", err);
          });
      })
      .then(() => {
        let roomRef = db.collection("rooms").doc(roomCode);

        let wordsWeWant = [];

        for (let i = 0; i < 27; i++) {
          let randomInt = Math.floor(Math.random() * 90);

          wordsWeWant.push(randomWords[randomInt]);
        }

        console.log(wordsWeWant);

        console.log(`ROOM COUNT`, roomCount);
        list_one = {
          0: wordsWeWant,
        };

        return roomRef.update({
          list_one,
        });
      })
      .catch((err) => {
        console.log(`err on line 69`, err);
      });
  });
}

function algorithm(num, position) {
  let numArray = [];

  for (let i = 1; i < num; i++) {
    numArray.push(i);
  }

  let huhArray = [];

  for (let i = 0; i < numArray.length; i++) {
    huhArray.push([
      numArray[i + 1],
      numArray[i + 2],
      numArray[i + 3],
      numArray[i + 4],
    ]);
  }

  numArray[numArray.length - 5];
  console.log(huhArray);

  huhArray[huhArray.length - 5][3] = 1;
  huhArray[huhArray.length - 4][2] = 1;

  huhArray[huhArray.length - 4][3] = 2;
  huhArray[huhArray.length - 3][1] = 1;
  huhArray[huhArray.length - 3][2] = 2;
  huhArray[huhArray.length - 3][3] = 3;

  huhArray[huhArray.length - 2][0] = 1;
  huhArray[huhArray.length - 2][1] = 2;
  huhArray[huhArray.length - 2][2] = 3;
  huhArray[huhArray.length - 2][3] = 4;

  console.log(huhArray[huhArray.length - 4][3]);
  let wantedArr = huhArray[position];

  console.log(`TARGET NUM`);
  console.log(wantedArr);

  var userRef = db.collection("users").doc(auth.currentUser.uid);

  return userRef
    .update({
      recipients: wantedArr,
    })
    .then(() => {
      console.log("doc success");
    })
    .catch((err) => {
      console.error(`erroir line 125`, err);
    });
}

function findIndex() {
  let roomCode = "";

  let room = db.collection("users").doc(auth.currentUser.uid);
  let user_name = "";
  let roomCount = "";
  let position = "";

  console.log(`doc`, auth.currentUser.uid);

  return db
    .runTransaction((transaction) => {
      return transaction.get(room).then((doc) => {
        roomCode = doc.data().rooms_joined;
        user_name = doc.data().user_name;
        roomCount = doc.data().total_count;
      });
    })
    .then(() => {
      console.log("done", roomCode);

      db.collection("rooms")
        .doc(roomCode)
        .get()
        .then((doc) => {
          position = doc.data().users.length;
          roomCount = doc.data().total_count;
          console.log(`POSITION`, position);
        });
    })
    .then(() => {
      db.collection("users")
        .doc(auth.currentUser.uid)
        .get()
        .then((doc) => {
          console.log(`DOC DOC `, doc.data());
          console.log("POSITION", position);
          console.log(roomCount, "roomcount");
          console.log(typeof position);
          //algorithm(roomCount, position);
          addIndexToUserProfile(position);
        });
    })
    .then(() => {
      populateListOneOnCreation();
    });
}

function addIndexToUserProfile(indice) {
  var userRef = db.collection("users").doc(auth.currentUser.uid);

  return userRef
    .update({
      index: indice,
    })
    .then(() => {
      console.log("Document successfully updated!");
    })
    .catch((error) => {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
    });
}

auth.onAuthStateChanged((user) => {
  let firstName = user.displayName.split(" ")[0];
  if (user && user.photoURL) {
    userName.innerHTML =
      "Hello," +
      "  " +
      firstName +
      `<img class="photoURL" src="${user.photoURL}" alt=""/>`;
  } else {
    console.log(user.displayName.length);

    userName.innerHTML =
      "Hello," +
      "  " +
      firstName +
      `<img class="photoURL" src="logos/user.png" alt=""/>`;
  }

  db.collection("rooms").onSnapshot((snapshot) => {
    setUpRooms(snapshot.docs);
  });
  roomFullDisableButton();
  rejoin();
});

const setUpRooms = (data) => {
  let r = document.querySelector(".tbody1"); //if there is data

  if (data.length) {
    let html = "";
    data.forEach((doc) => {
      const room = doc.data();

      console.log(doc.id);
      //console.log("Iterated snapshot", room);
      /* const li = `<li class="room-info"><div>${room.name}</div> ${room.active_count}/${room.total_count} Active<a data-id="btn" class="waves-effect waves-light btn room-select" id="${doc.id}">Join</a> </li> <br>
      `; */
      const li = `<tr><td>${room.name}</td> <td>${room.active_count}/${room.total_count} Active </td> <td> <a data-id="btn" class="waves-effect waves-light btn room-select" id="${doc.id}">Join</a> </td></tr><br>`;

      html += li;

      //add event listener that ties the room name with the name in database
    });
    r.innerHTML = html;
  } else {
    roomList.innerHTML = `<h5>Log in to view rooms</h5>`;
  }
};

document.body.addEventListener("click", function (e) {
  let id = e.target.id;
  let uid = firebase.auth().currentUser.uid;
  let email = firebase.auth().currentUser.email;

  if (e.target.dataset.id === "btn") {
    db.collection("users")
      .doc(uid)
      .set({
        favorite_letter: "",
        uid: uid,
        flag: parseInt(0),
        rooms_joined: id,
        user_name: email,
        list_one_input: [],
        list_two_input: [],
        list_three_input: [],
        recipients: [],
        list_four_input: [],
        list_one_received: [],
        list_two_received: [],
        list_three_received: [],
        list_four_received: [],
      })
      .then(() => {
        console.log("user added");
        console.log(id);
        watchForCount(id);
        document.querySelector("#waiting").style.display = "block";
        findIndex();
      })
      .catch((err) => {
        console.log(`Err on line 254`, err);
      });
  }
});

function roomFullDisableButton() {
  db.collection("rooms")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (
          doc.data().active_count === doc.data().total_count &&
          doc.data().total_count === doc.data().favorite_letters.length
        ) {
          document.getElementById(doc.id).disabled = true;
          document.getElementById(doc.id).classList.add("disabled");
          document.getElementById(doc.id).innerHTML = "In Session";

          console.log(document.getElementById(doc.id));
        }
      });
    });
}

function watchForCount(room) {
  let docref = db.collection("rooms").doc(room);
  let inputList = document.querySelector("#user-list");
  let fastfactBox = document.querySelector("#fast-facts");
  let logoW = document.querySelector(".logo-white");
  let inputHolder = document.querySelector(".user-box");
  let liveRoomBox = document.querySelector(".liveRoom");
  let facts = document.querySelector(".facts");
  inputList.style.display = "block";
  fastfactBox.style.display = "block";
  inputHolder.style.display = "block";
  liveRoomBox.style.display = "none";

  let paragraphs = [
    `"I wish I was like you, easily amused
    Find my nest to salt, everything's my fault
    I'll take all the blame, aqua seafoam shame
    Sunburn, freezer burn, choking on the ashes of her enemy"`,

    `"The girls eat morning <br>
    Dying peoples to a white bone monkey <br>
    in the Winter sun<br>
    touching tree of the house."`,
    `"Sell me a coat with buttons of silver<br>
    Sell me a coat that's red or gold<br>
    Sell me a coat with little patch pockets<br>
    Sell me a coat because I feel cold"`,
    `"at land coccus germs<br>
    by a bacilmouth Jersy phenicol bitoics<br>
    the um vast and varied that<br>
    specific target was the vast popul" `,
    `She eyes me like a Pisces when I am weak<br>
    I've been locked inside your heart-shaped box for weeks<br>
    I've been drawn into your magnet tar pit trap<br>`,
  ];

  console.log(paragraphs);

  let count = 0;

  setInterval(() => {
    facts.innerHTML = paragraphs[count];
    count++;

    if (count === 5) {
      count = 0;
    }
  }, 10000);

  return db
    .runTransaction((transaction) => {
      return transaction.get(docref).then((doc) => {
        //right here we need to add something else that denies user another click if their username is found
        if (
          doc.data().active_count < doc.data().total_count &&
          !doc.data().users.includes(auth.currentUser.displayName)
        ) {
          console.log("HUH232222222");
          let newCount = doc.data().active_count + 1;
          transaction.update(docref, { active_count: newCount });
          transaction.update(docref, {
            users: firebase.firestore.FieldValue.arrayUnion(
              firebase.auth().currentUser.displayName
            ),
          });
          checkForLetter();
        } /* else if (doc.data().users.includes(auth.currentUser.displayName)) {
          console.log("didnt go up");
          checkForLetter();
        } */
      });
    })
    .then((doc) => {
      console.log("done HERE");
      getUsers(docref);
      isRoomFull(room);
    })
    .catch((err) => {
      console.log("err on line 341", err);
    });
}

function getUsers(room) {
  let inputList = document.querySelector("#user-list");

  let html;
  console.log("HAR");
  //display the usernames
  //but we want to set up a listener

  room.onSnapshot((snapshot) => {
    let html = "";
    snapshot.data().users.forEach((user) => {
      //GOTTA TAKE OUT THE ZERO
      let randomInt = Math.floor(Math.random() * 19) + 1;
      console.log(randomInt);
      html += `<li class="profile-holder"> <img
      class="profilepic"
      src="logos/icons/${randomInt}.png"
      alt=""
    />${user}     </li>`;
      console.log(user);
    });
    inputList.innerHTML = html;
  });
}

function startCountdown(seconds) {
  let counter = seconds;

  const interval = setInterval(() => {
    console.log(counter);
    counter--;

    document.querySelector(
      "#waiting"
    ).innerHTML = `Game Starting in ${counter} seconds`;

    if (counter < 1) {
      clearInterval(interval);
      console.log("Ding!");
      window.location = "game1.html";
    }
  }, 1000);
}

function isRoomFull(room) {
  db.collection("rooms")
    .doc(room)
    .onSnapshot((snapshot) => {
      let data = snapshot.data();

      if (data.active_count === data.total_count) {
        document.getElementById(snapshot.id).disabled = true;
        document.getElementById(snapshot.id).innerHTML = "In Session";
        startCountdown(9);
      }
    });
}

//its here because it hasnt been added yet
const checkForLetter = () => {
  db.collection("users")
    .doc(auth.currentUser.uid)
    .get()
    .then((doc) => {
      console.log(`HERE WE GO`, doc.data());

      if (!doc.data().favorite_letter) {
        makeItModal();
        console.log(`HERE WE GsO`, doc.data());
      } else {
        console.log("booyah");
      }
    });
};

function addLetterToRoomDb() {
  let room = db.collection("users").doc(auth.currentUser.uid);
  return db
    .runTransaction((transaction) => {
      return transaction.get(room).then((doc) => {
        roomCode = doc.data().rooms_joined;
        user_name = doc.data().user_name;
      });
    })
    .then(() => {
      console.log("done", roomCode);
      let docRef = db.collection("rooms").doc(roomCode);

      // Set the "capital" field of the city 'DC'
      return docRef
        .update({
          favorite_letters: firebase.firestore.FieldValue.arrayUnion(
            modalInput.value
          ),
        })
        .then(() => {
          console.log("Document successfully updated!");
        })
        .catch((error) => {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
        });
    });
}

let modalInput = document.querySelector("#alphabetInput");
// Get the modal
var modal = document.getElementById("myModal");

let roomBtns = document.querySelectorAll(".room-select");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
function makeItModal() {
  let modalInput = document.querySelector("#alphabetInput");
  let modalBtn = document.querySelector("#modalSubmit");
  let modalContent = document.querySelector(".modal-content");

  modal.style.display = "block";
  console.log("clicked");

  modalBtn.addEventListener("click", function () {
    db.collection("users")
      .doc(auth.currentUser.uid)
      .update({
        favorite_letter: modalInput.value,
      })
      .then(() => {
        addLetterToRoomDb();

        console.log("fav letter successfully added");
        modalContent.innerHTML = "Thank You. The Game will begin shortly";

        setTimeout(() => {
          modal.style.display = "none";
        }, 2000);
      })
      .catch((err) => {
        console.log(`Error on line 317 ${err}`);
      });
  });
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
/* window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}; */

function populateAlphabet() {
  let userRef = db.collection("users").doc(auth.currentUser.uid);
  var roomRef = db.collection("rooms");
  let roomCode = "";

  // Uncomment to initialize the doc.
  // sfDocRef.set({ population: 0 });

  return db
    .runTransaction((transaction) => {
      // This code may get re-run multiple times if there are conflicts.
      return transaction.get(userRef).then((doc) => {
        roomCode = doc.data().rooms_joined;
      });
    })
    .then(() => {
      db.collection("rooms")
        .doc(roomCode)
        .get()
        .then((doc) => {
          console.log(doc.data());
        });
    })
    .catch((error) => {
      console.log("Transaction failed: ", error);
    });
}

let randomWords = [
  "trouble",
  "straight",
  "improve",
  "red",
  "tide",
  "dish",
  "dried",
  "police",
  "prize",
  "addition",
  "tonight",
  "quick",
  "child",
  "apartment",
  "sister",
  "could",
  "feet",
  "passage",
  "tobacco",
  "thou",
  "leg",
  "lady",
  "excellent",
  "fifth",
  "lake",
  "plural",
  "influence",
  "hurry",
  "river",
  "treated",
  "slightly",
  "else",
  "create",
  "live",
  "cool",
  "ought",
  "observe",
  "pass",
  "attack",
  "angle",
  "battle",
  "touch",
  "goes",
  "steady",
  "discussion",
  "cloth",
  "corner",
  "ordinary",
  "dozen",
  "soldier",
  "pride",
  "shells",
  "remarkable",
  "prevent",
  "nearly",
  "movie",
  "usual",
  "circle",
  "cover",
  "bottle",
  "machinery",
  "planet",
  "product",
  "nose",
  "as",
  "stopped",
  "hang",
  "time",
  "fight",
  "garden",
  "bar",
  "rapidly",
  "none",
  "question",
  "paint",
  "seven",
  "language",
  "dropped",
  "excellent",
  "porch",
  "club",
  "slip",
  "powder",
  "steam",
  "which",
  "before",
  "island",
  "deeply",
  "board",
  "notice",
  "his",
  "railroad",
  "slabs",
  "particular",
  "bee",
  "rule",
  "sheet",
  "determine",
  "afraid",
  "planned",
];

let warningBox2 = document.getElementById("warningBox2");
let createNewRoom = document.getElementById("createNewRoom");
let createBox = document.getElementById("create-room");

createNewRoom.addEventListener("click", function () {
  createBox.style.display = "block";
});

createForm.addEventListener("click", () => {
  console.log("booyah");

  console.log(typeof parseInt(roomCount.value));

  if (roomCount.value < 6 || typeof parseInt(roomCount.value) !== "number") {
    console.log(false);
    warningBox2.style.display = "block";
  } else {
    //create new record in firestore database
    db.collection("rooms")
      .add({
        name: roomName.value,
        total_count: parseInt(roomCount.value),
        active_count: 0,
        users: [],
        list_one: [],
        list_two: [],
        list_three: [],
        list_four: [],
      })
      .then(() => {
        createBox.style.display = "none";
        warningBox2.style.display = "none";
      })
      .catch((err) => {
        console.error(err);
      });
  }
});

//check for rejoin

function rejoin() {
  db.collection("users")
    .doc(auth.currentUser.uid)
    .get()
    .then((doc) => {
      if (doc.data() && doc.data().rooms_joined.length > 1) {
        document.getElementById(doc.data().rooms_joined).innerHTML = "Rejoin";
      } else {
        console.log("do nothing");
      }
    });
}

document
  .querySelector(".about-link")
  .addEventListener("mouseover", function () {
    console.log("ok");
  });
