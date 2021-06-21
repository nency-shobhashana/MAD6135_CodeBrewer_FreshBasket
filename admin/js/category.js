$('.cate#addModal').on('show.bs.modal', function () {
	document.getElementById('categoryName').value = ""
	document.getElementById('categoryImage').value = ""
})
$('.cate#editModal').on('show.bs.modal', function () {
})

function initCategory(){
	categories.categories = [];
	db.collection("categories").get().then((snapshot) => {
		
		var promises = []

		snapshot.forEach((doc) =>{
			promises.push(storage.ref(doc.data().image).getDownloadURL().then((url) => {
				categories.categories.push({id: doc.id, imagePath: url, ...doc.data()});
			}).catch((error) => {
				categories.categories.push({id: doc.id, ...doc.data()});
			}));
		});
		Promise.allSettled(promises).finally(() => {
			if(datatable != undefined){
				datatable.fnDestroy()
			} 
			w3.displayObject("dataTable", categories);
			datatable = $("#dataTable").dataTable()
		})
		
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
	const photo = document.getElementById('categoryImage').files[0]
	if(name != null && name.trim() != "" && photo != null){
		db.collection("categories").add({name: name, count: 0, image: `images/${photo.name}`}).then(() => {
	
			storageRef.child(`images/${photo.name}`).put(photo)
			
			document.getElementById("addclose").click();
			initCategory();
		})
	} else {
		alert("Field is empty");
	} 
}

function deleteCategory(id) {
	const catRef = db.collection("categories").doc(id)
	catRef.get().then((doc) => {
		if(categories.categories.length <= 5){
			document.getElementById("deleteCategoryClose").click();
			alert("can not delete, min 5 categories needed");
		} else if(doc.data().count == 0){
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
	const photo = document.getElementById('editCategoryImage').files[0]
	if(name != null && name.trim() != "" ){
		var newObj = {name: name}

		if(photo != null){
			newObj = {...newObj, image: `images/${photo.name}`}
			storageRef.child(`images/${photo.name}`).put(photo)
		}

		db.collection("categories").doc(id).set(newObj,{merge: true}).then(() => {
			document.getElementById("editClose").click();
			initCategory();
		})
	} else {
		alert("Field is empty");
	}
}