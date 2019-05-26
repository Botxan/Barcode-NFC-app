$(document).ready(function() {

	autofocus("barcodeInput");

	idRow = 0;

	enableDisableSubmitButton()



	// Autofocus product input or identification input, depending if the identification modal is opened or not
	var identificationInput = document.getElementById("identificationInput");
	$('#identificationModal').on('shown.bs.modal', function() {

			autofocus("identificationInput");

		identificationInput.addEventListener("keydown", checkUsername = function () {

			if (event.keyCode == 13) {

				identificationInputValue = identificationInput.value;

				$.ajax({
					url: "ajax/checkUsername.php",
					data: {
						username: identificationInputValue
					},
					method: "post",
					success: function(data) {

						var result = JSON.parse(data);

						if (typeof result === 'object') {

							var tableInfo = [];
							var numRows = document.getElementById("controlTable").getElementsByTagName("tr").length;
							var numColumns = document.getElementById("controlTable").getElementsByTagName("tr")[0].cells.length;
							var noDataAvailable = document.getElementById("controlTable").rows[1].cells[0].innerHTML;

							if (numRows > 1 && noDataAvailable != "No data available in table") {

								for (var row = 1; row < numRows; row++) {

									var rowInfo = [];
									var currentRow = document.getElementById("controlTable").rows[row];

									for (var column = 1; column < numColumns; column++) {

										currentColumn = currentRow.cells[column];
										rowInfo.push(currentColumn.innerHTML);
										
									}

									rowInfo.push(identificationInputValue);
									tableInfo.push(rowInfo);

								}
								
								$.ajax({
									url:"ajax/insertProducts.php",
									data: {
										tableInfo:tableInfo,
									},
									method: "post",
									success: function(data) {

										var result = JSON.parse(data);

										if (typeof result === 'object') {
											var identificationInput = document.getElementById("identificationInput");
											identificationInput.value = result[0] + " " + result[1];
											identificationInput.disabled = true;		

											$("#identificationInput").removeClass("identificationInputError");
											$("#identificationResult").removeClass("identificationResultError");

											$("#identificationInput").addClass("identificationInputSuccess");
											$("#identificationResult").addClass("identificationResultSuccess");

											$("#identificationResult").html("Operation finished succesfully");

											setTimeout(function() {

												location.reload();

											}, 3000);

										}

									}
								})

							} else {
								alert("First you must scan a product");
							}

						} else {

							$("#identificationInput").addClass("identificationInputError");
							$("#identificationResult").addClass("identificationResultError");

							$("#identificationResult").html("Error: the card is not registered");

							document.getElementById("identificationInput").value = "";

						}

					}
				});
	
			}

		});

	});

	$('#identificationModal').on('hidden.bs.modal', function() {

			autofocus("barcodeInput");
			identificationInput.removeEventListener("keydown", checkUsername);

	})

	// barcode input text
	var barcodeInput = document.getElementById("barcodeInput");	
	var stepperLeftChild = document.getElementById("stepperLeftChild");
	var slideDownParentDiv = document.getElementById("slideDownParentDiv");

	barcodeInput.addEventListener("keydown", function() {

		if (event.keyCode == 13) { // When Enter is pressed

			barcodeValue = barcodeInput.value;
			checkBarcode(barcodeValue);

		}

	});
	
} );

var autofocusTimer;
function autofocus(inputId) { // gets an input text and focus it each 0.5 second
	
	clearInterval(autofocusTimer);
	autofocusTimer = setInterval(function() {

		document.getElementById(inputId).focus();

	}, 500);

}

function checkBarcode(barcodeValue) { // check if the barcode is in the database and get the information. If the information is correct, insert the row in the table

	$.ajax({
		url: "ajax/checkBarcode.php",
		data: {
			barcodeValue: barcodeValue
		},
		method: "post",
		success: function(data) {

			var result = JSON.parse(data);

			if (typeof result === "object") {

				insertRow(result[0], result[1]);		

			} else {

				$("#unregisteredBarcodeP span").text($("#unregisteredBarcodeP span").text().replace("scanned", barcodeValue));
				$("#unregisteredBarcodeModal").modal(); // if the barcode is not registered, show the modal that tells it to the end user

			}

			barcodeInput.value = "";
		}
	});
}

