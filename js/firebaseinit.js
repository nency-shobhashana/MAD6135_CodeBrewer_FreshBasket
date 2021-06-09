// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "AIzaSyAgDjNtnKMfinuNAHddBe8OnSBeivNnUFw",
  authDomain: "fresh-basket-1ee04.firebaseapp.com",
  projectId: "fresh-basket-1ee04",
  storageBucket: "fresh-basket-1ee04.appspot.com",
  messagingSenderId: "39663268992",
  appId: "1:39663268992:web:423982874875d703be2265",
  measurementId: "G-0V9W5N7DX2"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();


const auth = firebase.auth();

function registerUser()
{
  console.log('Aparna');
    var fname = document.getElementById('validationCustom01').value;
    var lname = document.getElementById('validationCustom02').value;
    var email = document.getElementById('validationCustomUsername').value;
    var password = document.getElementById('exampleInputPassword1').value;
    firebase.auth().createUserWithEmailAndPassword(email,password).then(function()
    {
      alert('User Register successfully');
      console.log('User Registration Succesfully');
      var id=firebase.auth().currentUser.uid;
      firebase.database().ref('Users/'+id).set({
      firstName:fname,
      lastName:lname,
      emaill:email,
      // UserAge:age,

      });
   }).catch(function(error){

    var errorcode=error.code;
    var errormsg=error.message;

   });



}
    