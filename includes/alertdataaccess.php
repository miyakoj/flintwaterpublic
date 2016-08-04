<?php

$servername = "173.194.104.185";
$username = "javaAccess";
$password = "app!23DEV";
// Create connection
$conn = new mysqli($servername, $username, $password);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
//echo "Connected successfully";
$sql = "SELECT * FROM waterdata.Notifications ORDER BY noteDate DESC;";
if (mysqli_query($conn, $sql)) {
    echo "queryFinished";
} else {
    echo "Error creating database: " . mysqli_error($conn);
}
$result = $conn->query($sql);
$rows = array();
if ($result->num_rows > 0) {
    // output data of each row
    while($r = $result->fetch_assoc()) {
        $rows[] = $r;
	}
}
//$alerts = json_encode($rows);
json_output($rows, "alerts", "alerts.json");


/* Remove duplicate provider addresses from the array.
From: https://php.net/manual/en/function.array-unique.php#116302 */
function unique_multidim_array($array, $key) {
    $temp_array = array();
    $i = 0;
    $key_array = array();
   
    foreach($array as $val) {
        if (!in_array($val[$key], $key_array)) {
            $key_array[$i] = $val[$key];
            $temp_array[$i] = $val;
        }
        $i++;
    }
    return $temp_array;
}

/* Output JSON for data that has been processed after it was retrieved from the database. */
function json_output($array, $array_name, $filename) {
	$output = "{ \"" . $array_name . "\": [\n";
	
	for ($i=0; $i<count($array); $i++) {		
		$output .= json_encode($array[$i], JSON_NUMERIC_CHECK | JSON_PRETTY_PRINT);
		
		if ($i < count($array)-1)
			$output .= ",";
		
		$output .= "\n";
	}
	
	$output .= "]}";
	
	//print_r($output);
	
	write_file($output, $filename);
}

/* Output JSON for data that was retrieved directly from the database. */
function query_json_output($result, $array_name, $filename) {
	$output = "{ \"" . $array_name . "\": [\n";

	for ($i=0; $i<$result->num_rows; $i++) {
		$row = $result->fetch_assoc();
		$output .= json_encode($row, JSON_NUMERIC_CHECK | JSON_PRETTY_PRINT);
		
		if ($i < $result->num_rows-1)
			$output .= ",";
			
		$output .= "\n";
	}

	$output .= "]}";

	write_file($output, $filename);
}

/* Save the JSON file to the bucket in Google Cloud. */
function write_file($output, $filename) {
	$fp = fopen("gs://h2o-flint.appspot.com/".$filename, 'w');
	fwrite($fp, $output);
	fclose($fp);
}
?> 