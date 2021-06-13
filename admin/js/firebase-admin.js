// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "AIzaSyAgDjNtnKMfinuNAHddBe8OnSBeivNnUFw",
  authDomain: "fresh-basket-1ee04.firebaseapp.com",
  projectId: "fresh-basket-1ee04",
  storageBucket: "fresh-basket-1ee04.appspot.com",
  messagingSenderId: "39663268992",
  appId: "1:39663268992:web:423982874875d703be2265",
  measurementId: "G-0V9W5N7DX2"
};
// Initialize Firebase

firebase.initializeApp(firebaseConfig);
firebase.analytics();

const db = firebase.firestore();

var categories = {categories:[]}

function initCategory(){
	categories.categories = [];
	db.collection("categories").get().then((snapshot) =>{
		snapshot.forEach((doc) =>{
			categories.categories.push({id: doc.id, ...doc.data()});
			// console.log(doc.id, " => ", doc.data());
		});
		w3.displayObject("dataTable", categories);
	});
	$(document).on("click",".deleteCategoryButton", function(){
		$("#deleteModal .modal-footer a").val($(this).data("id"));
	})

	$(document).on("click",".editCategoryButton", function(){
		$("#editModal #editCategoryName").val($(this).data("name"));		
		$("#editModal .modal-footer a").val($(this).data("id"));		
	})
}

function addCategory(){
	const name = document.getElementById('categoryName').value
	if(name != null && name.trim() != ""){
		db.collection("categories").add({name: name, count: 0, image: ""}).then(() => {
			document.getElementById("addclose").click();
			initCategory();
		})
	} else {
		alert("Field is empty");
	} 
}

function refreshCategory(){
	categories.categories = [];
	db.collection("categories").get().then((snapshot) =>{
		snapshot.forEach((doc) =>{
			categories.categories.push({id: doc.id, ...doc.data()});
			// console.log(doc.id, " => ", doc.data());
		});
		w3.displayObject("dataTable", categories);
	})
}

function deleteCategory(id) {
	const catRef = db.collection("categories").doc(id)
	catRef.get().then((doc) => {
		if(doc.data().count == 0){
			catRef.delete().then(() => {
				document.getElementById("deleteCategoryClose").click();
				initCategory();
			})
		} else {
			document.getElementById("deleteCategoryClose").click();
			alert("Category is not empty");
		}
	})
}

function editCategory(id) {
	const name = document.getElementById('editCategoryName').value
	if(name != null && name.trim() != ""){
		db.collection("categories").doc(id).set({name: name},{merge: true}).then(() => {
			document.getElementById("editClose").click();
			initCategory();
		})
	} else {
		alert("Field is empty");
	}
}


// Products
function loadCategories(){
	categories.categories = []
	db.collection("categories").get().then((snapshot) =>{
		snapshot.forEach((doc) =>{
			categories.categories.push({id: doc.id, ...doc.data()});
		});
		w3.displayObject("AddProductCategory", categories);
		w3.displayObject("editProductCategory", categories);
	});
}

$('#addModal').on('show.bs.modal', function () {
  loadCategories()
})
$('#editModal').on('show.bs.modal', function () {
  loadCategories()
})

var products = {products:[]}
function initProduct(){
	products.products = [];
	db.collection("products").get().then((snapshot) =>{
		snapshot.forEach((doc) =>{
			doc.data().category.get().then((ref) => {
				var priceString = ""
				
				const [weight, price] = Object.entries(doc.data().price)[0]
				priceString = `[${weight}: ${price}]`

				products.products.push({id: doc.id, ...doc.data(), 
					priceString: priceString,
					price: price, weight: weight,
					category: ref.data().name, categoryId: ref.id});
				w3.displayObject("dataTable", products);
			});
		});
	});
	$(document).on("click",".deleteProductButton", function(){
		$("#deleteModal .modal-footer a").val($(this).data("id"));
	});

	$(document).on("click",".editProductButton", function(){
		$("#editModal #editProductName").val($(this).data("name"));	
		$("#editModal #editProductCategory").val($(this).data("category"));	
		$("#editModal #editProductWeight").val($(this).data("weight"));	
		$("#editModal #editProductPrice").val($(this).data("price"));	
		$("#editModal #editProductDetail").val($(this).data("detail"));	
		$("#editModal #editProductIngredients").val($(this).data("ingredients"));	
		$("#editModal .modal-footer a").val($(this).data("id"));		
	})
}

function addProduct(){
	const name = document.getElementById('productName').value
	const categoryID = document.getElementById('AddProductCategory').value
	const weight = document.getElementById('productWeight').value
	const price = document.getElementById('productPrice').value
	const details = document.getElementById('productDetail').value
	const ingredients = document.getElementById('productIngredients').value
	if(name != null && name.trim() != ""){
		const obj = {
			name: name, 
			ingredients: ingredients,
			category:db.collection("categories").doc(categoryID),
			details: details,
			price:{},
			image: ""
		}
		obj.price[weight] = parseInt(price)
		db.collection("products").add(obj).then(() => {
			var catDocRef = db.collection("categories").doc(categoryID)
			db.runTransaction((transaction) => {
				return transaction.get(catDocRef).then((doc) => {
					var count = doc.data().count + 1
					transaction.update(catDocRef, { count: count });
				})
			})
			.then(() => {
				document.getElementById("addclose").click();
				initProduct();	
			});
		});
	} else {
		alert("Field is empty");
	} 
}

function editProduct(id){
	const name = document.getElementById('editProductName').value
	const newCategoryID = document.getElementById('editProductCategory').value
	const weight = document.getElementById('editProductWeight').value
	const price = document.getElementById('editProductPrice').value
	const details = document.getElementById('editProductDetail').value
	const ingredients = document.getElementById('editProductIngredients').value
	if(name != null && name.trim() != ""){
		const obj = {
			name: name, 
			ingredients: ingredients,
			category:db.collection("categories").doc(newCategoryID),
			details: details,
			price:{},
			image: ""
		}
		obj.price[weight] = parseInt(price)

		db.runTransaction((transaction) => {
			const prodRef = db.collection("products").doc(id)
			return transaction.get(prodRef)
			.then((prodDoc) => {
				const newcatDocRef = db.collection("categories").doc(newCategoryID)
				const oldcatDocRef = prodDoc.data().category
				const oldCategoryID = oldcatDocRef.id
				if(newCategoryID != oldCategoryID) {
					return transaction.get(oldcatDocRef).then((doc) => {
						var count = doc.data().count - 1
						return transaction.get(newcatDocRef).then((newDoc) => {
							var newCatCount = newDoc.data().count + 1
							transaction.update(oldcatDocRef, { count: count });
							transaction.update(newcatDocRef, { count: newCatCount });
							transaction.update(prodRef, obj)
						})
					})
				} else {
					transaction.update(prodRef,obj)
				}
			})
		}).then(() => {
			document.getElementById("editClose").click();
			initProduct();	
		})	
	} else {
		alert("Field is empty");
	} 
}


function deleteProduct(name) {
	db.collection("products").doc(name).delete().then(() => {
		document.getElementById("deleteProductClose").click();
		initProduct();
	})
}

function logOut()
{
  firebase.auth().signOut().then(() => {
    window.location = 'login.html';
}).catch((error) => {
  console.error("Error in updating data", error);
});
}