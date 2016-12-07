var orderTableNumber;
var details;

$(document).on("pagebeforecreate", "#mainpage", function() {
	console.log("I was triggered!");
	getTableNumbers();
	getCategories();
	orderTableNumber = 0;
	details = [];
});

function getTableNumbers() {
	console.log("Inside getTableNumbers()");

	$.ajax({
		url: "/api/table/getall",
		type: "POST",
		async: true,
		dataType: "json",
		success: function(response) {
			console.log("Inside AJAX");
			var stringResponse = JSON.stringify(response);
			console.log(stringResponse);
			var innerSelectHTML = '';
			var parsedResponse = JSON.parse(stringResponse);
			var arrayResponse = $.map(parsedResponse.response, function(arr) { return arr; });
			console.log(arrayResponse);
			var finalResponse = JSON.parse(JSON.stringify(arrayResponse));
			$.each(finalResponse, function(){
				var obj = {};
				$.each(this, function(key, value) {
					console.log(key + " : " + value);
					obj[key] = value;
				});
				innerSelectHTML += '<option value=\"' + obj['tableNumber'] + '\">' + obj['tableNumber'] + '</option>';
			});
			console.log(innerSelectHTML);
			$('#tableNumber').after().html(innerSelectHTML);
		},
		failure: function(errorMsg) {
			console.log(errorMsg);
		},
		error: function(jqXHR, testStatus, errorThrown) {
			console.log(jqXHR.status);
		}
	});
}

function setTableNumber() {
	console.log("Inside setTableNumber()");
	orderTableNumber = parseInt($("#tableNumber option:selected").val());
	console.log(orderTableNumber);
}

function getCategories() {
	console.log("getCategories.");

	$.ajax({
		url: "/api/category/getall",
		type: "POST",
		async: true,
		dataType: "json",
		success: function(response) {
			console.log("Inside AJAX");
			var stringResponse = JSON.stringify(response);
			console.log(stringResponse);
			var innerSelectHTML = '';
			var parsedResponse = JSON.parse(stringResponse);
			trHTML = '';
			// Object JSONising the stringResponse
			var parsedResponse = JSON.parse(stringResponse);
			var obj = {};
			// If the customer field is undefined, return "No result were found"
			if (typeof parsedResponse.response === "undefined") {
				trHTML += '<li>Empty table</li>';
			} else {
				var arrayResponse = $.map(parsedResponse.response, function(arr) { return arr; });
				console.log(arrayResponse);
				var finalResponse = JSON.parse(JSON.stringify(arrayResponse));
				$.each(finalResponse, function(){
					
					$.each(this, function(key, value) {
						console.log(key + " : " + value);
						obj[key] = value;
					});
					// Create each table row
					trHTML += '<li><a href=\"#products\" onclick=\"getProducts(' + obj['id'] + ')\">' + obj['name'] + '</a></li>';
				});
				console.log(trHTML);
				$('#categoriesList').html(trHTML);
				$('#categoriesList').listview("refresh");
			}
		},
		failure: function(errorMsg) {
			console.log(errorMsg);
		},
		error: function(jqXHR, testStatus, errorThrown) {
			console.log(jqXHR.status);
		}
	});
}

function getProducts(cid) {
	console.log("getProducts.");

	var params = {};
	params.cid = cid;
	var jsonRequest = JSON.stringify(params);

	$.ajax({
		url: "/api/product/getbycid",
		type: "POST",
		async: true,
		dataType: "json",
		data: jsonRequest,
		success: function(response) {
			console.log("Inside AJAX");
			var stringResponse = JSON.stringify(response);
			console.log(stringResponse);
			var innerSelectHTML = '';
			var parsedResponse = JSON.parse(stringResponse);
			trHTML = '';
			// Object JSONising the stringResponse
			var parsedResponse = JSON.parse(stringResponse);
			var obj = {};
			// If the customer field is undefined, return "No result were found"
			if (typeof parsedResponse.response === "undefined") {
				trHTML += '<li>Empty table</li>';
			} else {
				var arrayResponse = $.map(parsedResponse.response, function(arr) { return arr; });
				console.log(arrayResponse);
				var finalResponse = JSON.parse(JSON.stringify(arrayResponse));
				$.each(finalResponse, function(){
					
					$.each(this, function(key, value) {
						console.log(key + " : " + value);
						obj[key] = value;
					});
					// Create each table row
					trHTML += '<li><a href=\"#product\" onclick=\"getProduct(' + obj['id'] + ')\">' + obj['name'] + '</a></li>';
				});
				console.log(trHTML);
				$('#productsList').html(trHTML);
				$('#productsList').listview("refresh");
			}
		},
		failure: function(errorMsg) {
			console.log(errorMsg);
		},
		error: function(jqXHR, testStatus, errorThrown) {
			console.log(jqXHR.status);
		}
	});
}

function getProduct(id) {
	console.log("getProduct.");

	var params = {};
	params.id = id;
	var jsonRequest = JSON.stringify(params);

	$.ajax({
		url: "/api/product/getbyid",
		type: "POST",
		async: true,
		dataType: "json",
		data: jsonRequest,
		success: function(response) {
			console.log("Inside AJAX");
			var stringResponse = JSON.stringify(response);
			console.log(stringResponse);
			var innerSelectHTML = '';
			var parsedResponse = JSON.parse(stringResponse);
			//trHTML = '';
			// Object JSONising the stringResponse
			var parsedResponse = JSON.parse(stringResponse);
			var obj = {};
			// If the customer field is undefined, return "No result were found"
			if (typeof parsedResponse.response === "undefined") {
				//trHTML += '<li>Empty table</li>';
			} else {
				var arrayResponse = $.map(parsedResponse.response, function(arr) { return arr; });
				console.log(arrayResponse);
				var finalResponse = JSON.parse(JSON.stringify(arrayResponse));
				$.each(finalResponse, function(){
					
					$.each(this, function(key, value) {
						console.log(key + " : " + value);
						obj[key] = value;
					});
					// Create each table row
					//trHTML += '<li><a href=\"#product\" onclick=\"getProduct(' + obj['id'] + ')\">' + obj['name'] + '</a></li>';
					$('#theID').html(obj['id']);
					$('#theName').html(obj['name']);
				});
				console.log(trHTML);
				// $('#productsList').html(trHTML);
				// $('#productsList').listview("refresh");
			}
		},
		failure: function(errorMsg) {
			console.log(errorMsg);
		},
		error: function(jqXHR, testStatus, errorThrown) {
			console.log(jqXHR.status);
		}
	});
}

function saveTempOrder() {
	console.log("Inside saveTempOrder()");
	var obj = {};
	obj.pid = parseInt($('#theID').html());
	obj.quantity = parseInt($('#quantity').val());
	obj.description = $('#description').val();
	details.push(obj);
}

function completeOrder() {
	console.log("Inside completeOrder");
	var obj = {};
	obj.pid = parseInt($('#theID').html());
	obj.quantity = parseInt($('#quantity').val());
	obj.description = $('#description').val();
	details.push(obj);

	var params = {};
	params.tableNumber = orderTableNumber;
	params.status = "opened";
	params.details = details;

	var jsonRequest = JSON.stringify(params);

	$.ajax({
		url: "/api/ordering/create",
		type: "POST",
		async: true,
		dataType: "json",
		data: jsonRequest,
		success: function(response) {
			console.log(response);
			details = [];
		},
		failure: function(errorMsg) {
			console.log(errorMsg);
		},
		error: function(jqXHR, testStatus, errorThrown) {
			console.log(jqXHR.status);
		}
	});
}