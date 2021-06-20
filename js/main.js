
/* Authentication of User while loading the home page */

function initPage() {
  initCategory()
  authenticateUser()
}

var count = 0;
var orders = [];

function authenticateUser() {

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log("You are a logined user");
      document.getElementById("myProfile").onclick = function () {
        location.href = "profile.html";
      };
    }
    else {
      console.log("you have to sign in");
      document.getElementById("myProfile").onclick = function () {
        location.href = "login.html";
      };
    }
  });
}

/* fetch data from product table */

var idx = 0;

function fetchProductData() 
{

  idx = 0;
  const db = firebase.firestore();

  const category = getQueryParams('cat');
  changeHeading();
  db.collection("products").get().then((snapshot) => {
    snapshot.docs.forEach(doc => {
      //console.log(doc.data().category.path);
      if (doc.data().category.path == `categories/${category}`) {
        //console.log(doc);
        displayCard(doc);
      }
    })
  })
}

function getQueryParams(param) {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  return params[param] || "";
}


function displayCard(doc) 
{

  var result = doc.data();
  var price = result.price[Object.keys(result.price)[0]]
  idx += 1;
  const container = document.getElementById('accordion');

  const card = document.createElement('div');

  const content = `
    <div class="col col-sm-4 mb-20">
    <div class="card">
      <div id="collapse-${idx}" class="collapse show" data-parent="#accordion">
            <div class="card-body" id="currentItem">

                  <a href="productDetail.html?itemName=${result.name}&itemPrice=${price}&itemDescription=${result.details}&itemIngredients=${result.ingredients}&itemImage=${result.image}">
                  <div class="product-image"><img src="${result.image}"></div><br>
                  </a>

                  <h5 id="productName">${result.name}</h5>
                  <p id="productPrice">$${price}</p>
                  <div class="product-add button">
                  <button type="button" class="btn btn-primary btn-orange" id="addTocart-${idx}" onclick="addToCart(this.id)">ADD</button>
               </div>
            </div>
       </div>
     </div>
   </div>
  `;

  container.innerHTML += content;
}

function changeHeading() {
  document.getElementById("cat-name").innerText = getQueryParams('name');
}

function fetchProductDetail()
{

  var itemName = getQueryParams('itemName');
  var itemPrice = getQueryParams('itemPrice'); 
  var itemDescription = getQueryParams('itemDescription');
  var itemIngredients = getQueryParams('itemIngredients');
  var itemImage = getQueryParams('itemImage');

  var content = `<img src="${itemImage}" width="100%">`;

  document.getElementById("productName").innerHTML = itemName;
  document.getElementById("productPrice").innerHTML = itemPrice;
  document.getElementById("itemDescription").innerHTML = itemDescription;
  document.getElementById("itemIngredients").innerHTML = itemIngredients;

  document.getElementById('itemImage').innerHTML = content;

}


/* Add to cart functionaility */

function addToCart(clickedId) {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {

      const userId = firebase.auth().currentUser.uid;
      var productName = document.getElementById('productName').innerHTML;
      var productPrice = document.getElementById('productPrice').innerHTML;


      firebase.firestore().collection("cart").doc().set({
        userId: userId,
        productname: productName,
        productprice: productPrice

      }).then(() => {
        console.log("Document successfully written!");
        var x = document.getElementById("snackbar");
        x.className = "show";
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
      }).catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        // ..
        window.alert("Error: " + errorMessage);
      });
    }
    else {
      alert("You have to sign in to add products");
    }
  });
}



function fetchCartData() {
  const db = firebase.firestore();
  var userid;
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      userid = firebase.auth().currentUser.uid;
      console.log(userid);
    }
  });

  db.collection("cart").get().then((snapshot) => {
    snapshot.docs.forEach(doc => {

      if (doc.data().userId == userid) 
      {
        count++;
        displayCart(doc);
      }
      
    })
   
  })

}

/* Display data in cart table */
var totalPrice = 0;

