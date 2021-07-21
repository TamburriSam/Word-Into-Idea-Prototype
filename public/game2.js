
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
      console.log(auth.currentUser.email)
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

  function noDuplicates(list, secondList){
    let inputList = document.querySelector('#word-list')
  let arr = ['sdfsdf','asdfa']
    let indices = [];
  
  
  
    let room = db.collection('users').doc(auth.currentUser.uid)
  
    room.get().then((doc) => {
      console.log(`general list length`, list.length)
      console.log(`my list length`, doc.data().list_one_input.length)

      for(let i = 0; i < doc.data().list_one_input.length; i++){
        indices.push(i)
      }
  console.log(`INDICES`, indices)
  
      console.log(`your list two input from rooms db`,doc.data().list_one_input)
  
      console.log(`random list_two from db`,list)

      list_one_received = list

      if(doc.data().list_one_received){
        if(doc.data().list_one_received.length > 0){
          console.log('ok')
          //set with merge overwrites the field we want
          //without merge it would override the whole document
          room.set({
            list_one_received
        }, {merge: true})

        let html = ''
        list.forEach((word) => {
          html += `<li>${word}</li>`
        })
        inputList.innerHTML = html  
        console.log('good')

        if(arraysEqual(list, doc.data().list_one_input) == true){
          console.log('trueeeeee')

          noDuplicates(secondList)
          secondList.forEach((word) => {
            room.update({
                list_one_received: firebase.firestore.FieldValue.arrayUnion(word)
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
                list_one_received: firebase.firestore.FieldValue.arrayUnion(word)
            }).then(() => {
                console.log('list one received added')
            }).catch((err) => {
                console.log(err)
            }) 
            console.log('fetched from list_two')
        }) 
        }
      }else{
      //DELETE WHATS IN THE RECEIVED LIST FIRST
      //THEN ADD

  
  
      let html = ''
                list.forEach((word) => {
                  html += `<li>${word}</li>`
                })
                inputList.innerHTML = html  
                console.log('good')
  
                if(arraysEqual(list, doc.data().list_one_input) == true){
                  console.log('trueeeeee')

                  noDuplicates(secondList)
                  secondList.forEach((word) => {
                    room.update({
                        list_one_received: firebase.firestore.FieldValue.arrayUnion(word)
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
                        list_one_received: firebase.firestore.FieldValue.arrayUnion(word)
                    }).then(() => {
                        console.log('list one received added')
                    }).catch((err) => {
                        console.log(err)
                    }) 
                    console.log('fetched from list_two')
                }) 
                }
  
                console.log(arraysEqual(list, doc.data().list_one_input))
              }
            }
    })
  }

  function getRoomCountForInput(room){
    db.collection('rooms').doc(room).get().then((doc) => {
        console.log(doc.data())
        let listofInp = document.querySelector("#input-list");
        let html = "";
    
        for (let i = 0; i < doc.data().total_count; i++) {
          html += `<li><input type="text" placeholder="enter word" class="word-cell" </input> </li>`;
        }

        html += `<button data-id="next-2"class="next-2"id='${doc.id}'>Next</button>`;
        listofInp.innerHTML = html;
    })
  }

  function getUsers(room) {
    let inputList = document.querySelector("#user-list");
     //display the usernames
     //but we want to set up a listener
   
     room.onSnapshot((snapshot) => {
       let html = "";
       snapshot.data().users.forEach((user) => {
         html += `<li> ${user} </li>`;
       });
       inputList.innerHTML = html;
     }); 
 
     console.log(room)
   }  





let test2= document.querySelector('#test-2')

test2.addEventListener('click', function(){
})



document.body.addEventListener('click', function(e){
    e.preventDefault()
    if(e.target.dataset.id === 'next-2'){
        let targetId = e.target.id
        let inputList = document.querySelectorAll('.word-cell')

        console.log('here')

        let cells = [];

      let docRef = db.collection('rooms').doc(targetId)
      updateUserInputList()


   
      const validInputs = Array.from(inputList).filter( input => input.value !== "");

      console.log(`INPUT LENGTH`, inputList.length)
      console.log(`VALID INPUT`,validInputs)

      if(validInputs.length < inputList.length){
        console.log('need all cells')
          warningBox.innerHTML = 'Need All Cells'
          return false
      }else{
        inputList.forEach((cell) => {
          cells.push(cell.value)
          console.log(cells)
          let randomInt = Math.floor(Math.random() * 200);
  
           list_two = {
              [randomInt]: cells
          }
        })
        
      return docRef.set({
        list_two
    }, {merge: true}).then(() => {
          window.location='game3.html'
          inputForm.reset()
    })
      }      
    }
})


