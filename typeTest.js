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

/* function consoleThis() {
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
} */

function consoleThis() {
  let usedWords = [];
  let indice = "";
  let indices = [];
  let split = e.target.value.split(" ");

  textArea.addEventListener("keyup", function (e) {
    if (e.keyCode == 32) {
      for (let i = 0; i < arr1.length; i++) {
        if (arr1.includes(split[i])) {
          indice = i;
        }
      }
      console.log(indice);
    }
  });
}

//make new array with omitted words and stuff t

//filter
//


function populate(){
// Create a reference to the SF doc.
var userRef = db.collection("users").doc(auth.currentUser.uid);
let roomCode = "";
let roomCount = "";
// Uncomment to initialize the doc.
// sfDocRef.set({ population: 0 });

return db.runTransaction((transaction) => {
    return transaction.get(userRef).then((doc) => {
      roomCode = doc.data().rooms_joined;

}).then(() => {
    console.log("Transaction successfully committed!");
}).catch((error) => {
    console.log("Transaction failed: ", error);
});

})
}