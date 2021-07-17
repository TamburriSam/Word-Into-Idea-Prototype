
//const { default: firebase } = require("firebase");
const userName = document.querySelector('#userNameContainer')
const db = firebase.firestore();

const auth = firebase.auth();


auth.onAuthStateChanged((user) => {

    if(user){
        startGame()
        userName.innerHTML = `Hello ` + user.displayName
    }
})

//can use transaction here since we aren't changing anything
//i actually think we can use transactions if we just take it slow

function startGame(){
    //getUsers()
    room = db.collection('users').doc(auth.currentUser.uid)
    let docRef = ''
    let id=''
    return db.runTransaction((transaction) => {
      return transaction.get(room).then((doc) => {

        console.log(doc.data())

        docRef = doc.data().rooms_joined
        id = doc.id
      }).then(() => {
     
        db.collection('rooms').doc(docRef).get().then((doc) => {
          populateAlphabet(docRef)
            let usersRef = db.collection('rooms').doc(docRef)
            getUsers(usersRef)
            
            let listofInp = document.querySelector("#input-list");
            let html = "";
        
            for (let i = 0; i < doc.data().total_count; i++) {
              html += `<li><input type="text" placeholder="enter word" class="input-cell" </input> </li>`;
            }

            html += `<button data-id="next-1"class="next-1"id='${doc.id}'>Next</button>`;
            listofInp.innerHTML = html;
        })
      })
    }) 
  }

  let testBtn = document.querySelector('#test')
  testBtn.addEventListener('click', function(){
    populateAlphabet()
  })
  function populateAlphabet(room){
    db.collection('users').get().then((querySnapshot) => {
      let alphabetArray = []
      let alphabetList = document.querySelector('#alphabet-list')
      querySnapshot.forEach((doc) => {

        if(doc.data().rooms_joined === room){
          alphabetArray.push(doc.data().favorite_letter)
        }

      })
      console.log(alphabetArray)

      let html = ''
      alphabetArray.forEach((letter) => {
        html += `<li>${letter}</li>`
      })
      alphabetList.innerHTML = html
    })
  }

  console.log(88)

//MAYBE LETS SAVE THE DATA UNDER USER
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

  document.body.addEventListener('click', function(e){
      e.preventDefault()
      if(e.target.dataset.id === 'next-1'){
          let targetId = e.target.id
          let inputList = document.querySelectorAll('.input-cell')

          let cells = [];

        let docRef = db.collection('rooms').doc(targetId)
        updateUserInputList()
        inputList.forEach((cell) => {

            cells.push(cell.value)
        })
        console.log(cells)
        let randomInt = Math.floor(Math.random() * 200);

        let list_one = {
            [randomInt]: cells
        }

        return docRef.set({
            list_one
        }, {merge: true}).then(() => {
              window.location='game2.html'
              inputForm.reset()
        })
      }
  })

function updateUserInputList(){
    let userRef = db.collection('users').doc(auth.currentUser.uid)

    let inputList = document.querySelectorAll('.input-cell')
    inputList.forEach((cell) => {
        userRef.update({
            list_one_input: firebase.firestore.FieldValue.arrayUnion(cell.value)
        }).then(() => {
            console.log("User successfully updated!");
        })
        .catch((error) => {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
    })
}