
/* Authentication of User while loading the home page */

function authenticateUser()
{
      firebase.auth().onAuthStateChanged(function(user) {
      if (user) 
      {          
            console.log("You are a logined user");
            document.getElementById("myProfile").onclick = function () {
                  location.href = "profile.html";
              };
      } 
      else 
      {
            console.log("you have to sign in");
            document.getElementById("myProfile").onclick = function () {
                  location.href = "login.html";
              };
      }
});
}

/* Authentication of User while loading the home page */





    