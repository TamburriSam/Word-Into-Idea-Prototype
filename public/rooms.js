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
    document.querySelector("#waiting").style.display = "block";
    document.querySelector("#waiting").innerHTML = "Game Starting Soon";

    singleMode();
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
  let roomOneArray = [];
  let roomTwoArray = [];
  let roomThreeArray = [];
  let roomFourArray = [];
  return db.runTransaction((transaction) => {
    // This code may get re-run multiple times if there are conflicts.
    return transaction
      .get(userRef)
      .then((doc) => {
        console.log(`yoooo`, doc.data().rooms_joined);
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
            console.log(`DATAAAAA`, doc.data());
            roomCount = doc.data().total_count;

            console.log(`ROOM COUTN`, parseInt(roomCount));
          })
          .catch((err) => {
            console.log("err", err);
          });
      })
      .then(() => {
        let roomRef = db.collection("rooms").doc(roomCode);
        console.log("ROOMREF", roomCode);
        let wordsRef = db.collection("words").doc("words");

        wordsRef
          .get()
          .then((doc) => {
            console.log(doc.data().words);

            for (let i = 0; i < 26; i++) {
              let randomInt = Math.floor(Math.random() * 1200);

              console.log(`random int`, randomInt);

              let randomInt1 = Math.floor(Math.random() * 1200);
              let randomInt2 = Math.floor(Math.random() * 1200);
              let randomInt3 = Math.floor(Math.random() * 1200);
              roomOneArray.push(doc.data().words[randomInt]);
              roomTwoArray.push(doc.data().words[randomInt1]);
              roomThreeArray.push(doc.data().words[randomInt2]);
              roomFourArray.push(doc.data().words[randomInt3]);
            }
          })
          .then(() => {
            list_one = {
              0: roomOneArray,
            };

            list_two = {
              1: roomTwoArray,
            };

            list_three = {
              1: roomThreeArray,
            };

            list_four = {
              1: roomFourArray,
            };

            return roomRef.update({
              list_one,
              list_two,
              list_three,
              list_four,
            });
          })
          .catch((err) => {
            console.log("ere on line 76", err);
          });

        console.log("fetched here first");
      })
      .then(() => {
        console.log("YEEHAH");
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
  /* roomFullDisableButton();

  rejoin(); */
});

const setUpRooms = (data) => {
  let r = document.querySelector(".tbody1"); //if there is data

  if (data.length) {
    let html = "";
    data.forEach((doc) => {
      if (doc.data().users.includes(auth.currentUser.displayName)) {
        console.log("TRUEEEEE");
        rejoin();
      }
      roomFullDisableButton();

      const room = doc.data();

      console.log(doc.id);
      //console.log("Iterated snapshot", room);
      /* const li = `<li class="room-info"><div>${room.name}</div> ${room.active_count}/${room.total_count} Active<a data-id="btn" class="waves-effect waves-light btn room-select" id="${doc.id}">Join</a> </li> <br>
      `; */

      if (room.name.length < 22) {
        console.log(room.name);
        const li = `<tr><td>${room.name}</td> <td>${room.active_count}/${room.total_count} Active </td> <td> <a data-id="btn" class="waves-effect waves-light btn room-select" id="${doc.id}">Join</a> </td></tr><br>`;

        html += li;
      } else {
        const li = `<tr><td>Solo Room</td> <td>One Player Active </td> <td> <a data-id="btn" class="waves-effect waves-light btn room-select" id="${doc.id}">Join</a> </td></tr><br>`;

        html += li;
      }
      //add event listener that ties the room name with the name in database
    });
    r.innerHTML = html;
  } else {
    return false;
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
        if (doc.data().active_count === doc.data().total_count) {
          document.getElementById(doc.id).disabled = true;
          document.getElementById(doc.id).classList.add("disabled");
          document.getElementById(doc.id).innerHTML = "In Session";

          console.log(document.getElementById(doc.id));
        } else {
          return false;
        }
      });
    });
}

