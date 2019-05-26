<?php

	if (isset($_POST["barcodeValue"])) {

		$barcodeValue = $_POST["barcodeValue"];

		require_once("../function/dbconnect.php");

		$sql = "SELECT p_code, p_name FROM t_product WHERE p_code='$barcodeValue'";	
		$query = mysqli_query($conn, $sql);

		if (!$query) {

			echo json_encode("Error in query execution");
			exit;

		}

		$numrows = mysqli_num_rows($query);

		if ($numrows === 0) {

			echo json_encode("The barcode is not registered in the database");

		} else if ($numrows === 1) {

			$row = mysqli_fetch_row($query);
			echo json_encode($row);

		} else {

			echo json_encode("More than one product with the same value");
			exit;

		}

	} else {

		echo json_encode("Error on ajax query");
		
	}

?>