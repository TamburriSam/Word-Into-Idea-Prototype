const db = firebase.firestore();
const userName = document.querySelector("#user");

const auth = firebase.auth();

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
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
  startGame();
});

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
  var usersReference = db.collection("users");
  let user_name = "";
  let myIndex = "";
  let recipients = "";
  let thirdList = "";
  let list_one = "";

  return db
    .runTransaction((transaction) => {
      return transaction.get(room).then((doc) => {
        myCode = doc.data().rooms_joined;
        user_name = doc.data().user_name;
        myIndex = doc.data().index;
        recipients = doc.data().recipients;
        list_one = doc.data().list_one_input;
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
          let usersRef = db.collection("rooms").doc(docRef);
          getUsers(usersRef);
          let data = doc.data().list_two;
          let inputList = document.querySelector("#word-list2");
          const propertyValues = Object.values(data);
          let randomInt = getRandomInt(0, propertyValues.length - 1);

          console.log(doc.data().list_two[1]);
          let pregeneratedList = Object.values(data);

          console.log("DATA DATA", doc.data().list_two[1]);
          console.log(`NEW PROP VAL`, propertyValues);

          console.log(`property values`, propertyValues[randomInt]);

          console.log(`random int`, randomInt);

          //HAS TO BE CHANGED
          wantedList = propertyValues[randomInt];

          if (wantedList === list_one) {
            wantedList = doc.data().list_two[1];
          } else {
            wantedList = propertyValues[randomInt];
          }
          thirdList = propertyValues[randomInt];

          console.log(`wanted list`, wantedList);
        })
        .then(() => {
          let yourRoomList = [];
          let secondList = [];

          console.log("HERE");
          db.collection("users")
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                if (
                  doc.data().rooms_joined === myCode &&
                  doc.data().user_name !== user_name &&
                  doc.data().flag < 2
                ) {
                  console.log(`DOC TO MESS W`, doc.data());
                  console.log(`DATA`, doc.data().uid);

                  yourRoomList.push(doc.data());

                  console.log(`YOUR ROOM LIST`, yourRoomList);

                  console.log(`USER WE WANT 2`, yourRoomList[0].uid);

                  let targetUsersId = yourRoomList[0].uid;

                  let newCount = parseInt(doc.data().flag) + 1;
                  db.collection("users")
                    .doc(targetUsersId)
                    .update({ flag: parseInt(newCount) });
                } else {
                  console.log("not it");
                }
              });

              console.log(`USER WE WANT`, yourRoomList[0]);

              ///ITS GETTING CUT OFF AT THE LENGTH WHY???
              ///ITS MATCHING BECAUSE THE ARRAY IS SHORTER
              console.log(`WANTED LISTR HERE`, wantedList);
              console.log(`ROOM LIST`, yourRoomList);
              /*  console.log(`THE THING YOU WANT`, yourRoomList[1].list_two_input) */
              console.log("I DONT GET IT", yourRoomList);

              //CHANGE THE 0 IN ROOM LIST TO MATCH RECIPIENT NUMBER ON ACTUAL GAME EXECUTION
              noDuplicates(
                wantedList
                /*   yourRoomList[0].list_one_input,
                yourRoomList[1].list_one_input */
              );
              getRoomCountForInput(docRef);
            });
        })
        .then(() => {});
    });
}

