$(document).ready(function() {
	var categoriesTable;
	var productsTable;
});

function logOut() {
	console.log("Hello again.");
	alert("Hello");
}

function createCategory() {
	console.log("Inside createCategory()");
	$("#statusLabelCreateCategory").html("Εκτέλεση. Παρακαλώ περιμένετε...");
			
	var name = $("#categoryName").val();
	var description = $("#categoryDescription").val();
		
	var params = {};
	params.name = name;
	params.description = description;
	var jsonRequest = JSON.stringify(params);
	console.log(jsonRequest);

	$.ajax({
		url: "/api/category/create",
		type: "POST",
		async: true,
		dataType: "json",
		data: jsonRequest,
		success: function(response) {
			console.log("Inside AJAX");
			$("#statusLabelCreateCategory").html("Εντάξει.");
			var stringResponse = JSON.stringify(response);
			console.log(stringResponse);
			$('#alertMsg').html('<div class=\"alert alert-info\"><strong>' + response.response + '</strong></div>');
			$("#myAlertModal").modal("show");
		},
		failure: function(errorMsg) {
			$("#statusLabelCreateCategory").html("AJAX αποτυχία.");
			$('#alertMsg').html('<div class=\"alert alert-danger\"><strong>AJAX αποτυχία.</strong></div>');
			$("#myAlertModal").modal("show");
		},
		error: function(jqXHR, testStatus, errorThrown) {
			console.log(jqXHR.status);
			// In case of error, change the execution status
			$("#statusLabelCreateCategory").html("AJAX σφάλμα.");
			$('#alertMsg').html('<div class=\"alert alert-danger\"><strong>' + jqXHR.status + ' - AJAX σφάλμα.</strong></div>');
			$("#myAlertModal").modal("show");
		}
	});

	viewCategories();
}

function refreshCategories() {
	console.log("Inside createCategory()");
	$("#statusLabelCreateProduct").html("Εκτέλεση. Παρακαλώ περιμένετε...");

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
			var arrayResponse = $.map(parsedResponse.response, function(arr) { return arr; });
			console.log(arrayResponse);
			var finalResponse = JSON.parse(JSON.stringify(arrayResponse));
			$.each(finalResponse, function(){
				var obj = {};
				$.each(this, function(key, value) {
					console.log(key + " : " + value);
					obj[key] = value;
				});
				innerSelectHTML += '<option value=\"' + obj['id'] + '\">' + obj['name'] + '</option>';
			});
			console.log(innerSelectHTML);
			$('#selectedCategories').after().html(innerSelectHTML);
			$("#statusLabelCreateProduct").html("Εντάξει.");
		},
		failure: function(errorMsg) {
			$("#statusLabelCreateProduct").html("AJAX αποτυχία.");
			$('#alertMsg').html('<div class=\"alert alert-danger\"><strong>AJAX αποτυχία.</strong></div>');
			$("#myAlertModal").modal("show");
		},
		error: function(jqXHR, testStatus, errorThrown) {
			console.log(jqXHR.status);
			// In case of error, change the execution status
			$("#statusLabelCreateProduct").html("AJAX σφάλμα.");
			$('#alertMsg').html('<div class=\"alert alert-danger\"><strong>' + jqXHR.status + ' - AJAX σφάλμα.</strong></div>');
			$("#myAlertModal").modal("show");
		}
	});
}

function createProduct() {
	console.log("Inside createProduct()");
  	$("#statusLabelCreateProduct").html("Εκτέλεση. Παρακαλώ περιμένετε....");
  	
  	var name = $("#productName").val();
  	var description = $("#productDescription").val();
  	var price = parseFloat($("#productPrice").val());
  	var cid = parseInt($("#selectedCategories option:selected").val());
	var params = {};
	params.name = name;
	params.description = description;
	params.price = price;
	params.cid = cid;
	var jsonRequest = JSON.stringify(params);
	console.log(jsonRequest);

	$.ajax({
		url: "/api/product/create",
		type: "POST",
		async: true,
		dataType: "json",
		data: jsonRequest,
		success: function(response) {
			console.log("Inside AJAX");
			$("#statusLabelCreateProduct").html("Εντάξει.");		
			var stringResponse = JSON.stringify(response);
			console.log(stringResponse);
			$('#alertMsg').html('<div class=\"alert alert-info\"><strong>' + response.response + '</strong></div>');
			$("#myAlertModal").modal("show");
		},	
		failure: function(errorMsg) {
			$("#statusLabelCreateProduct").html("AJAX αποτυχία.");
			$('#alertMsg').html('<div class=\"alert alert-danger\"><strong>AJAX αποτυχία.</strong></div>');
			$("#myAlertModal").modal("show");
		},
		error: function(jqXHR, testStatus, errorThrown) {
			console.log(jqXHR.status);
			// In case of error, change the execution status
			$("#statusLabelCreateProduct").html("AJAX σφάλμα.");
			$('#alertMsg').html('<div class=\"alert alert-danger\"><strong>' + jqXHR.status + ' - AJAX σφάλμα.</strong></div>');
			$("#myAlertModal").modal("show");
		}
	});

	viewProducts();
}

