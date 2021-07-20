
const userName = document.querySelector('#user')
const roomList = document.querySelector(".rooms");
const db = firebase.firestore();

const auth = firebase.auth();

const createForm = document.querySelector(".create-room");

let roomName = document.querySelector('#room-name')
let roomCount = document.querySelector('#room-count')
/* let test = document.querySelector('#btn')

test.addEventListener('click', function(){
  populateListOneOnCreation(11)
}) */

function populateListOneOnCreation(){



    // Create a reference to the SF doc.
    var userRef = db.collection("users").doc(auth.currentUser.uid);
    let roomCode = ''
    let roomCount = ''
    let roomRef = ''
    let randomInt = Math.floor(Math.random() * 200);
    
    // Uncomment to initialize the doc.
    // sfDocRef.set({ population: 0 });
    
    return db.runTransaction((transaction) => {
        // This code may get re-run multiple times if there are conflicts.
        return transaction.get(userRef).then((doc) => {
          roomCode = doc.data().rooms_joined
    
    }).then(() => {
    
     roomRef = db.collection('rooms').doc(roomCode).get().then((doc) => {
      roomCount = doc.data().total_count
    })
    

  })
    .then(() => {

     
    let roomRef = db.collection('rooms').doc(roomCode)
    
    let wordsWeWant = [];
    
    for(let i = 0; i < roomCount; i++){
      let randomInt = Math.floor(Math.random() * 90);

      wordsWeWant.push(randomWords[randomInt])
    }
    
    console.log(wordsWeWant)
    
      console.log(`ROOM COUNT`, roomCount)
    list_one = {
      0: wordsWeWant
    }
    
    return roomRef.update({
      list_one
    }) 

  })
})
   
    }




function algorithm(num, position){

  let numArray = [];

  for(let i = 1; i < num; i++){
      numArray.push(i)
  }

  let huhArray = [];

  for(let i = 0; i < numArray.length; i++){
      huhArray.push([numArray[i+1], numArray[i+2], numArray[i+3], numArray[i+4]])   
  }

numArray[numArray.length-5]
console.log(huhArray)

huhArray[huhArray.length-5][3] = 1
huhArray[huhArray.length-4][2] = 1

huhArray[huhArray.length-4][3] = 2
huhArray[huhArray.length-3][1] = 1
huhArray[huhArray.length-3][2] = 2
huhArray[huhArray.length-3][3] = 3

huhArray[huhArray.length-2][0] = 1
huhArray[huhArray.length-2][1] = 2
huhArray[huhArray.length-2][2] = 3
huhArray[huhArray.length-2][3] = 4





  console.log(huhArray[huhArray.length - 4][3])

  console.log(`TARGET NUM`)


  let wantedArr = huhArray[position]
  var userRef = db.collection('users').doc(auth.currentUser.uid);

  return userRef.update({
    recipients: wantedArr
  }).then(() => {
    console.log('doc success')
  }).catch((err) => {
    console.error(err)
  })


}





/* createForm.addEventListener("click", () => {

  console.log('booyah')


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
      list_four: []
    })
    .then(() => {

      ///WE WANT TO ADD STOCK LIST HERE
      ///WE WANT TO ADD STOCK LIST HERE
      //close modal and reset form
      //8createForm.reset();
      //add stock words on creation 
    })
    .catch((err) => {
      console.error(err);
    });
});
 */

function findIndex(){
let roomCode = '';
let position = ''


let room = db.collection('users').doc(auth.currentUser.uid)
let user_name = '';
let roomCount = ''


console.log(`doc`,auth.currentUser.uid)

return db.runTransaction((transaction) => {
  return transaction.get(room).then((doc) => {
    roomCode = doc.data().rooms_joined
    user_name = doc.data().user_name
    roomCount = doc.data().total_count

  })
}).then(() => {
  console.log('done', roomCode)

  db.collection('rooms').doc(roomCode).get().then((doc) => {
    position =  doc.data().users.length
    roomCount = doc.data().total_count
    console.log(`POSITION`, position)
    algorithm(roomCount, position)
    populateListOneOnCreation()
    return addIndexToUserProfile(position)

  })



 
})
}

