//const { default: firebase } = require("firebase");
const userName = document.querySelector("#greetingBox");
const signInStatus = document.querySelector("#user");
const userPic = document.querySelector("#photo");
let currentRoom = document.querySelector("#roomName");
const directionOne = `Here's a list of letters.`;
const directionTwo =
  "Replace each letter with a word that you think you might like to write with.";
const directionThree = `The word can begin with the letter or not.`;
const directionFour = "Let your mind run free!";
const db = firebase.firestore();
const auth = firebase.auth();
let inputContainer = document.getElementById("inputForm");
let wordList = document.getElementById("word-list-container");

auth.onAuthStateChanged((user) => {
  let firstName = user.displayName.split(" ")[0];
  if (user && user.photoURL) {
    userName.innerHTML = `Hi ${firstName}`;
  } else {
    console.log(user.displayName.length);
    userName.innerHTML = `<a>Sign Out ROOM NAME</a>`;

    userName.innerHTML = "Hi," + "Student";
  }

  showInstructions();
  startGame();
});

window.addEventListener("DOMContentLoaded", (event) => {
  document.getElementById("inputForm").style.textAlign = "center";
  document.getElementById("input-list").style.width = "100%";
  document.querySelector(".next").style.left = "unset";
});

const getCurrentRoom = () => {
  let roomName = "";
  db.collection("users")
    .doc(auth.currentUser.uid)
    .get()
    .then((doc) => {
      if (doc.data().rooms_joined.length > 15) {
        let room = doc.data().rooms_joined.substr(0, 4);

        roomName = `Room ` + room;
      } else {
        roomName = doc.data().rooms_joined;
      }
    })
    .then(() => {
      currentRoom.innerHTML = roomName;
    });
};

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
  }, 2500);
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
    showInstructionsFour();
  }, 3500);
};

const showInstructionsFour = () => {
  setTimeout(() => {
    var i = 0;
    var txt = directionFour;
    var speed = 25;

    function typeWriter() {
      if (i < txt.length) {
        document.getElementById("instruction-four").innerHTML += txt.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
      }
    }
    typeWriter();
    startTimer();
  }, 4500);
};

//can use transaction here since we aren't changing anything
//i actually think we can use transactions if we just take it slow

const startGame = () => {
  let room = db.collection("users").doc(auth.currentUser.uid);

  let docRef = "";
  let id = "";
  return db.runTransaction((transaction) => {
    return transaction
      .get(room)
      .then((doc) => {
        docRef = doc.data().rooms_joined;
        id = doc.id;
      })
      .then(() => {
        db.collection("rooms")
          .doc(docRef)
          .get()
          .then((doc) => {
            populateAlphabet(docRef);
          });
      });
  });
};

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

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
  let alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
  let listofInp = document.querySelector("#input-list");
  let count = 0;

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
          console.log("dov", doc.id);
          let html = "";
          alphabet.forEach((letter) => {
            html += `<li><input type="text" data-id="${count}" class="input-cell" </input><span class="placeholder">${letter}</span> </li>`;
            count++;
          });
          let buttonContainer = document.querySelector("#button-container");
          buttonContainer.innerHTML = `<button data-id="next-1"class="next" id="${doc.id}">Continue</button>`;
          listofInp.innerHTML = html;
        });
    })
    .catch((error) => {
      console.log("Transaction failed: ", error);
    });
}

function getUsers(room) {
  let inputList = document.querySelector("#user-list");
  inputList.style.display = "block";

  room.onSnapshot((snapshot) => {
    let html = "";
    snapshot.data().users.forEach((user) => {
      let randomInt = Math.floor(Math.random() * 19) + 1;
      html += `<li class="profile-holder"> <img
      class="profilepic"
      src="logos/icons/${randomInt}.png"
      alt=""
    />${user}     </li>`;
    });
    inputList.innerHTML = html;
  });
}

let warningBox = document.querySelector("#warningBox");

document.body.addEventListener("click", function (e) {
  e.preventDefault();
  submitList(e);
});

document.body.addEventListener("keyup", (e) => {
  e.preventDefault();
  let targetId = document.querySelector(".next").getAttribute("id");

  if (e.keyCode === 13) {
    asd;
    let cells = [];

    let docRef = db.collection("rooms").doc(targetId);
    updateUserInputList();

    const validInputs = Array.from(inputList).filter(
      (input) => input.value !== ""
    );

    if (validInputs.length < inputList.length) {
      let list_one = {};
      warningBox.style.display = "block";
      warningBox.style.height = "fit-content";
      warningBox.innerHTML = "All cells must be filled before continuing";
      setTimeout(() => {
        warningBox.style.display = "none";
      }, 4000);
      return false;
    } else {
      inputList.forEach((cell) => {
        cells.push(cell.value);
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

function submitList(e) {
  if (e.target.dataset.id === "next-1") {
    let targetId = e.target.id;
    let inputList = document.querySelectorAll(".input-cell");

    let cells = [];

    let docRef = db.collection("rooms").doc(targetId);
    updateUserInputList();

    const validInputs = Array.from(inputList).filter(
      (input) => input.value !== ""
    );

    if (validInputs.length < inputList.length) {
      warningBox.style.display = "block";
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
}
function updateUserInputList() {
  let userRef = db.collection("users").doc(auth.currentUser.uid);
  let userWords = [];

  let inputList = document.querySelectorAll(".input-cell");
  inputList.forEach((cell) => {
    if (cell.value === "") {
      //maybe red
      return false;
    } else {
      userWords.push(cell.value);

      userRef.update({
        list_one_input: userWords,
      });
    }
  });
}

document.getElementById("timer").innerHTML = 06 + ":" + 59;

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