function updateUserInputList(){
  let userRef = db.collection('users').doc(auth.currentUser.uid)

  let inputList = document.querySelectorAll('.word-cell')
  let completedWords = []

  inputList.forEach((cell) => {
    if(cell.value === ''){
      console.log('must enter all cells')
      return false
    }else{
      completedWords.push(cell.value)
    }
  })
    
    if(completedWords.length === inputList.length){

completedWords.forEach((word) => {
  userRef.update({
    list_two_input: firebase.firestore.FieldValue.arrayUnion(word)
  }).then(() => {
    console.log('User updated')
  }).catch((error) => {
    console.log(`Error ${error}`)
  })
})


      userRef.update({
          list_two_input: completedWords
      }).then(() => {
          console.log("User successfully updated!");
      })
      .catch((error) => {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
      });
    }
  

}



function startGame(room){
  room = db.collection('users').doc(auth.currentUser.uid)
  let docRef = ''
  let id=''
  let wantedList=''
  let secondList = ''
  let myCode = ''
  var usersReference = db.collection("users");
  let user_name = '';
  let myIndex = ''
  let recipients = ''

  return db.runTransaction((transaction) => {
    return transaction.get(room).then((doc) => {
      myCode = doc.data().rooms_joined
      user_name = doc.data().user_name
      myIndex = doc.data().index
      recipients = doc.data().recipients
      docRef = doc.data().rooms_joined
      id = doc.id
    })
    }).then(() => {
        //get words first
        //get words from this class' list_one only
        db.collection('rooms').doc(docRef).get().then((doc) => {



          let usersRef = db.collection('rooms').doc(docRef)
          getUsers(usersRef)
            let data = doc.data().list_one
              let inputList = document.querySelector('#input-list')
            const propertyValues = Object.values(data);
            let randomInt = getRandomInt(0, propertyValues.length-1)


            console.log(`property values`, propertyValues[randomInt])


            //HAS TO BE CHANGED

            console.log(`PROP VAL 0`, propertyValues[0])

          wantedList = propertyValues[randomInt]
          secondList = propertyValues[0]
         

            console.log(`wanted list`,wantedList)


       
    
        }).then(() => {
          noDuplicates(wantedList, secondList)
          getRoomCountForInput(docRef)
          console.log('HERE')
      }).then(() => {
        })
      })
    }

    window.onbeforeunload = function() {
      return "Data will be lost if you leave the page, are you sure?";
    };



    document.getElementById('timer').innerHTML =
    01 + ":" + 59;
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
  
  
  
    let inputList = document.querySelectorAll('.word-cell')
  let emptywords = [];
    inputList.forEach((word) => {
      let randomInt = Math.floor(Math.random() * 90);
  
      console.log(`word count`, inputList.length)
      if(word.value === ''){
        
        word.value = words[randomInt]
        emptywords.push(word.value)}
   
  
  
        let userRef = db.collection('users').doc(auth.currentUser.uid)
  
  
  
        userRef.update({
          list_two_input: firebase.firestore.FieldValue.arrayUnion(word.value)
        }).then(() => {
          //window.location='game3.html'
  
        })
  
  
  
  
     
    })
  
  
  
  
  }
  
  let words = ["trouble", "straight", "improve", "red", "tide", "dish", "dried", "police", "prize", "addition", "tonight", "quick", "child", "apartment", "sister", "could", "feet", "passage", "tobacco", "thou", "leg", "lady", "excellent", "fifth", "lake", "plural", "influence", "hurry", "river", "treated", "slightly", "else", "create", "live", "cool", "ought", "observe", "pass", "attack", "angle", "battle", "touch", "goes", "steady", "discussion", "cloth", "corner", "ordinary", "dozen", "soldier", "pride", "shells", "remarkable", "prevent", "nearly", "movie", "usual", "circle", "cover", "bottle", "machinery", "planet", "product", "nose", "as", "stopped", "hang", "time", "fight", "garden", "bar", "rapidly", "none", "question", "paint", "seven", "language", "dropped", "excellent", "porch", "club", "slip", "powder", "steam", "which", "before", "island", "deeply", "board", "notice", "his", "railroad", "slabs", "particular", "bee", "rule", "sheet", "determine", "afraid", "planned"]
