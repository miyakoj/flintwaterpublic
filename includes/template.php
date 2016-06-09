<?php
/*-------------------------------------------------------*\
|              CONSTRUCTS THE ACTUAL WEBPAGES             |
\*-------------------------------------------------------*/

class webpageTemplate {

	var $template;
	var $html;
	var $parameters = array();

	function __construct($template) {
		$this->template = $template;
		$this->html = implode("", (file($this->template)));
	}

	function set($variable, $content) {
		if (strcmp($variable, "PAGE_TITLE") == 0)
			$content = "| " . $content;
	
		if (preg_match("/\.html$/", $content)) {
			$handle = fopen("data/" . $content, "r");
			$text = fread($handle, filesize("data/" . $content));
			fclose($handle);
		}
		else
			$text = $content;

		$this->parameters[$variable] = $text;
	}

	function create() {
		foreach ($this->parameters as $key => $value) {
			$template_name = '{' . $key . '}';
			$this->html = str_replace($template_name, $value, $this->html);
		}
		echo header("Content-type: text/html;");
		echo $this->html;
	}
}
?>