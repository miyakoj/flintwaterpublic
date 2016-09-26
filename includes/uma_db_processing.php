<?php
	$port = "27017";
	$db = getenv('MONGODB_DATABASE');
	$connection = new MongoClient("mongodb://" . getenv('MONGODB_USER') . ":" . getenv('MONGODB_PASSWORD') . "@" . getenv('MONGODB_IP') . ":" . $port . "/" .  $db);
	
	$predictions = $connection->$db->prediction;
	//$residential_data = $connection->$db->proc_geo_resi;
	
	$query = array('limit' => '10'); //'' => '', 
	$cursor = $predictions->find();
	
	while ($cursor->hasNext()) {
		var_dump($cursor->getNext());
	}
?>