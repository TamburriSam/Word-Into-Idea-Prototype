const db = firebase.firestore();
const userName = document.querySelector("#greetingBox");
const signInStatus = document.querySelector("#user");
const userPic = document.querySelector("#photo");
let currentRoom = document.querySelector("#roomName");
const auth = firebase.auth();

const directionOne = `Here's another column.`;
const directionTwo =
  "Do the same as you did in the previous step: create a column of words.";

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

auth.onAuthStateChanged((user) => {
  let firstName = user.displayName.split(" ")[0];
  if (user && user.photoURL) {
    userName.innerHTML = `Hi ${firstName}`;
  } else {
    userName.innerHTML = `<a>Sign Out ROOM NAME</a>`;
    userName.innerHTML = "Hi," + "Student";
  }

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
  }, 2500);

  setTimeout(() => {
    startTimer();
  }, 3000);
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

function startGame(room) {
  room = db.collection("users").doc(auth.currentUser.uid);
  let docRef = "";
  let id = "";
  let wantedList = "";
  let myCode = "";
  let user_name = "";
  let myIndex = "";
  let recipients = "";
  let list_two = "";
  let defaultList = "";

  return db
    .runTransaction((transaction) => {
      return transaction.get(room).then((doc) => {
        myCode = doc.data().rooms_joined;
        user_name = doc.data().user_name;
        myIndex = doc.data().index;
        recipients = doc.data().recipients;
        list_two = doc.data().list_two_input;
        docRef = doc.data().rooms_joined;
        id = doc.id;
      });
    })
    .then(() => {
      db.collection("rooms")
        .doc(docRef)
        .get()
        .then((doc) => {
          let listTwoData = doc.data().list_two;

          //all list one inputs from room values only
          const propertyValues = Object.values(listTwoData);

          //randomint based on amount of list one inputs
          let randomInt = getRandomInt(0, propertyValues.length - 2);

          //default list
          defaultList = propertyValues[0];

          //all list one inputs from room except ours
          let allFiltered = propertyValues.filter((list) => {
            return !arraysEqual(list, list_two);
          });

          //random list one input that is not ours
          wantedList = allFiltered[randomInt];
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

function listUp(list) {
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
      let listofInp = document.querySelector("#input-list");
      let html = "";
      let count = 0;

      for (let i = 0; i < 26; i++) {
        html += `<li><input type="text" data-id="${count}" placeholder="enter word" class="input-cell" </input> </li>`;
        count++;
      }

      let buttonContainer = document.querySelector("#button-container");
      buttonContainer.innerHTML = `<button data-id="next-3"class="next next-3" id="${doc.id}">Continue</button>`;
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

const magnifyWordsWithTab = (list) => {
  document.addEventListener("keydown", function (e) {
    if (e.keyCode == "9") {
      let number = parseInt(e.target.dataset.id) + 1;
      if (e.target.className == "input-cell") {
        list[number].className = "passed-words selected-text";
        number;
        list.forEach((word) => {
          if (word !== list[number]) {
            word.classList.remove("selected-text");
          }
        });
      }
    }
  });
};

//event listener for next that stores input list three
document.body.addEventListener("click", function (e) {
  e.preventDefault();
  if (e.target.dataset.id === "next-3" || e.keyCode === 13) {
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

        list_three = {
          [randomInt]: cells,
        };
      });

      return docRef
        .set(
          {
            list_three,
          },
          { merge: true }
        )
        .then(() => {
          window.location = "game4.html";
          inputForm.reset();
        });
    }
  }
});

function updateUserInputList() {
  let userRef = db.collection("users").doc(auth.currentUser.uid);
  let userWords = [];

  let inputList = document.querySelectorAll(".input-cell");
  inputList.forEach((cell) => {
    if (cell.value === "") {
      return false;
    } else {
      userWords.push(cell.value);

      userRef.update({
        list_three_input: userWords,
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

        if (word.value == "") {
          word.value = words[randomInt];
        }
      });
    })
    .then(() => {
      inputList.forEach((word) => {
        userRef
          .update({
            list_three_input: firebase.firestore.FieldValue.arrayUnion(
              word.value
            ),
          })
          .then(() => {
            window.location = "game4.html";
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
  if (inputContainer.scrollTop > 150) {
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

document.body.addEventListener("keyup", (e) => {
  e.preventDefault();
  let targetId = document.querySelector(".next").getAttribute("id");

  if (e.keyCode === 13) {
    let inputList = document.querySelectorAll(".input-cell");

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

        list_three = {
          [randomInt]: cells,
        };
      });

      return docRef
        .set(
          {
            list_three,
          },
          { merge: true }
        )
        .then(() => {
          window.location = "game4.html";
          inputForm.reset();
        });
    }
  }
});
