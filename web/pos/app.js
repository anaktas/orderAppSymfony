$(document).ready(function() {
	setInterval(getOrders, 7000);
	getOrders();
	$('#pwd').bind('keypress', {}, keypressInBox);
});

// Pressing the enter in the search box
function keypressInBox(e) {
	var code = (e.keyCode ? e.keyCode : e.which);
	if (code == 13) {
		e.preventDefault();
		doLogin();
	}
}

function logOut() {
	console.log("logout.");
	$('#loginForm').removeClass('hidden');
	$('#posPanel').addClass('hidden');
	$('#responseLabel').html("");
}

function doLogin() {
	console.log("login.");
	var username = $('#usr').val();
	var password = $('#pwd').val();
	var roleId = 2;
		
	var params = {};
	params.username = username.trim();
	params.password = password.trim();
	params.roleId = roleId;
	var jsonRequest = JSON.stringify(params);
	console.log(jsonRequest);
	$('#responseLabel').html("Παρακαλώ περιμένετε...");

	$.ajax({
		url: "/api/user/login",
		type: "POST",
		async: true,
		dataType: "json",
		data: jsonRequest,
		success: function(response) {
			if (response.response == "match") {
				$('#posPanel').removeClass('hidden');
				$('#loginForm').addClass('hidden');
			} else {
				$('#responseLabel').html("Έχετε πληκτρολογήσει ή λάθος κωδικό, ή λάθος όνομα χρήστη, ή ο χρήστης δεν έχει δικαίωμα χρήσης του διαχειριστικού πάνελ.");
			}
		},
		failure: function(errorMsg) {
			$('#alertMsg').html('<div class=\"alert alert-danger\"><strong>AJAX αποτυχία.</strong></div>');
			$("#myAlertModal").modal("show");
		},
		error: function(jqXHR, testStatus, errorThrown) {
			console.log(jqXHR.status);
			// In case of error, change the execution status
			$('#alertMsg').html('<div class=\"alert alert-danger\"><strong>' + jqXHR.status + ' - AJAX σφάλμα.</strong></div>');
			$("#myAlertModal").modal("show");
		}
	});
}

function getOrders() {
	console.log("getOrder.");
	
	$('#statusQueue').html("<h3><b>Ανανέωση...</b></h3>");

	$.ajax({
		url: "/api/ordering/getopened",
		type: "POST",
		async: true,
		dataType: "json",
		success: function(response) {
			$('#statusQueue').html("");
			console.log("Inside AJAX");
			var stringResponse = JSON.stringify(response);
			console.log(stringResponse);
			var innerSelectHTML = '';
			var parsedResponse = JSON.parse(stringResponse);
			trHTML = '';
			// Object JSONising the stringResponse
			var parsedResponse = JSON.parse(stringResponse);
			// If the customer field is undefined, return "No result were found"
			if (typeof parsedResponse.response === "undefined") {
				trHTML += '<tr>' + 
				          '<td class=\"warning\" align=\"center\"><b>Δεν βρέθηκαν αποτελέσματα.</b></td></tr>';
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
					// Create each table row
					trHTML += '<tr>' + 
							  '<td><button type=\"button\" class=\"btn btn-success btn-block\" onclick=\"showOrderDetails(' +  obj['id'] + ')\"><h3>ORDER #' + obj['id'] + '</h3></td>' +
							  '</tr>';
				});
				$('#queueTable').html(trHTML);
			}
		},
		failure: function(errorMsg) {
			$('#statusQueue').html("");
			$('#alertMsg').html('<div class=\"alert alert-danger\"><strong>AJAX αποτυχία.</strong></div>');
			$("#myAlertModal").modal("show");
		},
		error: function(jqXHR, testStatus, errorThrown) {
			console.log(jqXHR.status);
			$('#statusQueue').html("");
			// In case of error, change the execution status
			$('#alertMsg').html('<div class=\"alert alert-danger\"><strong>' + jqXHR.status + ' - AJAX σφάλμα.</strong></div>');
			$("#myAlertModal").modal("show");
		}
	});
}

