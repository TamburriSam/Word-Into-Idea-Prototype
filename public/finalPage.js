const db = firebase.firestore();
const userName = document.querySelector("#user");

const auth = firebase.auth();
let textArea = document.getElementById("textArea");
let testBox = document.getElementById("testbox");
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
  loadColumns(auth.currentUser.uid);
  watchForZeroCount();
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
            }
          });
        });
    })
    .catch((error) => {
      console.log("Transaction failed: ", error);
    });
};

/* const li = `<tr><td>${room.name}</td> <td>${room.active_count}/${room.total_count} Active </td> <td> <a data-id="btn" class="waves-effect waves-light btn room-select" id="${doc.id}">Join</a> </td></tr><br>`; */

let allInputs = [];
let wordBox = document.querySelector("#wordBox");
function loadColumns(id) {
  let firstCol = document.getElementById("tbody1");
  let secondCol = document.getElementById("tbody2");
  let thirdCol = document.getElementById("tbody3");
  let fourthCol = document.getElementById("tbody4");

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
      populate(firstCol, list1);
      populate(secondCol, list2);
      populate(thirdCol, list3);
      populate(fourthCol, list4);
    })
    .then(() => {
      console.log("finished");
    });
}

let firstCol = document.getElementById("table1");
let secondCol = document.getElementById("second-list");
let thirdCol = document.getElementById("third-list");
let fourthCol = document.getElementById("fourth-list");

function populate(htmlList, dbList) {
  var userRef = db.collection("users").doc(auth.currentUser.uid);

  return db
    .runTransaction((transaction) => {
      return transaction.get(userRef).then((doc) => {
        let html = "";
        dbList.forEach((word) => {
          /*           html += `<li class="listItems">${word}</li><br>`;
           */
          html += `<tr><td class="listItems">${word}</td></tr>`;
        });
        htmlList.innerHTML = html;
      });
    })
    .then(() => {
      let listItems = document.querySelectorAll(".listItems");
      console.log(listItems.length);
    })
    .catch((error) => {
      console.log("Transaction failed: ", error);
    });
}

function populateListWithInputValue(htmlList, dbList) {
  let userRef = db.collection("users").doc(auth.currentUser.uid);
  userRef.get().then((doc) => {
    let html = "";
    dbList.forEach((word) => {
      html += `<li class="listItems">${word}</li><br>`;
    });
    htmlList.innerHTML = html;
  });
}

textArea.addEventListener("keydown", tryit);

textArea.addEventListener("keydown", function () {
  console.log(textArea.value.length);
  let listItems = document.querySelectorAll(".listItems");

  //compare it

  let words = textArea.value.split(" ");
  let lowercasedWords = [];
  words.forEach((word) => {
    lowercasedWords.push(word.toLowerCase());
  });

  console.log(words);

  if (textArea.value.length == 0) {
    for (let i = 0; i < listItems.length; i++) {
      listItems[i].classList.remove("listItemComplete");
    }
  } else {
    for (let i = 0; i < listItems.length; i++) {
      if (!lowercasedWords.includes(listItems[i].innerHTML.toLowerCase())) {
        listItems[i].classList.remove("listItemComplete");
      }
    }
  }
});

function tryit(e) {
  let listItems = document.querySelectorAll(".listItems");
  textArea.addEventListener("keyup", function (e) {
    if (e.keyCode === 32) {
      let words = textArea.value.split(" ");
      lastWord = words[words.length - 2];

      console.log(`LAST WORD`, lastWord);

      for (let i = 0; i < listItems.length; i++) {
        if (listItems[i].innerHTML.toLowerCase() === lastWord.toLowerCase()) {
          listItems[i].classList.add("listItemComplete");

          //listener for cccongratulations and encouragement to print to PDF
          //actually maybe make a timout that when this thing is reached it prints the PDF automatically
          // we probably also need a way for users to see their words again so yes, might want to add a profilee addition to the nav where users can see their previous word associations as well as their story if it was completed as set by this listener

          //NEED TO ADD A TEST CASE IF USER WIPES ENTIRE BOX- RIGHT NOW EVERYTHING STAYS
          // or if user copys and pastes

          console.log(listItems.length);

          console.log(textArea.value.split(" ").length);

          if (listItems.length === textArea.value.split(" ").length + 1) {
            console.log("congratulations!! Youve won");
          }
        }
      }
    } else if (e.keyCode === 8) {
      let words = textArea.value.split(" ");
      lastWord = words[words.length - 1];

      for (let i = 0; i < allInputs.length; i++) {
        if (listItems[i].innerHTML.toLowerCase() === lastWord.toLowerCase()) {
          listItems[i].classList.remove("listItemComplete");
          listItems[i].classList.add("listItem");
        }
      }
    }
  });
}

document.getElementById("wordsPdf").addEventListener("click", function () {
  const doc = new jsPDF();
  doc.text(allInputs, 10, 10);
  doc.save("wordIntoIdeaWords.pdf");
  //deleteOnTimeout();
});

document.getElementById("essayPdf").addEventListener("click", function () {
  const doc = new jsPDF();
  doc.text(textArea.value, 10, 10);
  doc.save("wordIntoIdeaEssay.pdf");
  //deleteOnTimeout();
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

//listener for cccongratulations and encouragement to print to PDF
//actually maybe make a timout that when this thing is reached it prints the PDF automatically
// we probably also need a way for users to see their words again so yes, might want to add a profilee addition to the nav where users can see their previous word associations as well as their story if it was completed as set by this listener

//NEED TO ADD A TEST CASE IF USER WIPES ENTIRE BOX- RIGHT NOW EVERYTHING STAYS
// or if user copys and pastes
