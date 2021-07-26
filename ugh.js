function noDuplicates(list, secondList, thirdList) {
  let inputList = document.querySelector("#word-list3");
  let indices = [];

  let room = db.collection("users").doc(auth.currentUser.uid);

  room.get().then((doc) => {
    //console.log(`general list length`, list.length)
    console.log(`my list length`, doc.data().list_three_input.length);

    for (let i = 0; i < doc.data().list_three_input.length; i++) {
      indices.push(i);
    }
    console.log(`INDICES`, indices);

    console.log(
      `your list two input from rooms db`,
      doc.data().list_three_input
    );

    console.log(`random list_two from db`, list);

    list_three_received = list;

    if (
      doc.data().list_three_received &&
      doc.data().list_three_received.length > 0
    ) {
      console.log("ok");
      //set with merge overwrites the field we want
      //without merge it would override the whole document
      room.set(
        {
          list_three_received,
        },
        { merge: true }
      );

      let html = "";
      list.forEach((word) => {
        html += `<li>${word}</li>`;
      });
      inputList.innerHTML = html;
      console.log("good");

      if (arraysEqual(list, doc.data().list_three_input) == true) {
        console.log("trueeeeee");

        noDuplicates(secondList);
        secondList.forEach((word) => {
          room
            .update({
              list_three_received:
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
      } else {
        list.forEach((word) => {
          room
            .update({
              list_three_received:
                firebase.firestore.FieldValue.arrayUnion(word),
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
        html += `<li>${word}</li>`;
      });
      inputList.innerHTML = html;
      console.log("good");

      if (arraysEqual(list, doc.data().list_three_input) == true) {
        console.log("trueeeeee");

        noDuplicates(secondList);

        if (secondList.length === 0) {
          noDuplicates(thirdList);
        }
        secondList.forEach((word) => {
          room
            .update({
              list_three_received:
                firebase.firestore.FieldValue.arrayUnion(word),
            })
            .then(() => {
              console.log("list 3 received added");
            })
            .catch((err) => {
              console.log(err);
            });
          console.log("fetched from 3");
        });
      } else {
        list.forEach((word) => {
          room
            .update({
              list_three_received:
                firebase.firestore.FieldValue.arrayUnion(word),
            })
            .then(() => {
              console.log("list 3 received added");
            })
            .catch((err) => {
              console.log(err);
            });
          console.log("fetched from list_three");
        });
      }

      console.log(arraysEqual(list, doc.data().list_three_input));
    }
  });
}
