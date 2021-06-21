function getProductCount(){
	db.collection("products").get().then(snap => {
		document.getElementById('totalProductCount').innerHTML = snap.size;
	});
	
}

function getCategoryCount(){
	db.collection("categories").get().then(snap => {
	document.getElementById('totalCategoryCount').innerHTML = snap.size;
	});
}

function getConfirmedCount(){
	db.collection("order").where("status", "in", ["Confirmed", "Shipped", "Delivered"]).get().then(snap => {
	document.getElementById('totalConfirmedCount').innerHTML = snap.size;
	});
}

function getPendingCount(){
	db.collection("order").where("status", "==", "Ordered").get().then(snap => {
	document.getElementById('totalPendingCount').innerHTML = snap.size;
	});
}

var consoleVar;

function drawChart(){
	// Set new default font family and font color to mimic Bootstrap's default styling
	Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
	Chart.defaults.global.defaultFontColor = '#858796';

	var chartData = []

	// Pie Chart Example
	db.collection("order").where("status", "!=", "Canceled").get().then(snap => {
		var data = []
		snap.forEach((doc) =>{
			data.push(doc.data().products)
		})
		data = data.flat(1)
		data = _.map(data, (product) => { 
			return {categoryId: product.category.id, quantity: product.quantity} 
		})
		
		data = _.reduce(data, (result, product, key) => {
			if(result[product.categoryId] == undefined){
				result[product.categoryId] = 0
			}
			result[product.categoryId] += product.quantity
  		return result;
		},{})

		var promises = []
		_.forIn(data, (value, key) => {
  			promises.push(db.collection("categories").doc(key).get().then(snap => {
  				chartData[snap.data().name] = value
  			}))
		});

		Promise.allSettled(promises).then(() => {loadChart(chartData)})
		
	});
}

function loadChart(chartData){
	var ctx = document.getElementById("myPieChart");
	var myPieChart = new Chart(ctx, {
	  type: 'doughnut',
	  data: {
	    labels: _.keys(chartData),
	    datasets: [{
	      data: _.values(chartData),
	      backgroundColor: ['#e57373',"#4dd0e1", '#9575cd', '#64b5f6', '#81c784', "#fff176", "#ffb74d", "#ff8a65", "#90a4ae"],
	      hoverBackgroundColor: ['#e53935',"#00acc1", '#5e35b1', '#1e88e5', '#43a047', "#fdd835", "#fb8c00", "#f4511e", "#546e7a"],
	      hoverBorderColor: "rgba(234, 236, 244, 1)",
	    }],
	  },
	  options: {
	    maintainAspectRatio: false,
	    tooltips: {
	      backgroundColor: "rgb(255,255,255)",
	      bodyFontColor: "#858796",
	      borderColor: '#dddfeb',
	      borderWidth: 1,
	      xPadding: 15,
	      yPadding: 15,
	      displayColors: false,
	      caretPadding: 10,
	    },
	    legend: {
	      display: true
	    },
	    cutoutPercentage: 80,
	  },
	});
}