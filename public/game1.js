//const { default: firebase } = require("firebase");
const userName = document.querySelector("#user");
const db = firebase.firestore();

const auth = firebase.auth();

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
  startGame();
});

//can use transaction here since we aren't changing anything
//i actually think we can use transactions if we just take it slow

function startGame() {
  room = db.collection("users").doc(auth.currentUser.uid);

  let docRef = "";
  let id = "";
  return db.runTransaction((transaction) => {
    return transaction
      .get(room)
      .then((doc) => {
        console.log(doc.data());

        docRef = doc.data().rooms_joined;
        id = doc.id;
      })
      .then(() => {
        db.collection("rooms")
          .doc(docRef)
          .get()
          .then((doc) => {
            populateAlphabet(docRef);
            let usersRef = db.collection("rooms").doc(docRef);
            getUsers(usersRef);

            let listofInp = document.querySelector("#input-list");
            let html = "";

            for (let i = 0; i < 26; i++) {
              html += `<li><input type="text" placeholder="enter word" class="input-cell" </input> </li>`;
            }

            html += `<a data-id="next-1"class="waves-effect waves-light btn next-1" id="${doc.id}">Continue</a>`;
            listofInp.innerHTML = html;
          });
      });
  });
}

function shuffle(array) {
  var currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

function populateAlphabet() {
  let userRef = db.collection("users").doc(auth.currentUser.uid);
  let roomCode = "";
  let alphabetList = document.querySelector("#alphabet-list");
  let alphabet = "abcdefghijklmnopqrstuvwxyzz".split("");

  console.log(alphabet);

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
          shuffle(alphabet);

          let html = "";
          alphabet.forEach((letter) => {
            console.log(letter);
            html += `<li class="collection-item">${letter}</li>`;
          });
          alphabetList.innerHTML = html;
        });
    })
    .catch((error) => {
      console.log("Transaction failed: ", error);
    });
}

//MAYBE LETS SAVE THE DATA UNDER USER
function getUsers(room) {
  let inputList = document.querySelector("#user-list");
  inputList.style.display = "block";
  let html;
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

  console.log(room);
}

let warningBox = document.querySelector("#warningBox");

document.body.addEventListener("click", function (e) {
  e.preventDefault();
  if (e.target.dataset.id === "next-1") {
    let targetId = e.target.id;
    let inputList = document.querySelectorAll(".input-cell");

    let cells = [];

    let docRef = db.collection("rooms").doc(targetId);
    updateUserInputList();

    console.log(`INPUT LIST`, inputList);

    const validInputs = Array.from(inputList).filter(
      (input) => input.value !== ""
    );

    console.log(`INPUT LENGTH`, inputList.length);
    console.log(`VALID INPUT`, validInputs);

    if (validInputs.length < inputList.length) {
      let list_one = {};
      console.log("need all cells");
      warningBox.style.display = "block";
      document.getElementById("play-box").scrollTop = 0;
      warningBox.style.height = "fit-content";
      warningBox.innerHTML = "All cells must be filled before continuing";
      setTimeout(() => {
        warningBox.style.display = "none";
      }, 4000);
      return false;
    } else {
      //here is the problem
      //the return was getting included in the for each
      inputList.forEach((cell) => {
        cells.push(cell.value);
        console.log(cells);
        let randomInt = Math.floor(Math.random() * 200);

        list_one = {
          [randomInt]: cells,
        };
      });

      return docRef
        .set(
          {
            list_one,
          },
          { merge: true }
        )
        .then(() => {
          window.location = "game2.html";
          inputForm.reset();
        });
    }
  }
});

function updateUserInputList() {
  let userRef = db.collection("users").doc(auth.currentUser.uid);

  let inputList = document.querySelectorAll(".input-cell");
  inputList.forEach((cell) => {
    if (cell.value === "") {
      //maybe red
      console.log("must enter all cells");
      return false;
    } else {
      userRef
        .update({
          list_one_input: firebase.firestore.FieldValue.arrayUnion(cell.value),
        })
        .then(() => {
          console.log("User successfully updated!");
        })
        .catch((error) => {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
        });
    }
  });
}

document.getElementById("timer").innerHTML = 01 + ":" + 59;
startTimer();

function startTimer() {
  var presentTime = document.getElementById("timer").innerHTML;
  var timeArray = presentTime.split(/[:]+/);
  var m = timeArray[0];
  var s = checkSecond(timeArray[1] - 1);
  if (s == 59) {
    m = m - 1;
  }
  if (m == 0 && s == 0) {
    checkToSeeIfAllHasBeenEntered();
  }
  if (m < 0) {
    return;
  }

  document.getElementById("timer").innerHTML = m + ":" + s;
  setTimeout(startTimer, 1000);
}

function checkSecond(sec) {
  if (sec < 10 && sec >= 0) {
    sec = "0" + sec;
  } // add zero in front of numbers < 10
  if (sec < 0) {
    sec = "59";
  }
  return sec;
}

function checkToSeeIfAllHasBeenEntered() {
  let inputList = document.querySelectorAll(".input-cell");
  let emptywords = [];
  inputList.forEach((word) => {
    let randomInt = Math.floor(Math.random() * 90);

    console.log(`word count`, inputList.length);
    if (word.value === "") {
      word.value = words[randomInt];
      emptywords.push(word.value);
    }

    let userRef = db.collection("users").doc(auth.currentUser.uid);

    userRef
      .update({
        list_one_input: firebase.firestore.FieldValue.arrayUnion(word.value),
      })
      .then(() => {
        window.location = "game2.html";
      });
  });
}

let words = [
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
