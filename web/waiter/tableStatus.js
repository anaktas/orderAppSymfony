$(document).on("pagebeforecreate", "#mainpage", function() {
	console.log("I was triggered!");
	getTableNumbers();
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

function showTableStatus() {
	console.log("showTableStatus()");

	var tableNumber = parseInt($("#tableNumber option:selected").val());

	var total = parseFloat(0);
		
	var params = {};
	params.tableNumber = tableNumber
	var jsonRequest = JSON.stringify(params);
	console.log(jsonRequest);

	$.ajax({
		url: "/api/ordering/gettableorders",
		type: "POST",
		async: true,
		dataType: "json",
		data: jsonRequest,
		success: function(response) {
			console.log("Inside AJAX");
			$("#statusViewTableOrders").html("Εντάξει.");
			console.log("Inside AJAX");
			var stringResponse = JSON.stringify(response);
			console.log(stringResponse);
			var innerSelectHTML = '';
			var parsedResponse = JSON.parse(stringResponse);
			
			// Object JSONising the stringResponse
			var parsedResponse = JSON.parse(stringResponse);
			// If the customer field is undefined, return "No result were found"
			if (typeof parsedResponse.response === "undefined") {
				
			} else {
				var arrayResponse = $.map(parsedResponse.response, function(arr) { return arr; });
				console.log(arrayResponse);
				var finalResponse = JSON.parse(JSON.stringify(arrayResponse));
				$.each(finalResponse, function(){
					var obj = {};
					$.each(this, function(key, value) {
						console.log(key + " : " + value);
						obj[key] = value;
					});
					var totalPrice = typeof obj['totalPrice'] === "undefined" ? parseFloat(0) : parseFloat(obj['totalPrice']);
					if(typeof obj['totalPrice'] === "undefined") {
						total += parseFloat(0);
					} else {
						total += parseFloat(obj['totalPrice']);
					}			
				});
				
				$('#total').html(total.toFixed(2));
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