function getUsers(room) {
  let inputList = document.querySelector("#user-list");
  inputList.style.display = "block";
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

      html += `<a data-id="next-3"class="waves-effect waves-light btn next-3" id="${doc.id}">Continue</a>`;
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

//event listener for next that stores input list three
document.body.addEventListener("click", function (e) {
  e.preventDefault();
  if (e.target.dataset.id === "next-3") {
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
      let list_three = {};
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

  let inputList = document.querySelectorAll(".input-cell");
  inputList.forEach((cell) => {
    if (cell.value === "") {
      console.log("must enter all cells");
      return false;
    } else {
      userRef
        .update({
          list_three_input: firebase.firestore.FieldValue.arrayUnion(
            cell.value
          ),
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

function noDuplicates(list, secondList, thirdList) {
  let inputList = document.querySelector("#word-list");
  let indices = [];

  let room = db.collection("users").doc(auth.currentUser.uid);

  room.get().then((doc) => {
    console.log(`general list length`, list.length);
    console.log(`my list length`, doc.data().list_two_input.length);

    console.log(`your list two input from rooms db`, doc.data().list_two_input);

    console.log(`random list_two from db`, list);

    for (let i = 0; i < doc.data().list_two_input.length; i++) {
      indices.push(i);
    }
    console.log(`INDICES`, indices);

    console.log(`your list two input from rooms db`, doc.data().list_two_input);

    console.log(`random list_two from db`, list);

    list_two_received = list;

    if (
      doc.data().list_two_received &&
      doc.data().list_two_received.length > 0
    ) {
      console.log("ok");
      //set with merge overwrites the field we want
      //without merge it would override the whole document
      room.set(
        {
          list_two_received,
        },
        { merge: true }
      );

      let html = "";
      list.forEach((word) => {
        html += `<li class="passed-words">${word}</li> <hr>`;
      });
      inputList.innerHTML = html;
      console.log("good");

      if (arraysEqual(list, doc.data().list_two_input) == true) {
        console.log("trueeeeee");

        noDuplicates(secondList);
        secondList.forEach((word) => {
          room
            .update({
              list_two_received: firebase.firestore.FieldValue.arrayUnion(word),
            })
            .then(() => {
              console.log("list two received added");
            })
            .catch((err) => {
              console.log(err);
            });
          console.log("fetched from list_two");
        });
      } else {
        list.forEach((word) => {
          room
            .update({
              list_two_received: firebase.firestore.FieldValue.arrayUnion(word),
            })
            .then(() => {
              console.log("list one received added");
            })
            .catch((err) => {
              console.log(err);
            });
          console.log("fetched from list_two");
        });
      }
    } else {
      let html = "";
      list.forEach((word) => {
        html += `<li>${word}</li> <hr>`;
      });
      inputList.innerHTML = html;
      console.log("good");

      if (arraysEqual(list, doc.data().list_two_input) == true) {
        //ITS NOT LOGGING TRUEEEEE
        //BC ITS FALSE
        //OK GOOD THAT WE GOT THE ERROR BC IT IS TRUE BUT SOMETHINGS HAPPENING THATS THROWING THE ERROR
        //IS IT SOMETHING TO DO W SECONDARY LIST?
        console.log("trueeeeee");

        noDuplicates(secondList);

        if (secondList.length === 0) {
          noDuplicates(thirdList);
        } else {
          secondList.forEach((word) => {
            room
              .update({
                list_two_received:
                  firebase.firestore.FieldValue.arrayUnion(word),
              })
              .then(() => {
                console.log("list two received added");
              })
              .catch((err) => {
                console.log(err);
              });
            console.log("fetched from list_two");
          });
        }
      } else {
        list.forEach((word) => {
          room
            .update({
              list_two_received: firebase.firestore.FieldValue.arrayUnion(word),
            })
            .then(() => {
              console.log("list one received added");
            })
            .catch((err) => {
              console.log(err);
            });
          console.log("fetched from list_two");
        });
      }
    }

    console.log(arraysEqual(list, doc.data().list_two_input));
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

let inputContainer = document.getElementById("inputForm");
let wordList = document.getElementById("word-list-container");
function inputOnScroll() {
  inputContainer.scrollTop = wordList.scrollTop;
}

inputContainer.addEventListener("scroll", function () {
  wordList.scrollTop = inputContainer.scrollTop;
});

wordList.addEventListener("scroll", function () {
  inputContainer.scrollTop = wordList.scrollTop;
});