function addIndexToUserProfile(indice){


  var userRef = db.collection('users').doc(auth.currentUser.uid);



  return userRef.update({
      index: indice
  })
  .then(() => {
      console.log("Document successfully updated!");
  })
  .catch((error) => {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
  });
}

auth.onAuthStateChanged((user) => {


if(user){
    userName.innerHTML = 'Hello' + ' ' + user.displayName  
     db.collection("rooms").onSnapshot((snapshot) => {
        setUpRooms(snapshot.docs);

      });

      console.log(`IDIDID`,user.uid)
      console.log(firebase.auth().currentUser)

}
  });


  const setUpRooms = (data) => {
    //if there is data
    if (data.length) {
      let html = "";
      data.forEach((doc) => {
        const room = doc.data();
  
        console.log(doc.id);
        //console.log("Iterated snapshot", room);
        const li = `<li class="room-info"><div>${room.name}</div> ${room.active_count}/${room.total_count} Active <button data-id="btn" class="room-select" id="${doc.id}">Join</button></li>`;
  
        html += li;
  
        //add event listener that ties the room name with the name in database
      });
      roomList.innerHTML = html;
    } else {
      roomList.innerHTML = `<h5>Log in to view rooms</h5>`;
    }  
  }

  document.body.addEventListener('click', function(e){
      let id = e.target.id
      let uid = firebase.auth().currentUser.uid
      let email = firebase.auth().currentUser.email


      if(e.target.dataset.id === 'btn'){
          db.collection('users').doc(uid).set({
              uid: auth.currentUser.uid,
              flag: parseInt(0), 
              rooms_joined: id,
              user_name: email,
              list_one_input: [],
              list_two_input: [],
              list_three_input: [],
              list_four_input: [],
              list_one_received: [],
              list_two_received: [],
              list_three_received: [],
              list_four_received: [],
          }).then(() => {
              console.log('user added')
              console.log(id)
              watchForCount(id)
              document.querySelector('#waiting').style.display='block'
              findIndex()




             // window.location = 'game1.html'
          }).catch((err) => {
              console.log(err)
          })
      }
  })


  function watchForCount(room){
      let docref = db.collection('rooms').doc(room)
      return db.runTransaction((transaction) => {
          return transaction.get(docref).then((doc) => {
              console.log(doc.data())




            console.log(`DOC DATA`, doc.data().users)
            console.log(`MY USER DATA`, auth.currentUser.displayName)

            console.log(!doc.data().users.includes('Kule'))





              //right here we need to add something else that denies user another click if their username is found 
              if (doc.data().active_count < doc.data().total_count) {
                if(!doc.data().users.includes(auth.currentUser.displayName)){
                let newCount = doc.data().active_count + 1;
                transaction.update(docref, { active_count: newCount },
                    );
                    transaction.update(docref, {users: firebase.firestore.FieldValue.arrayUnion(firebase.auth().currentUser.displayName)})
                    makeItModal();
              }else{
                console.log('didnt go up')
              }
            }
          })
      }).then((doc) => {
          console.log('done')
          getUsers(docref)
          isRoomFull(room)
      })
  }
  
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
  }

  function startCountdown(seconds) {
    let counter = seconds;
      
    const interval = setInterval(() => {
      console.log(counter);
      counter--;

      document.querySelector('#waiting').innerHTML = `Game Starting in ${counter} seconds`

        
      if (counter < 1 ) {
        clearInterval(interval);
        console.log('Ding!');
        window.location = 'game1.html'
      }
    }, 1000);
  }
  
  function isRoomFull(room){
      console.log(`ROOM`, room)

    db.collection('rooms').doc(room).onSnapshot((snapshot) => {
        let data = snapshot.data();

        if(data.active_count === data.total_count && data.total_count === data.favorite_letters.length){
       
startCountdown(9)
           
           
        }
    })



  }

