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
    document.querySelector(".switch").innerHTML = "SOLO MODE";
    document.getElementById("switch-container").style.justifyContent = "center";
    singleMode();
  } else {
    return false;
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
        let wordsRef = db.collection("words").doc("words");

        wordsRef
          .get()
          .then((doc) => {
            for (let i = 0; i < 26; i++) {
              let randomInt = Math.floor(Math.random() * 1200);

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
      .then(() => {})
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

  let wantedArr = huhArray[position];

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

  return db
    .runTransaction((transaction) => {
      return transaction.get(room).then((doc) => {
        roomCode = doc.data().rooms_joined;
        user_name = doc.data().user_name;
        roomCount = doc.data().total_count;
      });
    })
    .then(() => {
      db.collection("rooms")
        .doc(roomCode)
        .get()
        .then((doc) => {
          position = doc.data().users.length;
          roomCount = doc.data().total_count;
        });
    })
    .then(() => {
      db.collection("users")
        .doc(auth.currentUser.uid)
        .get()
        .then(() => {
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

let photoBox = document.querySelector("#photoURL");

auth.onAuthStateChanged((user) => {
  let firstName = user.displayName.split(" ")[0];

  if (user && user.photoURL) {
    userName.innerHTML = firstName;
    photoBox.innerHTML = `<img class="photoURL" src="${user.photoURL}" alt=""/>`;
  } else {
    userName.innerHTML = firstName;
    photoBox.innerHTML = `<img class="photoURL" src="logos/user.png" alt=""/>`;
  }

  db.collection("rooms").onSnapshot((snapshot) => {
    setUpRooms(snapshot.docs);
  });
});

const setUpRooms = (data) => {
  let r = document.querySelector(".tbody1"); //if there is data

  if (data.length) {
    let html = "";
    data.forEach((doc) => {
      if (doc.data().users.includes(auth.currentUser.displayName)) {
        rejoin();
      }
      roomFullDisableButton();

      const room = doc.data();

      if (room.name.length < 22) {
        const li = `<tr><td>${room.name}</td> <td>${room.active_count}/${room.total_count} Active </td> <td> <a data-id="btn" class="waves-effect waves-light btn room-select" id="${doc.id}">Join</a> </td></tr><br>`;
        html += li;
      } else {
        const li = `<tr><td>Solo Room</td> <td>One Player Active </td> <td> <a data-id="btn" class="waves-effect waves-light btn room-select" id="${doc.id}">Join</a> </td></tr><br>`;
        html += li;
      }
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
    document.querySelector(".switch").innerHTML = "COLLABORATIVE MODE";
    document.getElementById("switch-container").style.justifyContent = "center";
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
        } else {
          return false;
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
  liveRoomBox.style.display = "none";

  return db
    .runTransaction((transaction) => {
      return transaction.get(docref).then((doc) => {
        //right here we need to add something else that denies user another click if their username is found
        if (
          doc.data().active_count < doc.data().total_count &&
          !doc.data().users.includes(auth.currentUser.displayName)
        ) {
          let newCount = doc.data().active_count + 1;
          transaction.update(docref, { active_count: newCount });
          transaction.update(docref, {
            users: firebase.firestore.FieldValue.arrayUnion(
              firebase.auth().currentUser.displayName
            ),
          });
          checkForLetter();
        } else if (doc.data().users.includes(auth.currentUser.displayName)) {
          checkForLetter();
        }
      });
    })
    .then((doc) => {
      getUsers(docref);
      isRoomFull(room);
    })
    .catch((err) => {
      console.log("err on line 341", err);
    });
}

function getUsers(room) {
  let inputList = document.querySelector("#user-list");

  //display the usernames

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

function startCountdown(seconds) {
  let counter = seconds;

  const interval = setInterval(() => {
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
      if (doc.data().favorite_letter == "") {
        makeItModal();
      } else {
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

  fastfactBox.style.display = "inline-block";
  document.getElementById("container").style.textAlign = "center";
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

          modalContent.innerHTML =
            "Thank You. The game will begin once all classmates have entered the room.";
          setTimeout(() => {
            modalContent.innerHTML = "Your Favorite Letter";
          }, 5000);

          document.getElementById("container").style.textAlign = "unset";
          /*     modalContent.innerHTML = "Your Favorite Letter"; */
          document.querySelector("#waiting").style.display = "block";
          inputList.style.display = "block";
          inputHolder.style.display = "block";
          inputContainer.innerHTML = favoriteLetter.toUpperCase();
          fastfactBox.style.margin = "unset";
          fastfactBox.style.height = "74vh";
          fastfactBox.style.top = "unset";
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

function populateAlphabet() {
  let userRef = db.collection("users").doc(auth.currentUser.uid);
  var roomRef = db.collection("rooms");
  let roomCode = "";

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
        .then((doc) => {});
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

  if (roomCount.value < 1 || typeof parseInt(roomCount.value) !== "number") {
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
        console.log(".");
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
      let wordsRef = db.collection("words").doc("words");
      let roomRef = db.collection("rooms").doc(auth.currentUser.uid);
      var userRef = db.collection("users").doc(auth.currentUser.uid);
      let roomOneArray = [];
      let roomTwoArray = [];
      let roomThreeArray = [];
      let roomFourArray = [];

      wordsRef
        .get()
        .then((doc) => {
          for (let i = 0; i < 26; i++) {
            let randomInt = Math.floor(Math.random() * 1200);
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
      let liveRoomBox = document.querySelector(".liveRoom");
      let fastfactBox = document.querySelector("#fast-facts");

      liveRoomBox.style.display = "none";
      fastfactBox.style.display = "block";
      makeItModal();
    })
    .then(() => {
      setTimeout(() => {
        mockUsers();
      }, 2000);
    })
    .then(() => {
      setTimeout(() => {
        startCountdown(9);
      }, 12000);
    })
    .catch((err) => {
      console.log(`Err on line 254`, err);
    });
}

function mockUsers() {
  let inputList = document.querySelector("#user-list");

  //display the usernames
  //but we want to set up a listener

  let i = 1;

  setInterval(() => {
    if (i < 11) {
      let randomInt = Math.floor(Math.random() * 19) + 1;
      inputList.innerHTML += `<li class="profile-holder"> <img
      class="profilepic"
      src="logos/icons/${randomInt}.png"
      alt=""
    />Live Student ${i}</li>`;
      i++;
    } else {
      return false;
    }
  }, 1000);
}
