<?php

require_once "queries.php";

// check to see if the $_POST variable has any data
if (@isset($_POST["array"])) {
	$array =  = $mysqli->real_escape_string($_GET["array"]); // might have to do this for each item in the array
	
	if (strcmp($array["type"], "report") == 0) { // report a problem
		
	}
	/*else if () { // submit location info
		
	}*/
}

?>