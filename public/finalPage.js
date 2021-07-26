const db = firebase.firestore();
const userName = document.querySelector("#userNameContainer");

const auth = firebase.auth();

auth.onAuthStateChanged((user) => {
  if (user) {
    userName.innerHTML = `Hello ` + user.displayName;
    loadColumns(auth.currentUser.uid);
  }
});

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

      populateListWithInputValue(firstCol, list1);
      populateListWithInputValue(secondCol, list2);
      populateListWithInputValue(thirdCol, list3);
      populateListWithInputValue(fourthCol, list4);
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

  doc.text("Hello world!", 10, 10);
  doc.save("a4.pdf");
});

document.getElementById("test-2").addEventListener("click", consoleThis);

let textArea = document.getElementById("w3review");
let testBox = document.getElementById("testbox");

let arr1 =
  `here is a story all about how my life got twist turned upside down and id like to take a minute just sit right there`.split(
    " "
  );
testBox.innerHTML = arr1.join(" ");

let originalBox = testBox.innerHTML;

let inner = testBox.innerHTML.split(" ");

/* function consoleThis() {
  let usedWords = [];

  textArea.addEventListener("keyup", function (e) {
    console.log(e.target.value);
    for (let i = 0; i < 2; i++) {
      if (e.target.value.includes(inner[i])) {
        //if space bar is pressed
        //check if textarea includes arr1 i



        if (inner[i].length > 0) {
          usedWords.push(inner[i]);
        }
      }
    }
    console.log(usedWords);
  });
} */

function consoleThis() {
  let usedWords = [];

  textArea.addEventListener("keyup", function (e) {
    for (let i = 0; i < arr1.length; i++) {
      if (e.target.value.split(" ").includes(inner[i])) {
        if (e.keyCode == 32 && !usedWords.includes(inner[i])) {
          usedWords.push(inner[i]);
          arr1.splice(i, 1);
          testBox.innerHTML = arr1.join(" ");
          showNew(inner[i]);
        }
      }
    }
    console.log(usedWords);
  });
}

console.log(arr1);

function showNew(word) {
  if (arr1.includes(word)) {
    testBox.innerHTML += word + " ";
  }
}

//make new array with omitted words and stuff t

//filter
//
