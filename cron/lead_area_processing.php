<?php

/*
 * This script divides Flint into areas and counts the number of dangerous tests per area.
 * Original code created in Java by Patrick Bodell (https://github.com/PatB93).
 */
 
@define("__ROOT__", dirname(dirname(__FILE__)));

require_once __ROOT__ . "/includes/queries.php";

/* A single test location. */
class Location {
	private $lat;
	private $lng;
	private $leadval;
	
	public function __construct($lat, $lng, $leadval) {
		$this->lat = $lat;
		$this->lng = $lng;
		$this->lead = $leadval;
	}
	
	public function setLat() {$this->lat = $lat;}
	public function setLng() {$this->lng = $lng;}
	public function setLead() {$this->lead = $leadval;}
	
	public function getLat() {return $this->lat;}
	public function getLng() {return $this->lng;}
	public function getLead() {return $this->lead;}
}

/* Stores areas of water tests results. */
class TestsList {
	private $location = NULL;
	private $next = NULL;
	private $countDanger = 0;
	private $listCount = 0;
	private $minLatitude = 1000000; 
	private $minLongitude = 1000000;
	private $maxLatitude = -1000000;
	private $maxLongitude = -1000000;
	
	/* Multiple constructor code from: http://php.net/manual/en/language.oop5.decon.php#99903 */
	public function __construct() {		
		$a = func_get_args();
        $i = func_num_args();
		
        if (method_exists($this, $f='__construct'.$i))
            call_user_func_array(array($this, $f), $a);
	}
	
	public function __construct1($location) {		
		$this->location = $location; //stores a location object
		$this->next = NULL;	//points to the next node
	}
	
	/* 
	 * This creates an indexed list where the count value becomes
	 * the index, but the count at the root node is still the size of the list.
	 */
	public function __construct2($location, $countIn) {
		$this->location = $location; //set the location object
		/*
		* For the root element this is a count is the size
		* of the list, for every other node, this is the 
		* index.
		*/
		$this->listCount = $countIn;
		$this->next = NULL;
	}
	
	/*
	 * This will add a location to the list
	 *  - Counts the number of dangerous lead levels
	 *  - Sets max and min of the list within certain boundaries
	 */
	public function insertOne($location) {
		$temp = $this;
		
		while ($temp->next != NULL)
			$temp = $temp->next;
		
		$temp->next = new testsList($location);
		
		/*
		 * This is where you will set the bounds for where you want the points located
		 * 
		 * Set minimum and maximum latitude and longitude for the view
		 */
		if (($location->getLat() < $this->minLatitude) && ($location->getLat() > 42.9811436))
			$this->minLatitude = $location->getLat();
		
		if (($location->getLng() < $this->minLongitude) && ($location->getLng() > -83.7412662))
			$this->minLongitude = $location->getLng();
		
		if (($location->getLat() > $this->maxLatitude) && ($location->getLat() < 43.0765585))
			$this->maxLatitude = $location->getLat();
		
		if (($location->getLng() > $this->maxLongitude) && ($location->getLng() <  -83.6349159))
			$this->maxLongitude = $location->getLng();
		
		if ($location->getLead() > 15)
			$this->countDanger++;
		
		$this->listCount++;
	}
	
	/* 
	 * This creates an indexed list.
	 */
	public function insertTwo($location, $countIn) {
		$temp = $this; //Point to our current list and use temp to view/edit it
		
		while ($temp->next != NULL) //walk to the end of the list
			$temp = $temp->next; //Shuffles through nodes
			
		$temp->next = new testsList($location, $countIn); //add a location to the end of the list
		
		//set the lower bound for latitude in visualization
		if (($location->getLat() < $this->minLatitude) && ($location->getLat() > 42.9811436))
			$this->minLatitude = $location->getLat();
		
		//set the lower bound for longitude in visualization
		if (($location->getLng() < $this->minLongitude) && ($location->getLng() > -83.7412662))
			$this->minLongitude = $location->getLng();
		
		//set the upper bound for latitude in the visualization
		if (($location->getLat() > $this->maxLatitude) && ($location->getLat() < 43.0765585))
			$this->maxLatitude = $location->getLat();
		
		//set the upper bound for longitude in the visualization
		if (($location->getLng() > $this->maxLongitude) && ($location->getLng() < -83.6349159))
			$this->maxLongitude = $location->getLng();
		
		//count dangerous lead levels
		if ($location->getLead() > 15)
			$this->countDanger++;
		
		//count the dangerous levels in this area
		$this->listCount++;
	}
	
	/*
	 * Creates a list with every location that has been tested 
	 * that exists within the given latitude bounds.
	 */
	public function parseLat($latMin, $latMax) {
		$list = new testsList();
		$temp = $this->next;
		
		while ($temp != null && $temp->location->getLat() < $latMin) {
			$temp = $temp->next;
		}
		
		while ($temp != null && $temp->location->getLat() <= $latMax) {
			$list->insertOne($temp->location);
			$temp = $temp->next;
		}
		//SORT!
		$list = $this->mergeSort($list);
		
		return $list;
	}
	
