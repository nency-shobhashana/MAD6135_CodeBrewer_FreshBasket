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
	db.collection("categories").get().then((snapshot) =>{
		snapshot.forEach((doc) =>{
			categories.categories.push({name: doc.id, ...doc.data()});
			// console.log(doc.id, " => ", doc.data());
		});
		w3.displayObject("dataTable", categories);
	});
	$(document).on("click",".deleteCategoryButton", function(){
		$("#deleteModal .modal-footer a").val($(this).data("id"));
		
	})

}

function addCategory(){
	const name = document.getElementById('categoryName').value
	if(name != null && name.trim() != ""){
		db.collection("categories").doc(name.trim()).set({count: 0, image: ""}).then(() => {
			document.getElementById("addclose").click();
		})
	} else {
		alert("Field is empty");
	} 
}

function refreshCategory(){
	categories.categories = [];
	db.collection("categories").get().then((snapshot) =>{
		snapshot.forEach((doc) =>{
			categories.categories.push({name: doc.id, ...doc.data()});
			// console.log(doc.id, " => ", doc.data());
		});
		w3.displayObject("dataTable", categories);
	})
}

function deleteCategory(name) {
	db.collection("categories").doc(name).delete().then(() => {
		document.getElementById("deleteCategoryClose").click();
		refreshCategory();
	})
}

function editCategory() {
	
}

function logOut()
{
  firebase.auth().signOut().then(() => {
    window.location = 'login.html';
}).catch((error) => {
  console.error("Error in updating data", error);
});
}