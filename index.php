<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Kitchen Game</title>
	<link rel="stylesheet" href="stylesheets/reset.css">
	<link rel="icon" href="hat.ico">
	<link rel="stylesheet" href="stylesheets/welcome.css">
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
	<script src="http://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>
    <!-- <script src="scripts/jquery-3.1.1.min.js"></script>
    <script src="scripts/jquery-ui-1.12.1/jquery-ui.min.js"></script> -->
	<script type="text/javascript" src="scripts/main.js" defer></script>
</head>
<body>
    <?php
    $loggedin = false;
    //if form is filled out, get and validate data
    if (    isset($_POST["username"])
        &&  isset($_POST["password"])
        &&  (trim($_POST["username"])=="")
        &&  (trim($_POST["password"])=="")) {
        $username = trim($_POST["username"]);
        $password = trim($_POST["password"]);
        //will need to add sql checks later when database is added
        //check if user exists
    }
    ?>
	<header>
		<h1>Welcome to Fire the Chef!</h1>
        <p>you've just been hired as an Entremetier</p>
        <p> objective: prepare risotto</p>
        <?php
        if (isset($_GET["login"])) { ?>
           `<form method="post" action="index.php">
                <label for="username">username</label>
                <input type="text" name="username" id="username"/><br/>
                <label for="password">password</label>
                <input type="text" name="password" id="password"/><br/>
                <input type="submit" value="play"/>
            </form>
        <?php  
        } else {
            if ($loggedin || isset($_GET["choose"])) {
            ?>
            <a href="kitchen.html"><div>play again</div></a>
            <a href="index.php?choose"><div>switch player</div></a>
            <?php
            } else {
            ?>
            <a href="index.php?login"><div>new player</div></a>
            <a href="index.php?login"><div>returning player</div></a>
            <?php 
            }
        }
        ?>
	</header>
	
</body>
</html>