	/*
	 * Breaks the list into size one lists, then slowly merges 
	 * them back together sorting them as it goes.
	 */
	private function mergeSort($list) {
		$size = $list->listCount;
		$list = $list->next;
		$count = 0;
		$tmpLeft = new testsList();
		$tmpRight = new testsList();
		
		while ($list != null && $count < $size/2) {
			$tmpLeft->insertOne($list->location);
			$list = $list->next;
			$count += 1;
		}
		
		if ($tmpLeft->listCount > 1) {
			$tmpLeft = $this->mergeSort($tmpLeft);
		}
		
		while ($list != null && $count < $size) {
			$tmpRight->insertOne($list->location);
			$list = $list->next;
			$count += 1;
		}
		
		if ($tmpRight->listCount > 1) {
			$tmpRight = $this->mergeSort($tmpRight);
		}
		
		$list = $this->mySort($tmpLeft, $tmpRight);
		//split the list into left and right
		return $list;
	}
	
	/* Creates a list that represents a blocked off area of Flint.*/
	public function parseLng($lngMin, $lngMax) {
		$list = $this->next;
		$tmp = new testsList();
		
		while ($list != null && $list->location->getLng() < $lngMin) {
			$list = $list->next;
		}
		
		while ($list != null && $list->location->getLng() <= $lngMax) {
			$tmp->insertOne($list->location);
			$list = $list->next;
		}
		
		return $tmp;
	}
	
	/*
	 * One by one takes the smallest value from each list and
	 * inserts it into  the new merged list, then returns the list.
	 */
	private function mySort($left, $right) {
		$list = new testsList();
		
		//sort the mini lists
		$left = $left->next;
		$right = $right->next;
		
		while ($left != null || $right != null) {
			if ($left != null && $right != null) {
				if ($left->location->getLng() <= $right->location->getLng()) {
					$list->insertOne($left->location);
					$left = $left->next;
				}
				else if ($right->location->getLng() < $left->location->getLng()) {
					$list->insertOne($right->location);
					$right = $right->next;
				}
			}
			
			if ($left != null && $right == null) {
				$list->insertOne($left->location);
				$left = $left->next;
			}
			
			if ($right != null && $left == null) {
				$list->insertOne($right->location);
				$right = $right->next;
			}
		}
		
		$tmp = $list->next;
		
		return $list;
	}
	
	public function getLatMin() {return $this->minLatitude;}
	public function getLatMax() {return $this->maxLatitude;}
	public function getLngMin() {return $this->minLongitude;}
	public function getLngMax() {return $this->maxLongitude;}
	
	public function getNext() {return $this->next;} //Return next node
	public function getLocation() {return $this->location;} //Return Location object
	public function getDanger() {return $this->countDanger;} //Return dangerous lead count
	public function setCount($countIn) {$listCount = $countIn;} //set list size
	public function getCount() {return $this->listCount;} // return list size
}


/* Update lead area data. */
lead_area_processing();


/* 
	Calculate the lead area info. 
*/
function lead_area_processing() {
	global $mysqli;
	
	$grid = new TestsList();
	$zoomOut = new TestsList();
	
	/* Retrieve the most recent test result for each location. */
	$result = queries("leadArea");
	
	while ($row = $result->fetch_assoc()) {
		$location = new Location($row["latitude"], $row["longitude"], $row["leadLevel"]);		
		$grid->insertOne($location);
	}
	
	$mysqli->close();
	
	$area = new TestsList();
	$row = new TestsList();
	
	$latMin = $grid->getLatMin();
	$latMax = $grid->getLatMax();
	$lngMin = $grid->getLngMin();
	$lngMax = $grid->getLngMax();
	
	$latDistance = ($latMax - $latMin) / 13; //divide by number of vertical blocks
	$lngDistance = ($lngMax - $lngMin) / 13; //divide by number of horizontal blocks
	
	//walk through the data by row
	while ($latMin < $latMax) {
	   //now walk through data by column
	   while ($lngMin < $lngMax) {
		   $row = $grid->parseLat($latMin, $latMin + $latDistance);//split off a row
		   $area = $row->parseLng($lngMin, $lngMin + $lngDistance); //split off by column
		   
		   if ($area->getCount() != 0) { // if there were tests in this block, then add it to the list
			   $location = new Location($latMin + $latDistance, $lngMin + $lngDistance, $area->getDanger());
			   $zoomOut->insertTwo($location, $area->getCount());
		   }
		   
		   $lngMin += $lngDistance;
	   }
	   
	   $lngMin = $grid->getLngMin(); //reset the longitude for the next row of latitudes
	   $latMin += $latDistance;
	}
   
	$filename = "leadLevels_birdview.json";
	$tmp = $zoomOut->getNext();
	$output = "";
	
	/* Output JSON to the bucket. */
	$output = "{ \"area\": [\n";
	
	while ($tmp != NULL) {
		$output .= "\t{\n";
		
		$output .= "\t\t\"latitude\": " . $tmp->getLocation()->getLat() . ",\n";
		$output .= "\t\t\"longitude\": " . $tmp->getLocation()->getLng() . ",\n";
		$output .= "\t\t\"numOfDangerous\": " . $tmp->getLocation()->getLead() . ",\n";
		$output .= "\t\t\"numOfTests\": " . $tmp->getCount();
		
		$output .= "\n\t}";
		
		$tmp = $tmp->getNext();
		
		if ($tmp != NULL)
			$output .= ",\n";
	}
	
	$output .= "\n]\n}";
	
	$options = ['gs' => ['Content-Type' => 'application/json', 'read_cache_expiry_seconds' => '86400']];
	$context = stream_context_create($options);
	file_put_contents("gs://h2o-flint.appspot.com/".$filename, $output, 0, $context);
	//file_put_contents($filename, $output);
}

?>