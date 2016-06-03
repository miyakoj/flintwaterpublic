<?php

require_once "includes/template.class";
require_once "includes/queries.php";

$page = new webpageTemplate("includes/template.inc");
$page->set("MAP_POPULATION", "<script>test</script>");
$page->create();