function watchForCount(room) {
  console.log("IDIDIDIDIDID");
  let docref = db.collection("rooms").doc(room);
  let inputList = document.querySelector("#user-list");
  let fastfactBox = document.querySelector("#fast-facts");
  let logoW = document.querySelector(".logo-white");
  let inputHolder = document.querySelector(".user-box");
  let liveRoomBox = document.querySelector(".liveRoom");
  let facts = document.querySelector(".facts");
  liveRoomBox.style.display = "none";

  return db
    .runTransaction((transaction) => {
      return transaction.get(docref).then((doc) => {
        console.log(doc.data().users.includes(auth.currentUser.displayName));
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
          console.log("just checking ");
          checkForLetter();
        } else if (doc.data().users.includes(auth.currentUser.displayName)) {
          console.log("didnt go up");
          checkForLetter();
        }
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

      if (data.favorite_letters) {
        if (
          data.active_count === data.total_count &&
          data.favorite_letters.length === data.total_count
        ) {
          document.getElementById(snapshot.id).disabled = true;
          document.getElementById(snapshot.id).innerHTML = "In Session";
          startCountdown(9);
        }
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

      if (doc.data().favorite_letter == "") {
        makeItModal();
        console.log(`HERE WE GsO`, doc.data());

        console.log(doc.data().favorite_letter);
      } else {
        console.log(doc.data().favorite_letter);

        console.log("booyah");
        return false;
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
  let modalBtn = document.querySelector("#letterSubmit");
  let modalContent = document.querySelector("#notification");
  let inputList = document.querySelector("#user-list");
  let fastfactBox = document.querySelector("#fast-facts");
  let logoW = document.querySelector(".logo-white");
  let inputHolder = document.querySelector(".user-box");
  let letterSubmit = document.querySelector("#letterSubmit");
  let blurb = document.querySelector("#blurb");
  let inputContainer = document.querySelector("#inputContainer");
  /*   modal.style.display = "block";
   */ console.log("clicked");
  fastfactBox.style.display = "inline-block";
  let favoriteLetter = "";

  modalBtn.addEventListener("click", function () {
    if (typeof modalInput.value != "") {
      let favoriteLetter = modalInput.value;
      db.collection("users")
        .doc(auth.currentUser.uid)
        .update({
          favorite_letter: modalInput.value,
        })
        .then(() => {
          addLetterToRoomDb();

          console.log("fav letter successfully added");
          blurb.innerHTML =
            "Thank You. The game will begin once all classmates have entered the room.";
          setTimeout(() => {
            blurb.style.display = "none";
          }, 2000);

          modalContent.innerHTML = "Your Favorite Letter";
          document.querySelector("#waiting").style.display = "block";
          inputList.style.display = "block";
          inputHolder.style.display = "block";
          inputContainer.innerHTML = favoriteLetter;
          fastfactBox.style.margin = "unset";
          fastfactBox.style.height = "74vh";
          letterSubmit.style.display = "none";
        })
        .catch((err) => {
          console.log(`Error on line 317 ${err}`);
        });
    } else {
      return false;
    }
  });
}

// When the user clicks on <span> (x), close the modal

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

let warningBox2 = document.getElementById("warningBox2");
let createNewRoom = document.getElementById("createNewRoom");
let createBox = document.getElementById("create-room");

createNewRoom.addEventListener("click", function () {
  createBox.style.display = "block";
});

createForm.addEventListener("click", () => {
  console.log("booyah");

  console.log(typeof parseInt(roomCount.value));

  if (roomCount.value < 1 || typeof parseInt(roomCount.value) !== "number") {
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
        /*  rejoin();
        roomFullDisableButton(); */
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
      console.log(doc.data());

      if (doc.data() && doc.data().rooms_joined.length > 1) {
        document.getElementById(doc.data().rooms_joined).innerHTML = "Rejoin";
      } else {
        console.log("do nothing");
      }
    });
}

function singleMode() {
  setRoom();
}

const createNewSoloRoom = (id) => {
  db.collection("rooms")
    .doc(id)
    .set({
      name: id,
      total_count: 1,
      active_count: 1,
      users: [],
      list_one: [],
      list_two: [],
      list_three: [],
      list_four: [],
    })
    .then(() => {
      console.log("hello");
      let wordsRef = db.collection("words").doc("words");
      let roomRef = db.collection("rooms").doc(auth.currentUser.uid);
      var userRef = db.collection("users").doc(auth.currentUser.uid);
      let roomCode = "";
      let roomCount = "";
      let roomOneArray = [];
      let roomTwoArray = [];
      let roomThreeArray = [];
      let roomFourArray = [];

      wordsRef
        .get()
        .then((doc) => {
          console.log(doc.data().words);

          for (let i = 0; i < 26; i++) {
            let randomInt = Math.floor(Math.random() * 1200);

            console.log(`random int`, randomInt);

            let randomInt1 = Math.floor(Math.random() * 1200);
            let randomInt2 = Math.floor(Math.random() * 1200);
            let randomInt3 = Math.floor(Math.random() * 1200);
            roomOneArray.push(doc.data().words[randomInt]);
            roomTwoArray.push(doc.data().words[randomInt1]);
            roomThreeArray.push(doc.data().words[randomInt2]);
            roomFourArray.push(doc.data().words[randomInt3]);
          }
        })
        .then(() => {
          list_one = {
            0: roomOneArray,
          };

          list_two = {
            1: roomTwoArray,
          };

          list_three = {
            1: roomThreeArray,
          };

          list_four = {
            1: roomFourArray,
          };

          return roomRef.update({
            list_one,
            list_two,
            list_three,
            list_four,
          });
        })
        .catch((err) => {
          console.log("ere on line 76", err);
        });
    });
};

function setRoom() {
  let uid = firebase.auth().currentUser.uid;

  db.collection("users")
    .doc(uid)
    .set({
      favorite_letter: "k",
      uid: uid,
      flag: parseInt(0),
      /* ADDING USER ID AS ROOM NAME */
      rooms_joined: uid,
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
      let uid = firebase.auth().currentUser.uid;

      createNewSoloRoom(uid);

      console.log("user added");
    })
    .then(() => {})
    .then(() => {
      startCountdown(4);
    })
    .catch((err) => {
      console.log(`Err on line 254`, err);
    });
}
