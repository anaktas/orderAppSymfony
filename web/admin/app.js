$(document).ready(function() {
	var categoriesTable;
	var productsTable;
	var quantitiesTable;
	var rolesTable;
	var usersTable;
});

function logOut() {
	console.log("logout.");
	$('#loginForm').removeClass('hidden');
	$('#adminPanel').addClass('hidden');
}

function doLogin() {
	console.log("login.");
	$('#adminPanel').removeClass('hidden');
	$('#loginForm').addClass('hidden');
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

function createQuantity() {
	console.log("Inside createQuantity()");
	$("#statusCreateQuantity").html("Εκτέλεση. Παρακαλώ περιμένετε...");
			
	var pid = parseInt($("#selectedProduct option:selected").val());
	var quantity = $("#quantity").val();
		
	var params = {};
	params.pid = pid;
	params.quantity = quantity;
	var jsonRequest = JSON.stringify(params);
	console.log(jsonRequest);

	$.ajax({
		url: "/api/store/create",
		type: "POST",
		async: true,
		dataType: "json",
		data: jsonRequest,
		success: function(response) {
			console.log("Inside AJAX");
			$("#statusCreateQuantity").html("Εντάξει.");
			var stringResponse = JSON.stringify(response);
			console.log(stringResponse);
			$('#alertMsg').html('<div class=\"alert alert-info\"><strong>' + response.response + '</strong></div>');
			$("#myAlertModal").modal("show");
		},
		failure: function(errorMsg) {
			$("#statusCreateQuantity").html("AJAX αποτυχία.");
			$('#alertMsg').html('<div class=\"alert alert-danger\"><strong>AJAX αποτυχία.</strong></div>');
			$("#myAlertModal").modal("show");
		},
		error: function(jqXHR, testStatus, errorThrown) {
			console.log(jqXHR.status);
			// In case of error, change the execution status
			$("#statusCreateQuantity").html("AJAX σφάλμα.");
			$('#alertMsg').html('<div class=\"alert alert-danger\"><strong>' + jqXHR.status + ' - AJAX σφάλμα.</strong></div>');
			$("#myAlertModal").modal("show");
		}
	});

	viewQuantities();
}

function viewQuantities() {
	console.log("Inside viewQuantities()");
	$("#statusCreateQuantity").html("Εκτέλεση. Παρακαλώ περιμένετε...");

	if ($.fn.dataTable.isDataTable("#quantitiesTable")) {
		quantitiesTable.destroy();
	}

	$.ajax({
		url: "/api/store/getall",
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
					 '<th>Προϊόν</th>' +
					 '<th>Ποσότητα</th>' +
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
					var pid = typeof obj['pid'] === "undefined" ? "" : obj['pid'];
					var quantity = typeof obj['quantity'] === "undefined" ? "" : obj['quantity'];
					// Create each table row
					trHTML += '<tr>' + 
							  '<td>' +  obj['id'] + '</td>' +
							  '<td>' + pid + '</td>' +
							  '<td>' + quantity + '</td>' +
							  '<td align=\"center\">' + '<button id=\"editBttn\" type=\"button\" class=\"btn btn-default\" onclick=\"editProduct()\">' + 
							  '<span class=\"glyphicon glyphicon-edit\"></span></button>'
							  '</td>' +
							  '</tr>';
				});
				trHTML += '</tbody>';
				$('#quantitiesTable').html(trHTML);
				$("#statusCreateQuantity").html("Εντάξει.");
			}
		},
		failure: function(errorMsg) {
			$("#statusCreateQuantity").html("AJAX αποτυχία.");
			$('#alertMsg').html('<div class=\"alert alert-danger\"><strong>AJAX αποτυχία.</strong></div>');
			$("#myAlertModal").modal("show");
		},
		error: function(jqXHR, testStatus, errorThrown) {
			console.log(jqXHR.status);
			// In case of error, change the execution status
			$("#statusCreateQuantity").html("AJAX σφάλμα.");
			$('#alertMsg').html('<div class=\"alert alert-danger\"><strong>' + jqXHR.status + ' - AJAX σφάλμα.</strong></div>');
			$("#myAlertModal").modal("show");
		}
	}).done(function() {
		quantitiesTable = $('#quantitiesTable').DataTable({
			"scrollY": "380px",
			"scrollCollapse": true,
			"fixedHeader": true,
			"searching": false,
			"ordering": false,
			"paging": false,
		});
	});
}