function showOrderDetails(orderListId) {
	console.log("showOrderDetails()");
	$("#statusOrderDetails").html("<h3><b>Παρακαλώ περιμένετε...</b></h3>");
		
	var params = {};
	params.id = parseInt(orderListId);
	var jsonRequest = JSON.stringify(params);
	console.log(jsonRequest);

	$.ajax({
		url: "/api/ordering/getopeneddetails",
		type: "POST",
		async: true,
		dataType: "json",
		data: jsonRequest,
		success: function(response) {
			console.log("Inside AJAX");
			$("#statusOrderDetails").html("");
			console.log("Inside AJAX");
			var stringResponse = JSON.stringify(response);
			console.log(stringResponse);
			var innerSelectHTML = '';
			var parsedResponse = JSON.parse(stringResponse);
			trHTML = '<thead><tr>' +
					 '<th><h3><b>Προϊόν</b></h3></th>' +
					 '<th><h3><b>Ποσότητα</b></h3></th>' +
					 '<th><h3><b>Πρόσθετα</b></h3</th>' +
					 '</tr></thead>' +
					 '<tbody>';
			// Object JSONising the stringResponse
			var parsedResponse = JSON.parse(stringResponse);
			// If the customer field is undefined, return "No result were found"
			if (typeof parsedResponse.response === "undefined") {
				trHTML += '<tr>' + 
				          '<td style=\"display: none;\"></td>' + 
				          '<td style=\"display: none;\"></td>' + 
				          '<td style=\"display: none;\"></td>' + 
				          '<td class=\"warning\" align=\"center\" colspan=\"11\"><b>Δεν βρέθηκαν αποτελέσματα.</b></td></tr>';
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
					var name = typeof obj['name'] === "undefined" ? "" : obj['name'];
					var quantity = typeof obj['quantity'] === "undefined" ? "" : obj['quantity'];
					var description = typeof obj['description'] === "undefined" ? "" : obj['description'];
					// Create each table row
					trHTML += '<tr>' + 
							  '<td><h3>' + name + '</h3></td>' +
							  '<td><h3>' + quantity + '</h3></td>' +
							  '<td><h3>' + description + '</h3></td>' +
							  '</tr>';
				});
				trHTML += '</tbody>';
				$('#orderDetailsTable').html(trHTML);
				var buttonAreaText = '<button type=\"button\" class=\"btn btn-info\" onclick=\"setOrderToReady(' + orderListId + ')\"><h3>ΕΤΟΙΜΟ</h3></button>' +
									 '<button type=\"button\" class=\"btn btn-warning\" onclick=\"hideOrderDetails()\"><h3>ΑΠΟΚΡΥΨΗ</h3></button>' +
									 '<button type=\"button\" class=\"btn btn-danger\" onclick=\"setOrderToCanceled(' + orderListId + ')\"><h3>ΑΚΥΡΩΣΗ</h3></button>';
				$('#buttonArea').html(buttonAreaText);
			}
		},
		failure: function(errorMsg) {
			$('#alertMsg').html('<div class=\"alert alert-danger\"><strong>AJAX αποτυχία.</strong></div>');
			$("#myAlertModal").modal("show");
		},
		error: function(jqXHR, testStatus, errorThrown) {
			console.log(jqXHR.status);
			// In case of error, change the execution status
			$('#alertMsg').html('<div class=\"alert alert-danger\"><strong>' + jqXHR.status + ' - AJAX σφάλμα.</strong></div>');
			$("#myAlertModal").modal("show");
		}
	});
}

function hideOrderDetails() {
	$('#orderDetailsTable').html("");
	$('#buttonArea').html("");
}

function setOrderToReady(orderListId) {
	console.log("setOrderToready()");
	$("#statusOrderDetails").html("<h3><b>Παρακαλώ περιμένετε...</b></h3>");
		
	var params = {};
	params.id = parseInt(orderListId);
	var jsonRequest = JSON.stringify(params);
	console.log(jsonRequest);

	$.ajax({
		url: "/api/ordering/setready",
		type: "POST",
		async: true,
		dataType: "json",
		data: jsonRequest,
		success: function(response) {
			console.log("Inside AJAX");
			$("#statusOrderDetails").html("");
			$('#orderDetailsTable').html("");
			$('#buttonArea').html("");
			if (response.response == "Error") {
				$('#alertMsg').html('<div class=\"alert alert-danger\"><strong>Κάτι πήγε στραβά...</strong></div>');
				$("#myAlertModal").modal("show");
			}
		},
		failure: function(errorMsg) {
			$('#alertMsg').html('<div class=\"alert alert-danger\"><strong>AJAX αποτυχία.</strong></div>');
			$("#myAlertModal").modal("show");
		},
		error: function(jqXHR, testStatus, errorThrown) {
			console.log(jqXHR.status);
			// In case of error, change the execution status
			$('#alertMsg').html('<div class=\"alert alert-danger\"><strong>' + jqXHR.status + ' - AJAX σφάλμα.</strong></div>');
			$("#myAlertModal").modal("show");
		}
	});

	getOrders();
}

