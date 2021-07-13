const db = firebase.firestore();
const userName = document.querySelector('#userNameContainer')

const auth = firebase.auth();

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


auth.onAuthStateChanged((user) => {

    if(user){
      userName.innerHTML = `Hello ` + user.displayName
      startGame()
    }
})

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;


  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function startGame(room){
    //getUsers()
     room = db.collection('users').doc(auth.currentUser.uid)
    let docRef, wantedList, id, secondaryList;
    return db.runTransaction((transaction) => {
      return transaction.get(room).then((doc) => {

        console.log(doc.data())

        docRef = doc.data().rooms_joined
        id = doc.id
      }).then(() => {
          //get words first
          db.collection('rooms').doc(docRef).get().then((doc) => {
            let usersRef = db.collection('rooms').doc(docRef)
            getUsers(usersRef)
              let data = doc.data().list_two

         //get user reference of list_two
         //compare the wanted list and list two
         //if its the same do something else
              

                let inputList = document.querySelector('#word-list2')
              const propertyValues = Object.values(data);
              let randomInt = getRandomInt(0, propertyValues.length-1)
              let otherRandomInt = getRandomInt(0, propertyValues.length-1)


              console.log(`property values`, propertyValues[randomInt])


              console.log(`random int`,randomInt)


               wantedList = propertyValues[randomInt]



          }).then((doc) => {

           noDuplicates(wantedList, secondaryList);

            getReceivedListOne()
            getRoomCountForInput(docRef)
        })

      })
    }) 
  }

  function getUsers(room) {
    let inputList = document.querySelector("#user-list");
     let html;
     console.log("HAR");
     //display the usernames
     //but we want to set up a listener
   
     room.onSnapshot((snapshot) => {
       //IF THERE IS NOW A LISTENER HERE FOR USERS
       //CAN WE SET UP A LISTETNER FOR THE COUNT AS WELL
       //ANOTHER PARAMETER FOR THE DOCREF WITH A TWEAK FOR USERS FIELD INSTEAD
       let html = "";
       snapshot.data().users.forEach((user) => {
         html += `<li> ${user} </li>`;
         console.log(user);
       });
       inputList.innerHTML = html;
     }); 
 
     console.log(room)
   }  

  function getRoomCountForInput(room){
    db.collection('rooms').doc(room).get().then((doc) => {
        console.log(doc.data())
        let listofInp = document.querySelector("#input-list");
        let html = "";
    
        for (let i = 0; i < doc.data().total_count; i++) {
          html += `<li><input type="text" placeholder="enter word" class="word-cell" </input> </li>`;
        }

        html += `<button data-id="next-3"class="next-3"id='${doc.id}'>Next</button>`;
        listofInp.innerHTML = html;
    })
  }

  function getReceivedListOne(){
      let wordList2 = document.querySelector('#word-list')
    let userRef = db.collection('users').doc(auth.currentUser.uid)
    userRef.get().then((doc) => {
let list_one_received = doc.data().list_one_received
let html = ''
list_one_received.forEach((word) => {
html += `<li>${word}</li>`
})
wordList2.innerHTML = html
    })
  }

  //event listener for next that stores input list three
  document.body.addEventListener('click', function(e){
    e.preventDefault()
    if(e.target.dataset.id === 'next-3'){
        let targetId = e.target.id
        let inputList = document.querySelectorAll('.word-cell')

        console.log('here')

        let cells = [];

      let docRef = db.collection('rooms').doc(targetId)
      updateUserInputList()
      inputList.forEach((cell) => {
          console.log(cell.value)

          cells.push(cell.value)
      })
      console.log(cells)
      let randomInt = Math.floor(Math.random() * 200);

      let list_three = {
          [randomInt]: cells
      }

      return docRef.set({
          list_three
      }, {merge: true}).then(() => {
            window.location='game4.html'
            inputForm.reset()
      })
    }
})

function updateUserInputList(){
    let userRef = db.collection('users').doc(auth.currentUser.uid)

    let inputList = document.querySelectorAll('.word-cell')
    inputList.forEach((cell) => {
        userRef.update({
            list_three_input: firebase.firestore.FieldValue.arrayUnion(cell.value)
        }).then(() => {
            console.log("User successfully updated!");
        })
        .catch((error) => {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
    })
}

function noDuplicates(list){
  let inputList = document.querySelector('#word-list2')

  let wantedArray = ['me', 'so', 'pale']

  let room = db.collection('users').doc(auth.currentUser.uid)

  room.get().then((doc) => {
    console.log(`general list length`, list.length)
    console.log(`my list length`, doc.data().list_two_input.length)


    console.log(`your list two input from rooms db`,doc.data().list_two_input)

    console.log(`random list_two from db`,list)

    //console.log(`secondList`, secondList)

    let html = ''
              list.forEach((word) => {
                html += `<li>${word}</li>`
              })
              inputList.innerHTML = html  
              console.log('good')

              if(arraysEqual(list, doc.data().list_two_input) == true){
                console.log('trueeeeee')

                //has to be stored
                //look at like 86
                //maybe nows a time to use the algorithm function
                //have the main thing function on randos but if its the same one
                //then get the number from the db and store it in
                //usersReference.get().then((querySnapshot) => {
    //querySnapshot is "iteratable" itself
   /*  console.log(querySnapshot.docs[0].data())
    console.log(querySnapshot.docs[1].data())
    console.log(querySnapshot.docs[2].data())
    console.log(querySnapshot.docs[3].data()) */
//})

//something better that it collects is needed
                noDuplicates(wantedArray)
                wantedArray.forEach((word) => {
                  room.update({
                      list_two_received: firebase.firestore.FieldValue.arrayUnion(word)
                  }).then(() => {
                      console.log('list two received added')
                  }).catch((err) => {
                      console.log(err)
                  }) 
                  console.log('fetched from list_two')
              }) 
              }else{
                list.forEach((word) => {
                  room.update({
                      list_two_received: firebase.firestore.FieldValue.arrayUnion(word)
                  }).then(() => {
                      console.log('list two received added')
                  }).catch((err) => {
                      console.log(err)
                  }) 
                  console.log('fetched from list_two')
              }) 
              }

              console.log(arraysEqual(list, doc.data().list_two_input))
  })
}



console.log(arraysEqual(['l','k','p'], ['l','k','p']))