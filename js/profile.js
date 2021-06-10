
function fetchData()
{

  var fname = document.getElementById('validationCustom01').value;
  var lname = document.getElementById('validationCustom02').value;
  var email = document.getElementById('exampleInputEmail1').value;
  var contact = document.getElementById('validationCustom03').value;
  var address = document.getElementById('validationCustom04').value;
  console.log(fname);
  var db =  firebase.firestore();
  //var dbRef =  firebase.firestore().collection('user');
  db.collection("user").doc("LA").set({
    firstname: fname,
    lastname: lname,
    email: email,
    conatct: contact,
    address: address
    }).then(() => {
      console.log("Document successfully written!");
  }).catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      // ..
      window.alert("Error: " + errorMessage);
    });
}



function logout()
{
  firebase.auth().signOut().then(() => {
    window.location = 'login.html';
  // Sign-out successful.
}).catch((error) => {
  // An error happened.
});
}