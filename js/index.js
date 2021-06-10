firebase.auth().onAuthStateChanged(function(user) {
    if (user) 
    {
         
         console.log("You are a logined user");
        
    } 
    else 
    {
          // No user is signed in.
          window.location = 'login.html';
          console.log("you have to sign in");
    }
    });
    