function registerUser()
{
    console.log("Register page")
    var fname = document.getElementById('validationCustom01').value;
    var lname = document.getElementById('validationCustom02').value;
    var email = document.getElementById('validationCustomUsername').value;
    var password = document.getElementById('exampleInputPassword1').value;

    console.log('Welcome to register page');
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      var dbRef =  firebase.firestore().collection('user').doc(firebase.auth().currentUser.uid);
      dbRef.add({
        firstname: fname,
        lastname: lname
        })
        window.location = 'login.html';
    } ).catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        // ..
      });
}