<?

lang_to_csv();
//csv_to_lang();

/* Transforms a JSON into a CSV to be imported into a spreadsheet. */
function lang_to_csv() {
	$json = file_get_contents("../langs/en-US.json");
	$array = json_decode($json, true, 3);
	$csv = "Section|Key|English|Spanish\n";

	foreach ($array as $key1 => $val1) {
		echo $key1 . "<br/ >";
		
		foreach ($val1 as $key2 => $val2) {
			$csv .= $key1 . "|" . $key2 . "|" . $val2 . "|\n";
			echo "&nbsp;&nbsp;&nbsp;&nbsp;" . $key2 . ": " . $val2 . "<br />";
		}
			
		echo "<br />";		
	}

	file_put_contents("en-US.csv", $csv);
}

/* Transforms a CSV into a Spanish language JSON file. */
//function csv_to_lang() {}
?>