//DOESNT WORK BC TRANSACTION IS ROOM
  function addLetterToRoomDb(){
    let room = db.collection('users').doc(auth.currentUser.uid)
    return db.runTransaction((transaction) => {
      return transaction.get(room).then((doc) => {
        roomCode = doc.data().rooms_joined
        user_name = doc.data().user_name
    
      })
    }).then(() => {
      console.log('done', roomCode)
      let docRef = db.collection('rooms').doc(roomCode)



      // Set the "capital" field of the city 'DC'
      return docRef.update({
          favorite_letters: firebase.firestore.FieldValue.arrayUnion(modalInput.value)
      })
      .then(() => {
          console.log("Document successfully updated!");
      })
      .catch((error) => {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
      });
    
     
    })
  }

  let modalInput = document.querySelector('#alphabetInput')
  // Get the modal
var modal = document.getElementById("myModal");

let roomBtns = document.querySelectorAll('.room-select')

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
function makeItModal(){
  let modalInput = document.querySelector('#alphabetInput')
  let modalBtn = document.querySelector('#modalSubmit')
  let modalContent = document.querySelector('.modal-content')




  

    modal.style.display = "block";
    console.log('clicked')

    modalBtn.addEventListener('click', function(){




      db.collection('users').doc(auth.currentUser.uid).update({
        favorite_letter: modalInput.value
      }).then(() => {
    
        addLetterToRoomDb()




        console.log('fav letter successfully added')
        modalContent.innerHTML = 'Thank You. The Game will begin shortly'
  
        setTimeout(() => {
  modal.style.display='none'
        }, 2000);
      }).catch((err) => {
        console.log(`Error on line 317 ${err}`)
      })
    })



}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

/* window.onunload = function () {
  db.collection('users').doc(auth.currentUser.uid).delete().then(() => {
    console.log('User Deleted')
    firebase.auth().signOut().then(() => {
     console.log('User sign out successful')
    }).catch((error) => {
      // An error happened.
    });
  })

  
}



window.addEventListener('beforeunload', function (e) {
  // Cancel the event
  e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
  // Chrome requires returnValue to be set
  db.collection('users').doc(auth.currentUser.uid).delete().then(() => {
    console.log('User Deleted')
    firebase.auth().signOut().then(() => {
     console.log('User sign out successful')
    }).catch((error) => {
      // An error happened.
    });
  })
  e.returnValue = '';
}); */

// Create a reference to the SF doc.


function populateAlphabet(){
  let userRef = db.collection('users').doc(auth.currentUser.uid)
var roomRef = db.collection("rooms")
let roomCode = ''

// Uncomment to initialize the doc.
// sfDocRef.set({ population: 0 });

return db.runTransaction((transaction) => {
    // This code may get re-run multiple times if there are conflicts.
    return transaction.get(userRef).then((doc) => {
      roomCode = doc.data().rooms_joined



    });
}).then(() => {
  db.collection('rooms').doc(roomCode).get().then((doc) => {
    console.log(doc.data())
  })
}).catch((error) => {
    console.log("Transaction failed: ", error);
});
}




let randomWords = ["trouble", "straight", "improve", "red", "tide", "dish", "dried", "police", "prize", "addition", "tonight", "quick", "child", "apartment", "sister", "could", "feet", "passage", "tobacco", "thou", "leg", "lady", "excellent", "fifth", "lake", "plural", "influence", "hurry", "river", "treated", "slightly", "else", "create", "live", "cool", "ought", "observe", "pass", "attack", "angle", "battle", "touch", "goes", "steady", "discussion", "cloth", "corner", "ordinary", "dozen", "soldier", "pride", "shells", "remarkable", "prevent", "nearly", "movie", "usual", "circle", "cover", "bottle", "machinery", "planet", "product", "nose", "as", "stopped", "hang", "time", "fight", "garden", "bar", "rapidly", "none", "question", "paint", "seven", "language", "dropped", "excellent", "porch", "club", "slip", "powder", "steam", "which", "before", "island", "deeply", "board", "notice", "his", "railroad", "slabs", "particular", "bee", "rule", "sheet", "determine", "afraid", "planned"]
