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
