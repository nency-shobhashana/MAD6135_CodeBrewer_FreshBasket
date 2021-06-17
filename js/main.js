
/* Authentication of User while loading the home page */

function initPage(){
  initCategory()
  authenticateUser()
}

var count = 0;
var orders = [];

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
            <div class="card-body" id="currentItem">
                  <div class="product-image">
                        <img src="images/card_image 2.png">
                  </div><br>
                  <h5 id="productName">${result.name}</h5>
                  <p id="productPrice">$${result.price[2]}</p>
                  <div class="product-add button">
                <button type="button" class="btn btn-primary btn-orange" id="addTocart" onclick="addToCart()">ADD</button>
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
    
      

      firebase.auth().onAuthStateChanged(function(user) {
        if (user) 
        {     
          
          const userId = firebase.auth().currentUser.uid;
          var  productName = document.getElementById('productName').innerHTML;
          var productPrice=  document.getElementById('productPrice').innerHTML;
    
        
          firebase.firestore().collection("cart").doc().set({
            userId: userId,
            productname: productName,
            productprice: productPrice
    
            }).then(() => {
              console.log("Document successfully written!");
          }).catch((error) => {
              var errorCode = error.code;
              var errorMessage = error.message;
              // ..
              window.alert("Error: " + errorMessage);
            });
        } 
        else 
        {
            alert("You have to sign in to add products");
        }
      });

      
}

function fetchCartData()
{
   
    const db = firebase.firestore();
    var userid;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) 
      {          
        userid = firebase.auth().currentUser.uid;
        console.log(userid);
      } 
    });
    
    db.collection("cart").get().then((snapshot) => {
          snapshot.docs.forEach(doc => {
            
            if(doc.data().userId == userid)
            {
              count++;
              displayCart(doc);
              displayCheckout(doc);
            }
        })
     }) 
}



function displayCart(doc)
{
    var result = doc.data();
    var idx = 1;
    const container = document.getElementById('accordion');

    const card = document.createElement('div');
    
    const content = `
    <div class="col col-sm-12 mb-20">
    <div class="card">
      <div id="collapse-${idx}" class="collapse show" data-parent="#accordion">
            <div class="card-body row" >
                <div class="col-sm-4">
                  <div class="product-image">
                        <img src="images/card_image 2.png">
                  </div>
                </div>

                <div class="col-sm-1">
                </div>

                <div class="col-sm-7">
                  <h5 id="productName">${result.productname}</h5>
                  <p id="productPrice">${result.productprice}</p>

                  <button class= "qty-up-button" type="button" onclick="increase()">+</button>
                    <input class = "qty-input" type="text" id="text" value="1">
                  <button class= "qty-down-button type="button" onclick="decrease()">-</button><br><br>

                  <div class="remove-cart button">
                    <button type="button" class="btn btn-primary btn-orange" id="addTocart" onclick="addToCart()">Remove Item</button>
                  </div>
                </div>
             </div>
       </div>
     </div>
   </div>

  `;

  container.innerHTML += content;
}

var totalPrice = 0;

function displayCheckout(doc)
{
    var result = doc.data();
    var idx = 1;
    const checkOutProduct = document.getElementById('checkoutList');
    const checkOutTotal = document.getElementById('totalPrice');
    const totalNumbers = document.getElementById('ItemTotalNumber');
    const content = `<p><a href="#">${result.productname}</a> <span class="price">${result.productprice}</span></p>`;
    totalPrice += parseFloat((result.productprice).match(/(\d+)/)[0]);
    checkOutProduct.innerHTML += content;
    checkOutTotal.innerHTML = totalPrice;
    totalNumbers.innerHTML = count;
}

function increase()
{
    var textBox = document.getElementById("text");
    textBox.value++;

}

function decrease()
{
    var textBox = document.getElementById("text");
    textBox.value--;
}

function dataToOrder()
{
    const db = firebase.firestore();
    var userid;
    
    firebase.auth().onAuthStateChanged(function(user) {
    if (user) 
    {          
        userid = firebase.auth().currentUser.uid;
        console.log(userid);
    } 
    });
   
    db.collection("cart").get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
          
          if(doc.data().userId == userid)
          {
            var obj = {productname: doc.data().productname,
                      productprice: doc.data().productprice}
            orders.push(obj); 
          }
      })
     addToOrder(orders, userid);
     console.log(orders);
   }) 

  
}

//dataToOrder().then(addToOrder(orders));

function  addToOrder(orders, userid)
{
    
    var docData = {
      userId: userid,
      status: "Ordered",
      products: orders
    }
    firebase.firestore().collection("order").doc().set(docData)
    .then(() => {
      console.log(orders);
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





    