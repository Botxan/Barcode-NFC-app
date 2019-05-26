<?php 

	if (isset($_POST["username"])) {

		$cardUser = $_POST["username"];
		require_once("../function/dbconnect.php");
		$sql = "SELECT card_uid from t_user WHERE card_uid='$cardUser'";
		$query = mysqli_query($conn, $sql);
		
		if (!$query) {

			echo json_encode("Error querying the database");
			exit;

		}

		$numrows = mysqli_num_rows($query);

		if ($numrows == 0) {

			echo json_encode("Error: the card is not registered");

		} else if ($numrows == 1) {

			$row = mysqli_fetch_row($query);
			echo json_encode($row);

		} else {

			echo json_encode("Error: more than one user with the same card");

		}

		



	}

?>