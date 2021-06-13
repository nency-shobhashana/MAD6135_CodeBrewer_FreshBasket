
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

/* fetch data from product table */

function fetchProductData()
{
      const db = firebase.firestore();
      
      const category = getQueryParams('cat');
      changeHeading();
      db.collection("products").get().then((snapshot) => {
            snapshot.docs.forEach(doc => {
                //console.log(doc.data().category.path);
                if(doc.data().category.path == `categories/${category}`)
                {
                  //console.log(doc);
                  displayCard(doc);
                 
                }
            })
      })   
}

function getQueryParams(param)
{
      const urlSearchParams = new URLSearchParams(window.location.search);
      const params = Object.fromEntries(urlSearchParams.entries());
      return params[param] || "";
}

function displayCard(doc)
{

    var result = doc.data();
    var idx = 1;
    const container = document.getElementById('accordion');

    const card = document.createElement('div');
    
    const content = `
    <div class="col col-sm-4 mb-20">
    <div class="card">
      <div id="collapse-${idx}" class="collapse show" data-parent="#accordion">
            <div class="card-body">
                  <div class="product-image">
                        <img src="images/card_image 2.png">
                  </div><br>
                  <h5>${result.name}</h5>
                  <p>$${result.price[1]}</p>
                  <div class="product-add button">
		            <button type="button" class="btn btn-primary btn-orange" onclick="addToCart()">ADD</button>
	             </div>
             </div>
       </div>
     </div>
   </div>
  `;

  container.innerHTML += content;
}

function changeHeading()
{
      document.getElementById("cat-name").innerText = getQueryParams('cat');
}

function addToCart()
{
      //Add data to cart database.
      console.log("This button is working");
}





    