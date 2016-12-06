$(document).on("pagebeforeshow", function() {
	setInterval(getReadyOrders, 7000);
	getReadyOrders();
});

function getReadyOrders() {
	console.log("getReadyOrder.");

	// $('#readyOrders').live("pagebeforeshow", function(e, data) {
		$.ajax({
			url: "/api/ordering/getready",
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
					trHTML += '<li>Δεν υπάρχουν έτοιμες παραγγελίες</li>';
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
						trHTML += '<li>' + 'Τραπέζι #' + obj['tableId'] + ', Παραγγελία #' + obj['id'] + '</li>';
					});
					console.log(trHTML);
					$('#readyOrders').html(trHTML);
					$('#readyOrders').listview("refresh");
					// $('#readyOrders').append('<li>' + 'Τραπέζι #' + obj['tableId'] + ', Παραγγελία #' + obj['id'] + '</li>');
					// $('#readyOrders').trigger("create");
				}
			},
			failure: function(errorMsg) {
				console.log(errorMsg);
			},
			error: function(jqXHR, testStatus, errorThrown) {
				console.log(jqXHR.status);
			}
		});
	// });
}