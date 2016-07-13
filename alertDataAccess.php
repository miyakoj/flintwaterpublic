<?php
$servername = "173.194.225.157";
$username = "javaAccess";
$password = "app!23DEV";
    //open connection to mysql db
    $connection = mysqli_connect($servername,$username,$password,"waterdata") or die("Error " . mysqli_error($connection));


$sql = "SELECT * FROM waterdata.Notifications"; //get the notifications from waterdata database
$result = mysqli_query($connection, $sql) or die("Error in Selecting " . mysqli_error($connection)); // execute the query or die
$alertData = array(); // create an array to store as JSON
while($row =mysqli_fetch_assoc($result))
{
	$alertData[] = $row;
}
echo json_encode($alertData); // Send JSON array to alert.js
?>