function setOrderToCanceled(orderListId) {
	console.log("setOrderToCanceled()");
	$("#statusOrderDetails").html("<h3><b>Παρακαλώ περιμένετε...</b></h3>");
		
	var params = {};
	params.id = parseInt(orderListId);
	var jsonRequest = JSON.stringify(params);
	console.log(jsonRequest);

	$.ajax({
		url: "/api/ordering/setcancelled",
		type: "POST",
		async: true,
		dataType: "json",
		data: jsonRequest,
		success: function(response) {
			console.log("Inside AJAX");
			$("#statusOrderDetails").html("");
			$('#orderDetailsTable').html("");
			$('#buttonArea').html("");
			if (response.response == "Error") {
				$('#alertMsg').html('<div class=\"alert alert-danger\"><strong>Κάτι πήγε στραβά...</strong></div>');
				$("#myAlertModal").modal("show");
			}
		},
		failure: function(errorMsg) {
			$('#alertMsg').html('<div class=\"alert alert-danger\"><strong>AJAX αποτυχία.</strong></div>');
			$("#myAlertModal").modal("show");
		},
		error: function(jqXHR, testStatus, errorThrown) {
			console.log(jqXHR.status);
			// In case of error, change the execution status
			$('#alertMsg').html('<div class=\"alert alert-danger\"><strong>' + jqXHR.status + ' - AJAX σφάλμα.</strong></div>');
			$("#myAlertModal").modal("show");
		}
	});

	getOrders();
}

function refreshTableNumbers() {
	console.log("Inside refreshTableNumbers()");
	$("#statusViewTableOrders").html("Εκτέλεση. Παρακαλώ περιμένετε...");

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
			$('#selectedTable').after().html(innerSelectHTML);
			$("#statusViewTableOrders").html("Εντάξει.");
		},
		failure: function(errorMsg) {
			$("#statusViewTableOrders").html("AJAX αποτυχία.");
			$('#alertMsg').html('<div class=\"alert alert-danger\"><strong>AJAX αποτυχία.</strong></div>');
			$("#myAlertModal").modal("show");
		},
		error: function(jqXHR, testStatus, errorThrown) {
			console.log(jqXHR.status);
			// In case of error, change the execution status
			$("#statusViewTableOrders").html("AJAX σφάλμα.");
			$('#alertMsg').html('<div class=\"alert alert-danger\"><strong>' + jqXHR.status + ' - AJAX σφάλμα.</strong></div>');
			$("#myAlertModal").modal("show");
		}
	});
}

function viewTableOrders() {
	console.log("viewTableOrders()");
	$("#statusViewTableOrders").html("Εκτέλεση. Παρακαλώ περιμένετε...");

	var tableNumber = parseInt($("#selectedTable option:selected").val());

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
			trHTML = '<thead><tr>' +
					 '<th><h3><b>Προϊόν</b></h3></th>' +
					 '<th><h3><b>Ποσότητα</b></h3></th>' +
					 '<th><h3><b>Πρόσθετα</b></h3</th>' +
					 '<th><h3><b>Μερικό σύνολο</b></h3</th>' +
					 '</tr></thead>' +
					 '<tbody>';
			// Object JSONising the stringResponse
			var parsedResponse = JSON.parse(stringResponse);
			// If the customer field is undefined, return "No result were found"
			if (typeof parsedResponse.response === "undefined") {
				trHTML += '<tr>' + 
				          '<td style=\"display: none;\"></td>' + 
				          '<td style=\"display: none;\"></td>' + 
				          '<td style=\"display: none;\"></td>' + 
				          '<td style=\"display: none;\"></td>' + 
				          '<td class=\"warning\" align=\"center\" colspan=\"11\"><b>Δεν βρέθηκαν αποτελέσματα.</b></td></tr>';
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
					var name = typeof obj['name'] === "undefined" ? "" : obj['name'];
					var quantity = typeof obj['quantity'] === "undefined" ? "" : obj['quantity'];
					var description = typeof obj['description'] === "undefined" ? "" : obj['description'];
					var totalPrice = typeof obj['totalPrice'] === "undefined" ? parseFloat(0) : parseFloat(obj['totalPrice']);
					if(typeof obj['totalPrice'] === "undefined") {
						total += parseFloat(0);
					} else {
						total += parseFloat(obj['totalPrice']);
					}
					// Create each table row
					trHTML += '<tr>' + 
							  '<td><h3>' + name + '</h3></td>' +
							  '<td><h3>' + quantity + '</h3></td>' +
							  '<td><h3>' + description + '</h3></td>' +
							  '<td><h3>' + totalPrice.toFixed(2) + '</h3></td>' +
							  '</tr>';							
				});
				trHTML += '</tbody>';
				$('#tableOrdersTable').html(trHTML);
				var buttonAreaText = '<button type=\"button\" class=\"btn btn-info\" onclick=\"setTableOrderToComplete(' + tableNumber + ')\"><h3>ΠΛΗΡΩΜΗ</h3></button>' +
									 '<button type=\"button\" class=\"btn btn-danger\" onclick=\"setTableOrderToCanceled(' + tableNumber + ')\"><h3>ΑΚΥΡΩΣΗ ΠΑΡΑΓΓΕΛΙΑΣ</h3></button>';
				$('#tableOrdersButtonArea').html(buttonAreaText);
				$('#totalPrice').html('<h3><b>' + total.toFixed(2) + '</b></h3>');
			}
		},
		failure: function(errorMsg) {
			$('#alertMsg').html('<div class=\"alert alert-danger\"><strong>AJAX αποτυχία.</strong></div>');
			$("#myAlertModal").modal("show");
		},
		error: function(jqXHR, testStatus, errorThrown) {
			console.log(jqXHR.status);
			// In case of error, change the execution status
			$('#alertMsg').html('<div class=\"alert alert-danger\"><strong>' + jqXHR.status + ' - AJAX σφάλμα.</strong></div>');
			$("#myAlertModal").modal("show");
		}
	});
}

