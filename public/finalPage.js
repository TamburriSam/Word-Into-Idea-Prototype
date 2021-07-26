const db = firebase.firestore();
const userName = document.querySelector("#userNameContainer");

const auth = firebase.auth();

auth.onAuthStateChanged((user) => {
  if (user) {
    userName.innerHTML = `Hello ` + user.displayName;
    loadColumns(auth.currentUser.uid);
    watchForZeroCount();
  }
});

const watchForZeroCount = (roomCode) => {
  let userRef = db.collection("users").doc(auth.currentUser.uid);
  return db
    .runTransaction((transaction) => {
      // This code may get re-run multiple times if there are conflicts.
      return transaction
        .get(userRef)
        .then((doc) => {
          roomCode = doc.data().rooms_joined;
        })
        .then(() => {
          let docRef = db.collection("rooms").doc(roomCode);

          docRef.onSnapshot((snapshot) => {
            if (snapshot.data().active_count < 1) {
              console.log("here");

              //CHANGE THIS WHEN WE DONT WANT IT TO ACTUALLY DELETE ROOM
              /* db.collection("rooms")
                .doc("roomCode")
                .delete()
                .then(() => {
                  console.log("Document successfully deleted!");
                })
                .catch((error) => {
                  console.error("Error removing document: ", error);
                }); */
            }
          });
        });
    })
    .catch((error) => {
      console.log("Transaction failed: ", error);
    });
};

let allInputs = [];

function loadColumns(id) {
  let firstCol = document.getElementById("first-list");
  let secondCol = document.getElementById("second-list");
  let thirdCol = document.getElementById("third-list");
  let fourthCol = document.getElementById("fourth-list");

  db.collection("users")
    .doc(id)
    .get()
    .then((doc) => {
      let list1 = doc.data().list_one_input;
      let list2 = doc.data().list_two_input;
      let list3 = doc.data().list_three_input;
      let list4 = doc.data().list_four_input;

      allInputs = [list1, list2, list3, list4];
      allInputs = allInputs.flat();
      populateListWithInputValue(firstCol, list1);
      populateListWithInputValue(secondCol, list2);
      populateListWithInputValue(thirdCol, list3);
      populateListWithInputValue(fourthCol, list4);

      console.log(allInputs);
    });
}

function populateListWithInputValue(htmlList, dbList) {
  let userRef = db.collection("users").doc(auth.currentUser.uid);
  userRef.get().then((doc) => {
    let html = "";
    dbList.forEach((word) => {
      html += `<li>${word}</li>`;
    });
    htmlList.innerHTML = html;
  });
}

document.getElementById("test").addEventListener("click", function () {
  const doc = new jsPDF();
  doc.text(allInputs, 10, 10);
  doc.save("a4.pdf");
  deleteOnTimeout();
});

function deleteOnTimeout() {
  var userRef = db.collection("users").doc(auth.currentUser.uid);
  let roomCode = "";

  setTimeout(() => {
    return db.runTransaction((transaction) => {
      return transaction
        .get(userRef)
        .then((doc) => {
          roomCode = doc.data().rooms_joined;
        })
        .then(() => {
          let docRef = db.collection("rooms").doc(roomCode);

          docRef.get().then((doc) => {
            let newCount = doc.data().active_count - 1;

            docRef.update({
              active_count: newCount,
            });
          });
        })
        .catch((error) => {
          console.log("Transaction failed: ", error);
        });
    });
  }, 7000);
}
