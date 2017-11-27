# MyWater-Flint Source Code #

## Description ##
This source gives you a starting point to create user and administration websites to aid in navigating a water crisis such as the one Flint, MI is experiencing. Though the original runs on the Google Cloud Platform and utilizes Google Fusion Tables and Firebase Authentication, the source can also be run on any web server running PHP and MySQL with some modifications.

## Requirements ##
* [PHP 5.5 or higher](http://www.php.net/)
* [MySQL 5.6 or higher](http://dev.mysql.com/)
* [Google API Client Library for PHP](https://github.com/google/google-api-php-client/) (if using Google Fusion Tables for website data)
* [Firebase Authentication](https://firebase.google.com/) (if the admin login is used "out of the box")
* [PHP-JWT](https://github.com/firebase/php-jwt/) (to verify Firebase Authentication login tokens)
* [Composer](https://getcomposer.org/) (used to manage the Google API Client Library, PHP-JWT, and all dependencies)
* A database of water quality data. MyWater-Flint uses a MongoDB database provided by the University of Michigan-Ann Arbor Michigan Data Science Team.

### Libraries/Frameworks Used ###
* [jQuery](http://jquery.com/)
* [Bootstrap](https://getbootstrap.com/)
* [Daemonite's Material UI](https://github.com/Daemonite/material/)
* [i18next](http://i18next.com/) (with the language detector, local storage cache, XHR backend, and jqueryi18next plugins)
* [Chart.js](http://www.chartjs.org/) (to display data as charts on the admin site)

### Plugins Used ###
* [jQuery Form](http://malsup.com/jquery/form/)
* [jQuery Validation](http://jqueryvalidation.org/)
* [Feednami](https://github.com/sekando/feednami-client/)

### Other ###
* [Carasmo's Bootstrap Navigation Drawer](https://jsbin.com/seqola/2/edit?html,css,js,output)
* [Minimal Admin Panel Flat Bootstrap Responsive Web Template](https://w3layouts.com/minimal-admin-panel-flat-bootstrap-responsive-web-template/) (can be used for free as long as you include a backlink)

### Configuration ###
There are areas that require you to insert your own API keys and other information.
* /app.yaml.sample - Only necessary if using Google App Engine. Remove ".sample" from the file name.
* /firebase-messaging-sw.js - Firebase Cloud Messaging sender ID.
* /manifest.json - Firebase Cloud Messaging client ID.
* /admin/includes/globals.php - The total number of households in your town/city.
* /admin/includes/template.html - Google API key near the end of the file.
* /admin/js/custom_scripts.js - Firebase Authentication API key and Firebase URLs.
* /includes/template.html - Google Analytics IDs in the head of the file.
* /js/map.js - Google Client ID, Google API key, and the Google Fusion table ID of the table being used to provide water quality data.

### Credits ###
MyWater-Flint is a joint project between [University of Michigan-Flint](http://www.umflint.edu/) and the [University of Michigan-Ann Arbor Michigan Data Science Team](http://web.eecs.umich.edu/~jabernet/FlintWater/data_dive_summary.html) with support from [Google.org](http://www.google.org/).
