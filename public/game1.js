//const { default: firebase } = require("firebase");
const userName = document.querySelector("#user");
const db = firebase.firestore();

const auth = firebase.auth();
let inputContainer = document.getElementById("inputForm");
let wordList = document.getElementById("word-list-container");
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
  showInstructions();
  startGame();
});

let directionOne = `You've received a paper with a random classmate's words.`;

const directionTwo =
  "For each word, write the first word that pops into your head.";
const directionThree = `The word you choose doesn't have to be related to the word given.`;

const showInstructions = () => {
  setTimeout(() => {
    var i = 0;
    var txt = directionOne;
    var speed = 25;

    function typeWriter() {
      if (i < txt.length) {
        document.getElementById("instruction-one").innerHTML += txt.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
      }
    }
    typeWriter();
    showInstructionsTwo();
  }, 1000);
};

const showInstructionsTwo = () => {
  setTimeout(() => {
    var i = 0;
    var txt = directionTwo;
    var speed = 25;

    function typeWriter() {
      if (i < txt.length) {
        document.getElementById("instruction-two").innerHTML += txt.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
      }
    }
    typeWriter();
    showInstructionsThree();
  }, 4000);
};

const showInstructionsThree = () => {
  setTimeout(() => {
    var i = 0;
    var txt = directionThree;
    var speed = 25;

    function typeWriter() {
      if (i < txt.length) {
        document.getElementById("instruction-three").innerHTML += txt.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
      }
    }
    typeWriter();
  }, 6000);
};

//can use transaction here since we aren't changing anything
//i actually think we can use transactions if we just take it slow

function startGame() {
  room = db.collection("users").doc(auth.currentUser.uid);
  let count = 0;

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
              html += `<li><input type="text" data-id="${count}" placeholder="enter word" class="input-cell" </input> </li>`;
              count++;
            }

            let buttonContainer = document.querySelector("#button-container");
            buttonContainer.innerHTML = `<a data-id="next-1"class="next waves-effect waves-light btn next-1" id="${doc.id}">Continue</a>`;
            listofInp.innerHTML = html;
          });
      });
  });
}

function shuffle(array) {
  var currentIndex = array.length,
    randomIndex;

  console.log(array.length);
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
  let alphabetList = document.querySelector("#word-list");
  let alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

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
            html += `<li class="passed-words">${letter}</li> <hr>`;
          });
          alphabetList.innerHTML = html;
        });
    })
    .catch((error) => {
      console.log("Transaction failed: ", error);
    })
    .then((e) => {
      console.log("here");
      magnifyWords(e);
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

inputContainer.addEventListener("scroll", function () {
  console.log(`input`, inputContainer.scrollTop);
  console.log(`word list`, wordList.scrollTop);

  if (inputContainer.scrollTop > 150) {
    console.log("here");
    wordList.scrollTop = wordList.scrollHeight;
  } else {
    wordList.scrollTop = inputContainer.scrollTop;
  }
});

wordList.addEventListener("scroll", function () {
  if (wordList.scrollTop < 150) {
    inputContainer.scrollTop = wordList.scrollTop;
  } else {
    inputContainer.scrollTop = inputContainer.scrollHeight;
  }
});

const magnifyWords = (e) => {
  document.body.addEventListener("click", function (e) {
    console.log(e.target);
    let selected = document.querySelectorAll(".selected-text");
    let currentNumber = e.target.dataset.id;
    let passedWords = document.querySelectorAll(".passed-words");

    if (e.target.className == "input-cell") {
      console.log("ok");
      console.log(e.target.dataset.id);
      passedWords[currentNumber].className = "passed-words selected-text";
      for (i = 0; i < selected.length; i++) {
        selected[i].classList.remove("selected-text");
        selected[i].className = "passed-words";
      }
    }

    magnifyWordsWithTab(passedWords, currentNumber);
  });
};

const magnifyWordsWithTab = (list, number) => {
  document.addEventListener("keydown", function (e) {
    if (e.keyCode == "9") {
      console.log(e.target);
      let number = parseInt(e.target.dataset.id) + 1;
      if (e.target.className == "input-cell") {
        list[number].className = "passed-words selected-text";
        number;
        list.forEach((word, index) => {
          if (word !== list[number]) {
            word.classList.remove("selected-text");
          }
        });
      }
    }
  });
};
