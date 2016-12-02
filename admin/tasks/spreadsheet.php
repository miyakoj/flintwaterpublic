<?php

if (strstr($_SERVER["PHP_SELF"], "/admin/") !== FALSE)
	@define("__ROOT__", dirname(dirname(dirname(__FILE__))));
else
	@define("__ROOT__", dirname(dirname(__FILE__)));

require_once __ROOT__ . "/vendor/autoload.php";

use google\appengine\api\mail\Message;

libxml_disable_entity_loader(false);

PHPExcel_Settings::setCacheStorageMethod(PHPExcel_CachedObjectStorageFactory::cache_in_memory);
PHPExcel_Settings::setZipClass(PHPExcel_Settings::ZIPARCHIVE);
PHPExcel_Cell::setValueBinder(new PHPExcel_Cell_AdvancedValueBinder());
$objPHPExcel = new PHPExcel();	
$objPHPExcel->setActiveSheetIndex(0);

if (strcmp($_POST["report_type"], "water_tests") === 0) {
	$objPHPExcel->getActiveSheet()->getColumnDimension("A")->setAutoSize(true);
	$objPHPExcel->getActiveSheet()->setCellValue("A1", "Address");
	$objPHPExcel->getActiveSheet()->getColumnDimension("B")->setAutoSize(true);
	$objPHPExcel->getActiveSheet()->setCellValue("B1", "Lead Level (ppb)");
	$objPHPExcel->getActiveSheet()->getColumnDimension("C")->setAutoSize(true);
	$objPHPExcel->getActiveSheet()->setCellValue("C1", "Copper Level (ppb)");
	$objPHPExcel->getActiveSheet()->getColumnDimension("D")->setAutoSize(true);
	$objPHPExcel->getActiveSheet()->setCellValue("D1", "Date Submtted");
}

$memcache = new Memcache;
$spreadsheet_array = $memcache->get($_POST["uid"]);
$i = 0;

// return an error if the spreadsheet_array has more than 20,000 rows

foreach ($spreadsheet_array as $row) {
	// add the data to a spreadsheet that may be downloaded by the user
	if (strcmp($_POST["report_type"], "water_tests") === 0) {
		$objPHPExcel->getActiveSheet()->setCellValue("A".($i+2), $row["address"]);
		$objPHPExcel->getActiveSheet()->setCellValue("B".($i+2), $row["leadLevel"]);
		$objPHPExcel->getActiveSheet()->setCellValue("C".($i+2), $row["copperLevel"]);
		$objPHPExcel->getActiveSheet()->setCellValue("D".($i+2), $row["dateUpdated"]);
	}
	
	$i++;
}

$objPHPExcel->getActiveSheet()->getStyle("B2:C"+sizeof($spreadsheet_array))->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_LEFT);
$outputFile = $_POST["report_type"] . mt_rand(0,5999) . ".xlsx";
//$outputFile = "water_tests" . mt_rand(0,5999) . ".xlsx";

$dir = sys_get_temp_dir();
$tmp = tempnam($dir, $outputFile);

$writer = new PHPExcel_Writer_Excel2007($objPHPExcel);
$writer->save($tmp);

/* Email the spreadsheet to the user. */
/*try {
	$message = new Message();
	$message->setSender("umflintH2O@gmail.com");
	//$message->addTo($_POST["email"]);
	$message->addTo("mystc.raine@gmail.com");
	$message->setSubject("MyWater-Flint Report Spreadsheet");
	$message->addAttachment($outputFile, file_get_contents($tmp));
	$message->setHtmlBody("testing");
	$message->send();
} catch (InvalidArgumentException $e) {
	echo $e;
}*/

$objPHPExcel->disconnectWorksheets();
unset($objPHPExcel);
?>