
function login()
{
    console.log('Working');

    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
    console.log("Signed In");

    firebase.firestore().collection("user").doc(firebase.auth().currentUser.uid).get() 
    .then(function(doc){
      if(doc.exists)
      {

        var type = doc.data().type;
        console.log(type)
        if(type == "admin")
        {
            window.location = 'admin/index.html';
        }
        else
        {
            window.location = 'index.html';
        } 
      }
     
    })
    // ...
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;

    window.alert("Error: " + errorMessage);
  });
}




