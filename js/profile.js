function logout()
{
  firebase.auth().signOut().then(() => {
    window.location = 'login.html';
  // Sign-out successful.
}).catch((error) => {
  // An error happened.
});
}