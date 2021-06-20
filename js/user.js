// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

var users = {users:[]}
var orders = {orders:[]}

function authenticateUser()
{
      firebase.auth().onAuthStateChanged(function(user) {
      if (user) 
      {          
        getOrderOfUser()
        loadProfile()
      } 
      else 
      {
        window.location = 'login.html';
      }
});
}

function getOrderOfUser(){

	const userId = firebase.auth().currentUser.uid
	const db = firebase.firestore();

	db.collection("user").doc(userId).get().then((snap) => {
		console.log(snap.data())
		$("#userName").text(`Name: ${snap.data().firstname} ${snap.data().lastname}`)
		$("#userEmail").text(`Email Id: ${snap.data().email}`)
	});


	orders.orders = [];
	db.collection("order").where("userId", "==", userId).get().then((snapshot) => {
		snapshot.forEach((doc) =>{
			const id = doc.id
			const orderData = doc.data()

			var orderStatusClass = ""

			if(orderData.status == "Ordered"){
				orderStatusClass = ""
			} else if(orderData.status == "Confirmed"){
				orderStatusClass = "text-info"
			} else if(orderData.status == "Shipped"){
				orderStatusClass = "text-warning"
			} else if(orderData.status == "Delivered"){
				orderStatusClass = "text-success"
			} else if(orderData.status == "Canceled"){
				orderStatusClass = "text-danger"
			}
			orderData.products.forEach((product) => {
				orders.orders.push({
					orderId: orderData.orderId,
					orderStatusClass: orderStatusClass,
					...product
				});
			})
		});
		showOrder();
	});
}

function showOrder(){
	console.log(orders.orders)
	orders.orders.forEach((order, index) => {
		$(".order-box").append(
		`<div class="card-body row">
      <h6 class="col-sm-12 text-secondary">
        <b>Order ID: </b>${order.orderId}
      </h6>
      <div class="col-sm-3">
        <div class="product-image">
          <img src="images/card_image 2.png" width="100%">
        </div>
      </div>
      <div class="col-sm-5">
        <h5 id="productName">${order.productname}</h5>
        <p id="productPrice">${order.productprice}</p>
        <div class="button"> 
          <button type="button" class="btn btn-primary btn-orange mt-0" data-toggle="collapse" href="#collapseExample${index}" aria-expanded="false" aria-controls="collapseExample">Track Package</button>
        </div>
      </div>
      <div class="col-sm-4">
        <div class="collapse" id="collapseExample${index}">
          <div class="card card-body">
          	<h6 class="${order.orderStatusClass == "" ? "text-info" : "text-secondary"}">Ordered</h6>
            <h6 class="${order.orderStatusClass == "text-info" ? order.orderStatusClass : "text-secondary"}">Confirmed</h6>
            <h6 class="${order.orderStatusClass == "text-danger" ? order.orderStatusClass : "text-secondary"}">Cancel</h6>
            <h6 class="${order.orderStatusClass == "text-warning" ? order.orderStatusClass : "text-secondary"}">Shipped</h6>
            <h6 class="${order.orderStatusClass == "text-success" ? order.orderStatusClass : "text-secondary"}">Delivered</h6>
          </div>
        </div>
      </div>
    </div>
    <hr>`)
	})
}