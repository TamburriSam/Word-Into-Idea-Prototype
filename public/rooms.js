//const { default: firebase } = require("firebase");



const userName = document.querySelector('#user')
const roomList = document.querySelector(".rooms");
const db = firebase.firestore();

const auth = firebase.auth();

const createForm = document.querySelector(".create-room");

let roomName = document.querySelector('#room-name')
let roomCount = document.querySelector('#room-count')


createForm.addEventListener("click", () => {

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
      //close modal and reset form
      //8createForm.reset();
    })
    .catch((err) => {
      console.error(err);
    });
});

auth.onAuthStateChanged((user) => {


if(user){
    userName.innerHTML = 'Hello' + ' ' + user.displayName  
     db.collection("rooms").onSnapshot((snapshot) => {
        setUpRooms(snapshot.docs);
      });

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
        const li = `<li><button data-id="btn" class="room-select" id="${doc.id}">${room.name}</button> ${room.active_count}/${room.total_count} Active</li>`;
  
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

              if (doc.data().active_count < doc.data().total_count) {
                let newCount = doc.data().active_count + 1;
                transaction.update(docref, { active_count: newCount },
                    );
                    transaction.update(docref, {users: firebase.firestore.FieldValue.arrayUnion(firebase.auth().currentUser.displayName)})

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
  }
  
  function isRoomFull(room){
      console.log(`ROOM`, room)

    db.collection('rooms').doc(room).onSnapshot((snapshot) => {
        let data = snapshot.data();

        if(data.active_count === data.total_count){

                document.querySelector('#waiting').innerHTML = 'Game Starting in 3 seconds'

                setTimeout(() => {
                    window.location = 'game1.html'
                }, 1000);
           
        }
    })



  }
