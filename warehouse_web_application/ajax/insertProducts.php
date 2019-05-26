<?php

	if (isset($_POST["tableInfo"])) {

		$tableInfo = $_POST["tableInfo"];
		require_once("../function/dbconnect.php");

		for ($row = 0; $row < sizeof($tableInfo); $row++) {

			$code = $tableInfo[$row][0];
			$name = $tableInfo[$row][1];
			$pcs = $tableInfo[$row][2];
			$action = $tableInfo[$row][3];
			$cardUid = $tableInfo[$row][4];

			for ($repeatedRow = 0; $repeatedRow < $pcs; $repeatedRow++) {

				$sql = "INSERT INTO t_product_control(p_code, p_name, p_action, user_card_uid) VALUES ('$code', '$name', '$action', '$cardUid')";
				$query = mysqli_query($conn, $sql);

			}			
			
		}

		if ($query) {
			
			$sql = "SELECT u_first_name, u_last_name FROM t_user WHERE card_uid='$cardUid'";
			$query = mysqli_query($conn, $sql);

			if ($query) {

				$row = mysqli_fetch_row($query);
				echo json_encode($row);

			}

		} 

	} else {

		echo json_encode("Error on ajax query");

	}

?>