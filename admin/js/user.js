// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

var users = {users:[]}
var orders = {orders:[]}

function initUserBody(){
	getUserList();
}

function getUserList(){
	users.users = [];
	db.collection("user").get().then((snapshot) => {
		snapshot.forEach((doc) =>{
			const id = doc.id
			const orderData = 
			
			users.users.push({
				...doc.data(),
				id: id, 
			});
		});
		
		w3.displayObject("dataTable", users);
		datatable = $("#dataTable").dataTable()

	});
	$(document).on("click",".btn-danger", function(){
		const id = $(this).data("orderid")
		db.collection("order").doc(id).set({status: "Canceled"},{merge: true}).then(() => {getOrderList()});
	})
}

function getQueryParams(param)
{
      const urlSearchParams = new URLSearchParams(window.location.search);
      const params = Object.fromEntries(urlSearchParams.entries());
      return params[param] || "";
}

function getOrderOfUser(){
	$(document).off("click",".btn-success")
	$(document).on("click",".btn-success", function(){
		const id = $(this).data("orderid")
		db.collection("order").doc(id).set({status: "Confirmed"},{merge: true}).then(() => {getOrderOfUser()});
	})
	$(document).off("click",".btn-warning")
	$(document).on("click",".btn-warning", function(){
		const id = $(this).data("orderid")
		db.collection("order").doc(id).set({status: "Shipped"},{merge: true}).then(() => {getOrderOfUser()});
	})
	$(document).off("click",".btn-info")
	$(document).on("click",".btn-info", function(){
		const id = $(this).data("orderid")
		db.collection("order").doc(id).set({status: "Delivered"},{merge: true}).then(() => {getOrderOfUser()});
	})
	$(document).off("click",".btn-danger")
	$(document).on("click",".btn-danger", function(){
		const id = $(this).data("orderid")
		db.collection("order").doc(id).set({status: "Canceled"},{merge: true}).then(() => {getOrderOfUser()});
	})

	const userId = getQueryParams('user');

	db.collection("user").doc(userId).get().then((snap) => {
		console.log(snap.data())
		$("#userName").text(`Name: ${snap.data().firstname} ${snap.data().lastname}`)
		$("#userEmail").text(`Email Id: ${snap.data().email}`)
		$("#userContact").text(`Contact Number: ${snap.data().contact != undefined ? snap.data().contact : "N/A"}`)
		$("#userAddress").text(`Address: ${snap.data().address != undefined ? snap.data().address : "N/A"}`)
	});


	orders.orders = [];
	db.collection("order").where("userId", "==", userId).get().then((snapshot) => {
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
			orders.orders.push({
				...orderData,
				id: id, 
				productSize: orderData.products.length,
				orderNextStatus: orderNextStatus,
				buttonClass:buttonClass,
				cancelDisable: cancelDisable
			});
		});
		displayOrderData();
		datatable = $("#dataTable").dataTable()
	});
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
	    </tr>`)
	})
}