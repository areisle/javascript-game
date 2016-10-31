<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
</head>
<body>
	<?php
		//retrieves the query?
		 $q = intval($_GET['q']);
		 //make connection to database -- assuming mysql dms --switched to sqlite
		 //localhost or "127.0.0.1"-- since database is on same server as php file
		 $link = mysqli_connect('127.0.0.1','my_user', 'my_password','my_database');
		 //not sure where this will output yet
		 if (!$link) {
		    echo "Error: Unable to connect to MySQL." . PHP_EOL;
		    echo "Debugging errno: " . mysqli_connect_errno() . PHP_EOL;
		    echo "Debugging error: " . mysqli_connect_error() . PHP_EOL;
		    exit;
		}
		//select database
		mysqli_select_db($link,"userscores");
		//get data etc. ---create the sql command you want to do
		//this should get top 3 scores
		$sql = "SELECT * FROM scores ORDER BY score, time LIMIT 3";
		$top_scores = mysqli_query($link,$sql);
		
		//close the connection -- this is probably important but not sure why yet
		mysqli_close($link);
	?>
</body>
</html>