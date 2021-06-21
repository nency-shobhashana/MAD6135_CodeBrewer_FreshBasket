// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

var orders = {orders:[]}

function initOrderBody(){
	getOrderList();
	$("#order-body").on("DOMSubtreeModified",".btn-danger", function(){
		console.log("disabled function called")
	})

}

function getOrderList(){
	orders.orders = [];

	db.collection("order").get().then((snapshot) => {
		snapshot.size
		snapshot.forEach((doc) =>{
			const id = doc.id
			const orderData = doc.data()

			var orderNextStatus = ""
			var buttonClass = "d-none"
			var cancelDisable = ""

			if(orderData.status == "Ordered"){
				orderNextStatus = "Confirm"
				buttonClass = "btn-success"
			} else if(orderData.status == "Confirmed"){
				orderNextStatus = "Ship"
				buttonClass = "btn-warning"
			} else if(orderData.status == "Shipped"){
				orderNextStatus = "Deliver"
				buttonClass = "btn-info"
			} else if(orderData.status == "Delivered"){
				cancelDisable = "disabled"
			}
			db.collection("user").doc(orderData.userId).get().then((userSnap) => {
				orders.orders.push({
					...orderData,
					id: id, 
					productSize: orderData.products.length,
					orderNextStatus: orderNextStatus,
					buttonClass:buttonClass,
					cancelDisable: cancelDisable,
					userId: userSnap.data().firstname,
					userEmail: userSnap.data().email
				});
				displayOrderData();

			}).catch((error) => {
				orders.orders.push({
					...orderData,
					id: id, 
					productSize: orderData.products.length,
					orderNextStatus: orderNextStatus,
					buttonClass:buttonClass,
					cancelDisable: cancelDisable,
					userId: "",
					userEmail: ""
				});
				displayOrderData();
			});
		});
		displayOrderData();

	});
	$(document).off("click",".btn-success")
	$(document).on("click",".btn-success", function(){
		const id = $(this).data("orderid")
		db.collection("order").doc(id).set({status: "Confirmed"},{merge: true}).then(() => {getOrderList()});
	})
	$(document).off("click",".btn-warning")
	$(document).on("click",".btn-warning", function(){
		const id = $(this).data("orderid")
		db.collection("order").doc(id).set({status: "Shipped"},{merge: true}).then(() => {getOrderList()});
	})
	$(document).off("click",".btn-info")
	$(document).on("click",".btn-info", function(){
		const id = $(this).data("orderid")
		db.collection("order").doc(id).set({status: "Delivered"},{merge: true}).then(() => {getOrderList()});
	})
	$(document).off("click",".btn-danger")
	$(document).on("click",".btn-danger", function(){
		const id = $(this).data("orderid")
		db.collection("order").doc(id).set({status: "Canceled"},{merge: true}).then(() => {getOrderList()});
	})
}

function displayOrderData(){
	$("#order-body").empty();
	orders.orders.forEach((order) => {
		$("#order-body").append(
			`<tr>
	      <td>
	        <button class="btn ${order.buttonClass}" type="button" data-orderid="${order.id}">${order.orderNextStatus}</button>
	        <button class="btn btn-danger" type="button" data-orderid="${order.id}" ${order.cancelDisable}>Cancel</button>
	      </td>
	      <td>${order.status}</td>
	      <td>${order.orderId}</td>
	      <td>${order.productSize}</td>
	      <td>$ ${order.totalPrice}</td>
	      <td>${order.userId}</td>
	      <td>${order.userEmail}</td>
	    </tr>`)
	})
}

