
function autenticateUser()
{
  firebase.auth().onAuthStateChanged(function(user) {
  if (user) 
  {
    const db = firebase.firestore();
    var fname = document.getElementById('validationCustom01');
    var lname = document.getElementById('validationCustom02');
    var email = document.getElementById('exampleInputEmail1');
    var contact = document.getElementById('validationCustom03');
    var address = document.getElementById('validationCustom04');

    db.collection("user").doc(firebase.auth().currentUser.uid).get() 
    .then(function(doc){
  
      if(doc.exists)
      {
          console.log(doc.data().firstname);
          console.log(doc.data().email);
          fname.value = doc.data().firstname;
          lname.value = doc.data().lastname;
          email.value = doc.data().email; 
          contact.value = doc.data().contact;
          address.value = doc.data().address;  
          
          if(contact.value == "undefined")
          {
              contact.value = "";   
          }
          if(address.value == "undefined")
          {
            address.value = "";
          }
          
      }
      else
      {
          console.log("Doc doesn't exist");
      }
    }).catch(function(error){
      console.log("error", error);
    })

  } 
})
}

function openForm() 
{
  var btn = document.getElementById("myForm");
  btn.style.display = "block";
}


function logout()
{
  firebase.auth().signOut().then(() => {
    window.location = 'login.html';
}).catch((error) => {
  console.error("Error in updating data", error);
});
}



function updateUser()
{
  const db = firebase.firestore();
  var fnamev = document.getElementById('validationCustom01').value;
  var lnamev = document.getElementById('validationCustom02').value;
  var emailv = document.getElementById('exampleInputEmail1').value;
  var contactv = document.getElementById('validationCustom03').value;
  var addressv = document.getElementById('validationCustom04').value;

  db.collection("user").doc(firebase.auth().currentUser.uid).update(
  {
    firstname: fnamev,
    lastname: lnamev,
    email: emailv,
    contact: contactv,
    address: addressv

  }).then(function(){
    var btn = document.getElementById("myForm");
    btn.style.display = "none";
    console.log("Data updated sucessfully");
  }).catch((error) => {
    console.error("Error in updating data", error);
  });

}