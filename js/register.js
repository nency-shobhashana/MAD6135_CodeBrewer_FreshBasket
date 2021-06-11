

function registerUser()
{

    console.log("Register page")
    var fname = document.getElementById('validationCustom01').value;
    var lname = document.getElementById('validationCustom02').value;
    var email = document.getElementById('validationCustomUsername').value;
    var password = document.getElementById('exampleInputPassword1').value;
    var db =  firebase.firestore();


    console.log('Welcome to register page');
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      
        db.collection("user").doc(firebase.auth().currentUser.uid).set({
        firstname: fname,
        lastname: lname,
        email: email,
        type: "user"
        }).then(() => {
          alert("You have succesfully done the Registration");
          console.log("Document successfully written!");
      }).catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          // ..
          window.alert("Error: " + errorMessage);
        });
    }).catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      // ..
      window.alert("Error: " + errorMessage);
    });

}