function displayCart(doc) 
{

  var result = doc.data();
  console.log(result)
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
                    <button type="button" class="btn btn-primary btn-orange" id="removeItem" onclick="singleItemDelete()">Remove Item</button>
                  </div>
                </div>
             </div>
       </div>
     </div>
   </div>

  `;

  container.innerHTML += content;


  const totalNumbers = document.getElementById('ItemTotalNumber');
  totalNumbers.innerHTML = count;

  const checkOutProduct = document.getElementById('checkoutList');
  //const content = `<p><a href="#">${result.productname}</a> <span class="price">${result.productprice}</span></p>`;
  const checkOutcontent = `<p><a href="#">${result.productname}</a> <span class="price">${result.productprice}</span></p>`;
  checkOutProduct.innerHTML += checkOutcontent;

  const checkOutTotal = document.getElementById('totalPrice');
  totalPrice += parseFloat((result.productprice).match(/(\d+)/)[0]);
  checkOutTotal.innerHTML = totalPrice;
}

function increase() {
  var textBox = document.getElementById("text");
  textBox.value++;

}

function decrease() {
  var textBox = document.getElementById("text");
  textBox.value--;
}



/* Proceed to order and checkout */

function dataToOrder() {
  const db = firebase.firestore();
  var userid;

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      userid = firebase.auth().currentUser.uid;
      console.log(userid);
    }
  });

  db.collection("cart").get().then((snapshot) => {
    snapshot.docs.forEach(doc => {

      if (doc.data().userId == userid) {
        var obj = {
          productname: doc.data().productname,
          productprice: doc.data().productprice
        }
        orders.push(obj);
      }
    })
    addToOrder(orders, userid);
    console.log(orders);
  })
}

//dataToOrder().then(addToOrder(orders));

function addToOrder(orders, userid) {

  var docData = {
    userId: userid,
    status: "Ordered",
    products: orders
  }
  firebase.firestore().collection("order").doc().set(docData)
    .then(() => {
      console.log(orders);
      console.log("Document successfully written!");
      deleteCart(userid);
    }).catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      // ..
      window.alert("Error: " + errorMessage);
    });
}




function deleteCart(userid) {

  var deleData = firebase.firestore().collection('cart').where('userId', '==', userid);
  deleData.get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      doc.ref.delete();
    });
  });
  console.log(deleData);
}


function singleItemDelete() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {

      const userId = firebase.auth().currentUser.uid;
      var productName = document.getElementById('productName').innerHTML;

      firebase.firestore().collection("cart").get().then((snapshot) => {
        snapshot.docs.forEach(doc => {

          if ((doc.data().userId == userId) && (doc.data().productname == productName)) {
            var deleData = firebase.firestore().collection('cart').where('productname', '==', productName);
            deleData.get().then(function (querySnapshot) {
              querySnapshot.forEach(function (doc) {
                doc.ref.delete().then(() => {
                   location.reload();
                })
              });
            });
          }
        })
      });

    }

  })
}

var searchText;

function searchData()
{
  searchText = document.getElementById('searchText').value;
  window.location = 'searchData.html?searchtext='+searchText;
}

function searchItem()
{
  var searchText = getQueryParams('searchtext');
  document.getElementById('searchText').value = searchText;
  console.log(searchText);
  firebase.firestore().collection("products").where("name", "==", searchText)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {

            displayCard(doc);
            console.log(doc.data());
        });
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
  
}


function productDetail()
{

  window.location = 'productDetail.html';
  
}


// function pageRefresh()
// {
//   document.location.reload();
//   console.log("after refresh");
// }
/* Product detail page */

var categories = { categories: [] }

function initCategory() {
  const db = firebase.firestore();
  const storage = firebase.storage();
  const storageRef = storage.ref();
  categories.categories = [];
  db.collection("categories").get().then((snapshot) => {
    snapshot.forEach((doc) => {
      storage.ref(doc.data().image).getDownloadURL().then((url) => {
        categories.categories.push({ id: doc.id, imagePath: url, ...doc.data() });
        w3.displayObject("categoryContainer", categories);
      }).catch((error) => {
        categories.categories.push({ id: doc.id, ...doc.data() });
        w3.displayObject("categoryContainer", categories);
      });
    });
    w3.displayObject("categoryContainer", categories);
  });
  $(document).on("click", ".deleteCategoryButton", function () {
    $("#deleteModal .modal-footer a").val($(this).data("id"));
  })

  $(document).on("click", ".editCategoryButton", function () {
    $("#editModal #editCategoryName").val($(this).data("name"));
    $("#editModal .modal-footer a").val($(this).data("id"));
  })
}





