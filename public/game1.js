
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

  //can change this to just fetch it straight from the room now
/*   function populateAlphabet(room){
    db.collection('rooms').get().then((querySnapshot) => {
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
  } */

  function populateAlphabet(){
    let userRef = db.collection('users').doc(auth.currentUser.uid)
  let roomCode = ''
  let alphabetList = document.querySelector('#alphabet-list')
  
  // Uncomment to initialize the doc.
  // sfDocRef.set({ population: 0 });
  
  return db.runTransaction((transaction) => {
      // This code may get re-run multiple times if there are conflicts.
      return transaction.get(userRef).then((doc) => {
        roomCode = doc.data().rooms_joined
  
  
  
      });
  }).then(() => {
    db.collection('rooms').doc(roomCode).get().then((doc) => {
      let html = ''
      doc.data().favorite_letters.forEach((letter) => {
        html += `<li>${letter}</li>`
      })
      alphabetList.innerHTML = html

    })
  }).catch((error) => {
      console.log("Transaction failed: ", error);
  });
  }


//MAYBE LETS SAVE THE DATA UNDER USER
function getUsers(room) {
   let inputList = document.querySelector("#user-list");
    let html;
    console.log("HAR");
    //display the usernames
    //but we want to set up a listener
  
    room.onSnapshot((snapshot) => {
      let html = "";
      snapshot.data().users.forEach((user) => {
        html += `<li> ${user} </li>`;
        console.log(user);
      });
      inputList.innerHTML = html;
    }); 

    console.log(room)
  }  

  let warningBox = document.querySelector('#warningBox')

  document.body.addEventListener('click', function(e){
      e.preventDefault()
      if(e.target.dataset.id === 'next-1'){
          let targetId = e.target.id
          let inputList = document.querySelectorAll('.input-cell')

          let cells = [];

        let docRef = db.collection('rooms').doc(targetId)
        updateUserInputList()

        console.log(`INPUT LIST`, inputList)

       

        const validInputs = Array.from(inputList).filter( input => input.value !== "");

        console.log(`INPUT LENGTH`, inputList.length)
        console.log(`VALID INPUT`,validInputs)

        if(validInputs.length < inputList.length){
          let list_one = {}
          console.log('need all cells')
            warningBox.innerHTML = 'Need All Cells'
            return false
        }else{
          //here is the problem
          //the return was getting included in the for each
          inputList.forEach((cell) => {
            cells.push(cell.value)
            console.log(cells)
            let randomInt = Math.floor(Math.random() * 200);
    
             list_one = {
                [randomInt]: cells
            }
          })
          
        return docRef.set({
          list_one
      }, {merge: true}).then(() => {
            window.location='game2.html'
            inputForm.reset()
      })
        }        
      }
  })

function updateUserInputList(){
    let userRef = db.collection('users').doc(auth.currentUser.uid)

    let inputList = document.querySelectorAll('.input-cell')
    inputList.forEach((cell) => {
      if(cell.value === ''){
        console.log('must enter all cells')
        return false
      }else{



        userRef.update({
            list_one_input: firebase.firestore.FieldValue.arrayUnion(cell.value)
        }).then(() => {
            console.log("User successfully updated!");
        })
        .catch((error) => {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
      }
    })
  
}



document.getElementById('timer').innerHTML =
  01 + ":" +59;
startTimer();


function startTimer() {
  var presentTime = document.getElementById('timer').innerHTML;
  var timeArray = presentTime.split(/[:]+/);
  var m = timeArray[0];
  var s = checkSecond((timeArray[1] - 1));
  if(s==59){m=m-1}
  if(m==0 && s==0){checkToSeeIfAllHasBeenEntered()}
  if(m<0){
    return
  }
  
  document.getElementById('timer').innerHTML =
    m + ":" + s;
  setTimeout(startTimer, 1000);
  
}

function checkSecond(sec) {
  if (sec < 10 && sec >= 0) {sec = "0" + sec}; // add zero in front of numbers < 10
  if (sec < 0) {sec = "59"};
  return sec;
}

function checkToSeeIfAllHasBeenEntered(){



  let inputList = document.querySelectorAll('.input-cell')
let emptywords = [];
  inputList.forEach((word) => {
    let randomInt = Math.floor(Math.random() * 90);

    console.log(`word count`, inputList.length)
    if(word.value === ''){
      
      word.value = words[randomInt]
      emptywords.push(word.value)}
 


      let userRef = db.collection('users').doc(auth.currentUser.uid)



      userRef.update({
        list_one_input: firebase.firestore.FieldValue.arrayUnion(word.value)
      }).then(() => {
        window.location='game2.html'

      })




   
  })




}

let words = ["trouble", "straight", "improve", "red", "tide", "dish", "dried", "police", "prize", "addition", "tonight", "quick", "child", "apartment", "sister", "could", "feet", "passage", "tobacco", "thou", "leg", "lady", "excellent", "fifth", "lake", "plural", "influence", "hurry", "river", "treated", "slightly", "else", "create", "live", "cool", "ought", "observe", "pass", "attack", "angle", "battle", "touch", "goes", "steady", "discussion", "cloth", "corner", "ordinary", "dozen", "soldier", "pride", "shells", "remarkable", "prevent", "nearly", "movie", "usual", "circle", "cover", "bottle", "machinery", "planet", "product", "nose", "as", "stopped", "hang", "time", "fight", "garden", "bar", "rapidly", "none", "question", "paint", "seven", "language", "dropped", "excellent", "porch", "club", "slip", "powder", "steam", "which", "before", "island", "deeply", "board", "notice", "his", "railroad", "slabs", "particular", "bee", "rule", "sheet", "determine", "afraid", "planned"]