function refreshProducts() {
	console.log("Inside refreshProducts()");
	$("#statusCreateQuantity").html("Εκτέλεση. Παρακαλώ περιμένετε...");

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
			$('#selectedProduct').after().html(innerSelectHTML);
			$("#statusCreateQuantity").html("Εντάξει.");
		},
		failure: function(errorMsg) {
			$("#statusCreateQuantity").html("AJAX αποτυχία.");
			$('#alertMsg').html('<div class=\"alert alert-danger\"><strong>AJAX αποτυχία.</strong></div>');
			$("#myAlertModal").modal("show");
		},
		error: function(jqXHR, testStatus, errorThrown) {
			console.log(jqXHR.status);
			// In case of error, change the execution status
			$("#statusCreateQuantity").html("AJAX σφάλμα.");
			$('#alertMsg').html('<div class=\"alert alert-danger\"><strong>' + jqXHR.status + ' - AJAX σφάλμα.</strong></div>');
			$("#myAlertModal").modal("show");
		}
	});
}

function createRole() {
	console.log("Inside createRole()");
  	$("#statusCreateRole").html("Εκτέλεση. Παρακαλώ περιμένετε....");
  	
  	var rolename = $("#roleName").val();
  	var description = $("#roleDescription").val();
	var params = {};
	params.rolename = rolename;
	params.description = description;
	
	var jsonRequest = JSON.stringify(params);
	console.log(jsonRequest);

	$.ajax({
		url: "/api/role/create",
		type: "POST",
		async: true,
		dataType: "json",
		data: jsonRequest,
		success: function(response) {
			console.log("Inside AJAX");
			$("#statusCreateRole").html("Εντάξει.");		
			var stringResponse = JSON.stringify(response);
			console.log(stringResponse);
			$('#alertMsg').html('<div class=\"alert alert-info\"><strong>' + response.response + '</strong></div>');
			$("#myAlertModal").modal("show");
		},	
		failure: function(errorMsg) {
			$("#statusCreateRole").html("AJAX αποτυχία.");
			$('#alertMsg').html('<div class=\"alert alert-danger\"><strong>AJAX αποτυχία.</strong></div>');
			$("#myAlertModal").modal("show");
		},
		error: function(jqXHR, testStatus, errorThrown) {
			console.log(jqXHR.status);
			// In case of error, change the execution status
			$("#statusCreateRole").html("AJAX σφάλμα.");
			$('#alertMsg').html('<div class=\"alert alert-danger\"><strong>' + jqXHR.status + ' - AJAX σφάλμα.</strong></div>');
			$("#myAlertModal").modal("show");
		}
	});

	viewRoles();
}

function viewRoles() {
	console.log("Inside viewCategories()");
	$("#statusCreateRole").html("Εκτέλεση. Παρακαλώ περιμένετε...");

	if ($.fn.dataTable.isDataTable("#rolesTable")) {
		rolesTable.destroy();
	}

	$.ajax({
		url: "/api/role/getall",
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
					var rolename = typeof obj['rolename'] === "undefined" ? "" : obj['rolename'];
					var description = typeof obj['description'] === "undefined" ? "" : obj['description'];
					// Create each table row
					trHTML += '<tr>' + 
							  '<td>' +  obj['id'] + '</td>' +
							  '<td>' + rolename + '</td>' +
							  '<td>' + description + '</td>' +
							  '<td align=\"center\">' + '<button id=\"editBttn\" type=\"button\" class=\"btn btn-default\" onclick=\"editProduct()\">' + 
							  '<span class=\"glyphicon glyphicon-edit\"></span></button>'
							  '</td>' +
							  '</tr>';
				});
				trHTML += '</tbody>';
				$('#rolesTable').html(trHTML);
				$("#statusCreateRole").html("Εντάξει.");
			}
		},
		failure: function(errorMsg) {
			$("#statusCreateRole").html("AJAX αποτυχία.");
			$('#alertMsg').html('<div class=\"alert alert-danger\"><strong>AJAX αποτυχία.</strong></div>');
			$("#myAlertModal").modal("show");
		},
		error: function(jqXHR, testStatus, errorThrown) {
			console.log(jqXHR.status);
			// In case of error, change the execution status
			$("#statusCreateRole").html("AJAX σφάλμα.");
			$('#alertMsg').html('<div class=\"alert alert-danger\"><strong>' + jqXHR.status + ' - AJAX σφάλμα.</strong></div>');
			$("#myAlertModal").modal("show");
		}
	}).done(function() {
		rolesTable = $('#rolesTable').DataTable({
			"scrollY": "380px",
			"scrollCollapse": true,
			"fixedHeader": true,
			"searching": false,
			"ordering": false,
			"paging": false,
		});
	});
}

