
/* Authentication of User while loading the home page */

function initPage(){
  initCategory()
  authenticateUser()
}
var count = 0;
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
      document.getElementById("cat-name").innerText = getQueryParams('name');
}

function addToCart()
{
      // //Add data to cart database.
      count++;
      const cartId = firebase.auth().currentUser.uid;
      // console.log(cartId);
      // console.log("This button is working");
      // firebase.firestore().collection("user").doc(firebase.auth().currentUser.uid).set({
      // cartItems: firebase.firestore().collection("cart").doc(cartId)
      //   }, { merge: true });
      firebase.firestore().collection("cart").doc(firebase.auth().currentUser.uid).set({
        [count]: cartId,
        productCount: count
        }, { merge: true }).then(() => {
          console.log("Document successfully written!");
      }).catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          // ..
          window.alert("Error: " + errorMessage);
        });
}

var categories = {categories:[]}

function initCategory(){
  const db = firebase.firestore();
  const storage = firebase.storage();
  const storageRef = storage.ref();
  categories.categories = [];
  db.collection("categories").get().then((snapshot) =>{
    snapshot.forEach((doc) =>{
      storage.ref(doc.data().image).getDownloadURL().then((url) => {
        categories.categories.push({id: doc.id, imagePath: url, ...doc.data()});
        w3.displayObject("categoryContainer", categories);
      }).catch((error) => {
        categories.categories.push({id: doc.id, ...doc.data()});
        w3.displayObject("categoryContainer", categories);
      });
    });
    w3.displayObject("categoryContainer", categories);
  });
  $(document).on("click",".deleteCategoryButton", function(){
    $("#deleteModal .modal-footer a").val($(this).data("id"));
  })

  $(document).on("click",".editCategoryButton", function(){
    $("#editModal #editCategoryName").val($(this).data("name"));    
    $("#editModal .modal-footer a").val($(this).data("id"));    
  })
}





    