function viewCategories() {
	console.log("Inside viewCategories()");
	$("#statusLabelCreateCategory").html("Εκτέλεση. Παρακαλώ περιμένετε...");

	if ($.fn.dataTable.isDataTable("#categoriesTable")) {
		categoriesTable.destroy();
	}

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
			trHTML = '<thead><tr>' +
					 '<th>Id</th>' +
					 '<th>Όνομασία</th>' +
					 '<th>Περιγραφή</th>' +
					 '<th>Επεξεργασία</th>' +
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
					var description = typeof obj['description'] === "undefined" ? "" : obj['description'];
					// Create each table row
					trHTML += '<tr>' + 
							  '<td>' +  obj['id'] + '</td>' +
							  '<td>' + name + '</td>' +
							  '<td>' + description + '</td>' +
							  '<td align=\"center\">' + '<button id=\"editBttn\" type=\"button\" class=\"btn btn-default\" onclick=\"editCategory()\">' + 
							  '<span class=\"glyphicon glyphicon-edit\"></span></button>'
							  '</td>' +
							  '</tr>';
				});
				trHTML += '</tbody>';
				$('#categoriesTable').html(trHTML);
				$("#statusLabelCreateCategory").html("Εντάξει.");
			}
		},
		failure: function(errorMsg) {
			$("#statusLabelCreateCategory").html("AJAX αποτυχία.");
			$('#alertMsg').html('<div class=\"alert alert-danger\"><strong>AJAX αποτυχία.</strong></div>');
			$("#myAlertModal").modal("show");
		},
		error: function(jqXHR, testStatus, errorThrown) {
			console.log(jqXHR.status);
			// In case of error, change the execution status
			$("#statusLabelCreateCategory").html("AJAX σφάλμα.");
			$('#alertMsg').html('<div class=\"alert alert-danger\"><strong>' + jqXHR.status + ' - AJAX σφάλμα.</strong></div>');
			$("#myAlertModal").modal("show");
		}
	}).done(function() {
		categoriesTable = $('#categoriesTable').DataTable({
			"scrollY": "380px",
			"scrollCollapse": true,
			"fixedHeader": true,
			"searching": false,
			"ordering": false,
			"paging": false,
		});
	});
}

function viewProducts() {
	console.log("Inside viewCategories()");
	$("#statusLabelCreateProduct").html("Εκτέλεση. Παρακαλώ περιμένετε...");

	if ($.fn.dataTable.isDataTable("#productsTable")) {
		productsTable.destroy();
	}

	$.ajax({
		url: "/api/product/getall",
		type: "POST",
		async: true,
		dataType: "json",
		success: function(response) {
			console.log("Inside AJAX");
			var stringResponse = JSON.stringify(response);
			console.log(stringResponse);
			var innerSelectHTML = '';
			var parsedResponse = JSON.parse(stringResponse);
			trHTML = '<thead><tr>' +
					 '<th>Id</th>' +
					 '<th>Όνομασία</th>' +
					 '<th>Περιγραφή</th>' +
					 '<th>Τιμή</th>' +
					 '<th>Κατηγορία</th>' +
					 '<th>Επεξεργασία</th>' +
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
					var description = typeof obj['description'] === "undefined" ? "" : obj['description'];
					var price = typeof obj['price'] === "undefined" ? "" : obj['price'];
					var cid = typeof obj['cid'] === "undefined" ? "" : obj['cid'];
					// Create each table row
					trHTML += '<tr>' + 
							  '<td>' +  obj['id'] + '</td>' +
							  '<td>' + name + '</td>' +
							  '<td>' + description + '</td>' +
							  '<td>' + price + '</td>' +
							  '<td>' + cid + '</td>' +
							  '<td align=\"center\">' + '<button id=\"editBttn\" type=\"button\" class=\"btn btn-default\" onclick=\"editProduct()\">' + 
							  '<span class=\"glyphicon glyphicon-edit\"></span></button>'
							  '</td>' +
							  '</tr>';
				});
				trHTML += '</tbody>';
				$('#productsTable').html(trHTML);
				$("#statusLabelCreateProduct").html("Εντάξει.");
			}
		},
		failure: function(errorMsg) {
			$("#statusLabelCreateProduct").html("AJAX αποτυχία.");
			$('#alertMsg').html('<div class=\"alert alert-danger\"><strong>AJAX αποτυχία.</strong></div>');
			$("#myAlertModal").modal("show");
		},
		error: function(jqXHR, testStatus, errorThrown) {
			console.log(jqXHR.status);
			// In case of error, change the execution status
			$("#statusLabelCreateProduct").html("AJAX σφάλμα.");
			$('#alertMsg').html('<div class=\"alert alert-danger\"><strong>' + jqXHR.status + ' - AJAX σφάλμα.</strong></div>');
			$("#myAlertModal").modal("show");
		}
	}).done(function() {
		productsTable = $('#productsTable').DataTable({
			"scrollY": "380px",
			"scrollCollapse": true,
			"fixedHeader": true,
			"searching": false,
			"ordering": false,
			"paging": false,
		});
	});
}