function insertRow(code, name) { // Inserts the barcode value and its information in the table

	var activeButton = $(".activeButton");

	if (activeButton.length) {

		var activeButtonValue = activeButton.attr('id');
		var rowCheck = false; // This variables will change if an equal name and code is found. In that case, it will leave the foreach loop and stop the row insertion, just update the equal row

		$('#controlTable > tbody  > tr').each(function() {

			var comparingCode = $(this).find("td:eq(1)").text(); // cell of code
			var comparingName = $(this).find("td:eq(2)").text(); // cell of name
			var comparingActiveButtonValue = $(this).find("td:eq(4)").text(); // cell of name
			
			if (comparingCode === code && comparingName == name && comparingActiveButtonValue == activeButtonValue) {

				var comparingPcs = parseInt($(this).find("td:eq(3)").text()); // Get the pcs quantity and parse it to an integer
				newPcs = comparingPcs + 1; // add + 1 to the pcs quantity
				$(this).find("td:eq(3)").html(newPcs); // append the +1 to the specific row
				rowCheck = true; // detected a row with equal code and name, so leave to foreach loop
				return;

			}

		});

		if (rowCheck) return; // if it is a row with same Code and Name, dont insert a new row

		var cellValues = [idRow, code, name, 1, activeButtonValue];

		controlTable.row.add([
			'<input type="checkbox" class="rowSelector" value="' + idRow + '"></input>',
			cellValues[0],
			cellValues[1],
			cellValues[2],
			cellValues[3],
			cellValues[4]
		]).draw();

		idRow++;
		var totalTr = $("#controlTable tr").length-1;
		var noDataAvailable = $("#controlTable tr td:nth-child(1)").text();
		enableDisableSubmitButton();

	 		if (totalTr == 1 && noDataAvailable !== "No data available in table") { // Only transition if we are inserting first row

	 			positionTableIn();

	 		}

	} else {

		$('#takeOrLeave').popover('enable');
		$('#takeOrLeave').popover('show');

		setTimeout(function() {

			$('#takeOrLeave').popover('hide');
			$('#takeOrLeave').popover('disable');

		}, 3000);
		
	}

}

function deleteRows() { // Deletes a row. If the row has more than one pcs, just delete 1 pc

	var noDelete = false;
	selectedRows = [];

	$.each($("input[class='rowSelector']:checked"), function() {     

        selectedRows.push($(this).closest("tr"));

    });

    if (selectedRows.length > 0) {

    	if (confirm('Delete these ' + selectedRows.length + " rows?")) {

			$.each(selectedRows, function() {

    			var thisPcsCell = $(this[0].cells[3]);
    			var thisPcsValue = thisPcsCell.text();

    			if ( thisPcsValue > 1 ) {

    				var parsedThisPcsValue = parseInt(thisPcsValue) - 1;
        			$(this[0].cells[3]).html(thisPcsValue - 1);


    			} else {

    				controlTable.row(this).remove().draw( false );

    			}

   	 		});

   	 		$("#controlTable input[type='checkbox']").prop("checked", false);
   	 		var totalTr = $("#controlTable tr").length-1;
   	 		var noDataAvailable = $("#controlTable tr td:nth-child(1)").text();
   	 		enableDisableSubmitButton();

   	 		if (totalTr == 1 && noDataAvailable == "No data available in table") {

   	 			positionTableOut();

   	 		}

		}

	}

}

function selectButton(id) { // Clicking 1 button, hold it and disable the other one

	$(".takeOrLeave").each(function (){
		$(this).removeClass("activeButton").addClass("disabledButton");
	});

	$('#' + id).removeClass("disabledButton").addClass("activeButton");

}

function positionTableIn() { // Change the stepper from right side to left side and show the table
	
	slideDownParentDiv.classList.remove("hideStepperInverse");
	slideDownParentDiv.classList.add("hideStepper");

	slideDownParentDiv.addEventListener("animationend", stepperLeftChildAnimationStart);

	function stepperLeftChildAnimationStart() {

		stepperLeftChild.classList.remove("showStepperInverse");
		stepperLeftChild.classList.add("showStepper");
		slideDownParentDiv.removeEventListener("animationend", stepperLeftChildAnimationStart);

	}							

}

function positionTableOut() { // Return divs to the starting position

	stepperLeftChild.classList.remove("showStepper");
	stepperLeftChild.classList.add("showStepperInverse");

	stepperLeftChild.addEventListener("animationend", slideDownParentDivAnimationStart);

	function slideDownParentDivAnimationStart() {
		
		slideDownParentDiv.classList.remove("hideStepper");
		slideDownParentDiv.classList.add("hideStepperInverse");
		stepperLeftChild.removeEventListener("animationend", slideDownParentDivAnimationStart);

	}

}

function enableDisableSubmitButton() { // Will disable the button if there are no products in the table, and will enable it if there is any product in the table
	
	var totalTr = $("#controlTable tr").length-1;
 		var noDataAvailable = $("#controlTable tr td:nth-child(1)").text();
 		var submitButton = document.getElementById("submit");

 		if (totalTr == 1 && noDataAvailable == "No data available in table") {

		submitButton.disabled = true;

 		} else {

 			submitButton.disabled = false;

 		}

}