function createUser() {
	console.log("Inside createUser()");
  	$("#statusCreateUser").html("Εκτέλεση. Παρακαλώ περιμένετε....");
  	
  	var username = $("#username").val();
  	var password = $("#username").val();
  	var roleId = parseInt($("#selectedRole option:selected").val());
	var params = {};
	params.username = username;
	params.password = password;
	params.roleId = roleId;
	var jsonRequest = JSON.stringify(params);
	console.log(jsonRequest);

	$.ajax({
		url: "/api/user/create",
		type: "POST",
		async: true,
		dataType: "json",
		data: jsonRequest,
		success: function(response) {
			console.log("Inside AJAX");
			$("#statusCreateUser").html("Εντάξει.");		
			var stringResponse = JSON.stringify(response);
			console.log(stringResponse);
			$('#alertMsg').html('<div class=\"alert alert-info\"><strong>' + response.response + '</strong></div>');
			$("#myAlertModal").modal("show");
		},	
		failure: function(errorMsg) {
			$("#statusCreateUser").html("AJAX αποτυχία.");
			$('#alertMsg').html('<div class=\"alert alert-danger\"><strong>AJAX αποτυχία.</strong></div>');
			$("#myAlertModal").modal("show");
		},
		error: function(jqXHR, testStatus, errorThrown) {
			console.log(jqXHR.status);
			// In case of error, change the execution status
			$("#statusCreateUser").html("AJAX σφάλμα.");
			$('#alertMsg').html('<div class=\"alert alert-danger\"><strong>' + jqXHR.status + ' - AJAX σφάλμα.</strong></div>');
			$("#myAlertModal").modal("show");
		}
	});

	viewUsers();
}

function viewUsers() {
	console.log("Inside viewUsers()");
	$("#statusCreateUser").html("Εκτέλεση. Παρακαλώ περιμένετε...");

	if ($.fn.dataTable.isDataTable("#usersTable")) {
		usersTable.destroy();
	}

	$.ajax({
		url: "/api/user/getall",
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
					 '<th>Όνομα Χρήστη</th>' +
					 '<th>Ρόλος</th>' +
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
					var username = typeof obj['username'] === "undefined" ? "" : obj['username'];
					var roleId = typeof obj['roleId'] === "undefined" ? "" : obj['roleId'];
					// Create each table row
					trHTML += '<tr>' + 
							  '<td>' +  obj['id'] + '</td>' +
							  '<td>' + username + '</td>' +
							  '<td>' + roleId + '</td>' +
							  '<td align=\"center\">' + '<button id=\"editBttn\" type=\"button\" class=\"btn btn-default\" onclick=\"editProduct()\">' + 
							  '<span class=\"glyphicon glyphicon-edit\"></span></button>'
							  '</td>' +
							  '</tr>';
				});
				trHTML += '</tbody>';
				$('#usersTable').html(trHTML);
				$("#statusCreateUser").html("Εντάξει.");
			}
		},
		failure: function(errorMsg) {
			$("#statusCreateUser").html("AJAX αποτυχία.");
			$('#alertMsg').html('<div class=\"alert alert-danger\"><strong>AJAX αποτυχία.</strong></div>');
			$("#myAlertModal").modal("show");
		},
		error: function(jqXHR, testStatus, errorThrown) {
			console.log(jqXHR.status);
			// In case of error, change the execution status
			$("#statusCreateUser").html("AJAX σφάλμα.");
			$('#alertMsg').html('<div class=\"alert alert-danger\"><strong>' + jqXHR.status + ' - AJAX σφάλμα.</strong></div>');
			$("#myAlertModal").modal("show");
		}
	}).done(function() {
		usersTable = $('#usersTable').DataTable({
			"scrollY": "380px",
			"scrollCollapse": true,
			"fixedHeader": true,
			"searching": false,
			"ordering": false,
			"paging": false,
		});
	});
}

function refreshRoles() {
	console.log("Inside refreshRoles()");
	$("#statusCreateUser").html("Εκτέλεση. Παρακαλώ περιμένετε...");

	$.ajax({
		url: "/api/role/getall",
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
				innerSelectHTML += '<option value=\"' + obj['id'] + '\">' + obj['rolename'] + '</option>';
			});
			console.log(innerSelectHTML);
			$('#selectedRole').after().html(innerSelectHTML);
			$("#statusCreateUser").html("Εντάξει.");
		},
		failure: function(errorMsg) {
			$("#statusCreateUser").html("AJAX αποτυχία.");
			$('#alertMsg').html('<div class=\"alert alert-danger\"><strong>AJAX αποτυχία.</strong></div>');
			$("#myAlertModal").modal("show");
		},
		error: function(jqXHR, testStatus, errorThrown) {
			console.log(jqXHR.status);
			// In case of error, change the execution status
			$("#statusCreateUser").html("AJAX σφάλμα.");
			$('#alertMsg').html('<div class=\"alert alert-danger\"><strong>' + jqXHR.status + ' - AJAX σφάλμα.</strong></div>');
			$("#myAlertModal").modal("show");
		}
	});
}