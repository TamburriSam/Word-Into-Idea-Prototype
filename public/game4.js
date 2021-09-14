const db = firebase.firestore();
const userName = document.querySelector("#user");

const auth = firebase.auth();
let directionOne = `You've received a paper with a random classmate's words.`;

const directionTwo =
  "For each word, type the first word that pops into your head.";
const directionThree = `The word chosen doesn't have to be related to the word given.`;
const directionFour =
  "Scroll or use the tab button to navigate the word lists.";
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

auth.onAuthStateChanged((user) => {
  /*   let firstName = user.displayName.split(" ")[0];
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
  } */
  showInstructions();

  startGame();
});

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
    startTimer();
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

function startGame(room) {
  room = db.collection("users").doc(auth.currentUser.uid);
  let docRef = "";
  let id = "";
  let thirdList = "";
  let wantedList = "";
  let myCode = "";
  var usersReference = db.collection("users");
  let user_name = "";
  let myIndex = "";
  let recipients = "";
  let list_three = "";

  return db
    .runTransaction((transaction) => {
      return transaction.get(room).then((doc) => {
        myCode = doc.data().rooms_joined;
        user_name = doc.data().user_name;
        myIndex = doc.data().index;
        recipients = doc.data().recipients;
        list_three = doc.data().list_three_input;
        docRef = doc.data().rooms_joined;
        id = doc.id;
      });
    })
    .then(() => {
      //get words first
      //get words from this class' list_one only
      db.collection("rooms")
        .doc(docRef)
        .get()
        .then((doc) => {
          let listThreeData = doc.data().list_three;

          //get items from room
          let usersRef = db.collection("rooms").doc(docRef);

          //all list one inputs from room values only
          const propertyValues = Object.values(listThreeData);

          //randomint based on amount of list one inputs
          let randomInt = getRandomInt(0, propertyValues.length - 2);

          //default list
          defaultList = propertyValues[0];

          //all list one inputs from room except ours
          let allFiltered = propertyValues.filter((list) => {
            return !arraysEqual(list, list_three);
          });

          //random list one input that is not ours
          wantedList = allFiltered[randomInt];

          console.log(wantedList);
        })
        .then(() => {
          if (wantedList) {
            listUp(wantedList);
            getRoomCountForInput(docRef);
          } else {
            listUp(defaultList);
          }
        });
    });
}

function listUp(list, secondList) {
  let inputList = document.querySelector("#word-list");

  let html = "";
  list.forEach((word) => {
    html += `<li class="passed-words">${word}</li> <hr>`;
  });
  inputList.innerHTML = html;
}

function getRoomCountForInput(room) {
  db.collection("rooms")
    .doc(room)
    .get()
    .then((doc) => {
      console.log(doc.data());
      let listofInp = document.querySelector("#input-list");
      let html = "";
      let count = 0;

      for (let i = 0; i < 26; i++) {
        html += `<li><input type="text" data-id="${count}" placeholder="enter word" class="input-cell" </input> </li>`;
        count++;
      }

      let buttonContainer = document.querySelector("#button-container");
      buttonContainer.innerHTML = `<a data-id="next-4"class="next next-2 waves-effect  waves-light btn" id="${doc.id}">Continue</a>`;
      listofInp.innerHTML = html;
    })
    .then((e) => {
      magnifyWords(e);
    });
}

const magnifyWords = (e) => {
  document.body.addEventListener("click", function (e) {
    let selected = document.querySelectorAll(".selected-text");
    let currentNumber = e.target.dataset.id;
    let passedWords = document.querySelectorAll(".passed-words");

    if (e.target.className == "input-cell") {
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

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

document.body.addEventListener("click", function (e) {
  e.preventDefault();
  if (e.target.dataset.id === "next-4") {
    let targetId = e.target.id;
    let inputList = document.querySelectorAll(".input-cell");

    console.log("here");

    let cells = [];

    let docRef = db.collection("rooms").doc(targetId);
    updateUserInputList();

    const validInputs = Array.from(inputList).filter(
      (input) => input.value !== ""
    );

    console.log(`INPUT LENGTH`, inputList.length);
    console.log(`VALID INPUT`, validInputs);

    if (validInputs.length < inputList.length) {
      console.log("need all cells");
      warningBox.style.display = "block";
      document.getElementById("inputForm").scrollTop = 0;

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

        list_four = {
          [randomInt]: cells,
        };
      });

      return docRef
        .set(
          {
            list_four,
          },
          { merge: true }
        )
        .then(() => {
          window.location = "finalPage.html";
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
      console.log("must enter all cells");
      return false;
    } else {
      userRef
        .update({
          list_four_input: firebase.firestore.FieldValue.arrayUnion(cell.value),
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

document.getElementById("timer").innerHTML = 04 + ":" + 59;

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
  let userRef = db.collection("users").doc(auth.currentUser.uid);
  let wordsRef = db.collection("words").doc("words");
  let words = "";
  wordsRef
    .get()
    .then((doc) => {
      words = doc.data().words;
    })
    .then(() => {
      inputList.forEach((word) => {
        let randomInt = Math.floor(Math.random() * 1200);
        let allWords = [];

        if (word.value == "") {
          word.value = words[randomInt];
        }
      });
    })
    .then(() => {
      inputList.forEach((word) => {
        userRef
          .update({
            list_four_input: firebase.firestore.FieldValue.arrayUnion(
              word.value
            ),
          })
          .then(() => {
            window.location = "finalPage.html";
          });
      });
    });
}

let inputContainer = document.getElementById("inputForm");
let wordList = document.getElementById("word-list-container");
function inputOnScroll() {
  inputContainer.scrollTop = wordList.scrollTop;
}

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
