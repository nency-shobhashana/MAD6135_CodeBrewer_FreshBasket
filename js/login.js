

firebase.auth().onAuthStateChanged(function(user) {
if (user) 
{
      
     console.log("Welcome");
    
} 
else 
{
      // No user is signed in.
      console.log("you have to sign in");
}
});


function login()
{
    console.log('Working');

    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
    // Signed in
    // console.log(userCredential);
    // var user = userCredential.user;
    console.log("Signed In");
    window.location = 'index.html';
    // ...
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;

    window.alert("Error: " + errorMessage);
  });
}