function setTableOrderToComplete(tableNumber) {
	console.log("setTableOrderToComplete()");
	$("#statusTableOrderDetails").html("Παρακαλώ περιμένετε...");
		
	var params = {};
	params.tableNumber = parseInt(tableNumber);
	var jsonRequest = JSON.stringify(params);
	console.log(jsonRequest);

	$.ajax({
		url: "/api/ordering/complete",
		type: "POST",
		async: true,
		dataType: "json",
		data: jsonRequest,
		success: function(response) {
			console.log("Inside AJAX");
			$("#statusTableOrderDetails").html("Εντάξει.");
			$('#tableOrdersTable').html("");
			$('#tableOrdersButtonArea').html("");
			$('#totalPrice').html("");
			if (response.response == "Error") {
				$('#alertMsg').html('<div class=\"alert alert-danger\"><strong>Κάτι πήγε στραβά...</strong></div>');
				$("#myAlertModal").modal("show");
			}
		},
		failure: function(errorMsg) {
			$('#alertMsg').html('<div class=\"alert alert-danger\"><strong>AJAX αποτυχία.</strong></div>');
			$("#myAlertModal").modal("show");
		},
		error: function(jqXHR, testStatus, errorThrown) {
			console.log(jqXHR.status);
			// In case of error, change the execution status
			$('#alertMsg').html('<div class=\"alert alert-danger\"><strong>' + jqXHR.status + ' - AJAX σφάλμα.</strong></div>');
			$("#myAlertModal").modal("show");
		}
	});
}

function setTableOrderToCanceled(tableNumber) {
	console.log("setTableOrderToCanceled()");
	$("#statusTableOrderDetails").html("Παρακαλώ περιμένετε...");
		
	var params = {};
	params.tableNumber = parseInt(tableNumber);
	var jsonRequest = JSON.stringify(params);
	console.log(jsonRequest);

	$.ajax({
		url: "/api/ordering/cancel",
		type: "POST",
		async: true,
		dataType: "json",
		data: jsonRequest,
		success: function(response) {
			console.log("Inside AJAX");
			$("#statusTableOrderDetails").html("Εντάξει.");
			$('#tableOrdersTable').html("");
			$('#tableOrdersButtonArea').html("");
			$('#totalPrice').html("");
			if (response.response == "Error") {
				$('#alertMsg').html('<div class=\"alert alert-danger\"><strong>Κάτι πήγε στραβά...</strong></div>');
				$("#myAlertModal").modal("show");
			}
		},
		failure: function(errorMsg) {
			$('#alertMsg').html('<div class=\"alert alert-danger\"><strong>AJAX αποτυχία.</strong></div>');
			$("#myAlertModal").modal("show");
		},
		error: function(jqXHR, testStatus, errorThrown) {
			console.log(jqXHR.status);
			// In case of error, change the execution status
			$('#alertMsg').html('<div class=\"alert alert-danger\"><strong>' + jqXHR.status + ' - AJAX σφάλμα.</strong></div>');
			$("#myAlertModal").modal("show");
		}
	});
}