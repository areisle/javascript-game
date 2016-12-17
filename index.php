<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Javascript Kitchen Game | Fire the Chef</title>
    <meta name="description" content="A logic puzzle style game set in an 1890's commercial kitchen that will test your cooking skills!">
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
    $loggedin = true;
    //temporary username and password
    $username = "";
    $password = "";
    $confirmPassword = "";
    $usernamecheck = "tempname";
    $passwordcheck = "temp";
    $errors = ["invalid"=>[],"required"=>[], "other"=>[]];
    $formValid = false;
    $new = isset($_GET["new"]) || isset($_GET["choose"]);

    session_start();
    $secure_id = "#$*%& dfuhtt454".session_id().$_SERVER["HTTP_USER_AGENT"].$_SERVER["REMOTE_ADDR"]."1.0.0.9.1.2.001dffgdfje$#*jngJGDRG120003434";
    $userdata = ["login_time"=>time(), "username"=>$username, "secure_id"=>$secure_id];

    if (isset($_GET["choose"])) {
        //remove session data
        session_unset();
        session_destroy();
        $loggedin = false;
    } else if (isset($_SESSION["userdata"])) {
        //check if there's stored session userdata already
        $sessiondata = $_SESSION["userdata"];
        
        echo "<p>".$sessiondata["username"]."</p>";
        if ($sessiondata["secure_id"]==$userdata["secure_id"]) {
            //same person, so allow them to just play again without logging in if desired
            //reset login time? if using it for game duration
            $loggedin = true;
        } else {
            $errors["other"][]="secure not equivilant ";
        }
    } else {
        //not set
    }
    function concatArray($array) {
        $length = count($array);
        if ($length > 0) {
            $result = $array[0];
            if ($length >= 2) {
                $result = $array[$length-2]." and ".$array[$length-1];
                if ($length > 2) {
                    for ($i = $length -3; $i >= 0; $i--) {
                        $result = $array[$i].", ".$result;
                    }
                }
            }
            return $result;
        }
    }

    /* echos errors as an unordered list
    -- parameters: $errors -- array containing 3 arrrays with types of errors
    -- returns: none
    */
    function outputErrors($errors) {
        echo "<ul>";
        $reqErrorCount = count($errors["required"]);
        $invalidErrorCount = count($errors["invalid"]);
        
        if ($reqErrorCount > 0) {
            echo "<li>".concatArray($errors["required"])." ".(($reqErrorCount>1)?"are":"is")." required</li>";
        } 
        if ($invalidErrorCount > 0) {
            echo "<li>".concatArray($errors["invalid"])." ".(($invalidErrorCount>1)?"are":"is")." invalid</li>";
        }
        foreach ($errors["other"] as $error) {
            echo "<li>".$error."</li>";
        }
        echo "</ul>";
    }

    //error testing/ form validation
    if (    isset($_POST["username"])
        &&  isset($_POST["password"])) {
        //for both new and returning users
        $formValid = true;
        $username = $_POST["username"];
        $password = $_POST["password"];
        
        //errors for username
        if ($username=="") {
            $errors["required"][] = "username";
            $formValid = false;
        } else if (trim($username)=="") {
            $errors["invalid"][] = "username";
            $formValid = false;
        }
        //errors for password
        if ($password=="") {
            $errors["required"][] = "password";
            $formValid = false;
        } else if (trim($password)=="") {
            $errors["invalid"][] = "password";
            $formValid = false;
        } else if (isset($_POST["confirm"])) {
            //if new player, also need to confirm the password
            $confirmPassword = trim($_POST["confirm"]);
            if ($confirmPassword == "") {
                $errors["other"][] = "please confirm password.";
                $formValid = false;
            } else if ($confirmPassword != $password ) {
                //error message stating that passwords do not match
                $errors["other"][] = "passwords do not match. please try again.";
                $formValid = false;
            }
        }
        
        $username = trim($username);
        $password = trim($password);

        $errors[] =  "form filled out";
        //will need to add sql checks later when database is added
        //and check if user exists    
    } else {
        //form not filled out
    }
    if($formValid) {
        /* once the information is validated,
        it needs to be checked against the database.
        if new user: check that username is not in use.
        if returning user: check that username exists 
        and that password matches */

        /*once either added or validated against database,
            create a secure id and set as a session variable */
        //start session, set session data --id, username, login time
        $_SESSION["userdata"] = $userdata;
        //session data set
    }

    ?>
	<header>
		<h1>Welcome 
        <?php echo (!$new)?"back":""; ?>
        to Fire the Chef!</h1>
        <p>you've just been hired as an Entremetier</p>
        <p> objective: prepare mushroom risotto</p>
        <?php
        
        if ($formValid) {
            //form is valid
        }

        if (isset($_GET["login"])) { 
            //output errors
            outputErrors($errors);
            ?>

           `<form method="post" action="
           <?php
           echo "index.php?login";
           echo ($new)?"&new":"";
           ?>">
                <div>
                <label for="username">username</label>
                <input type="text" name="username" id="username"
                value="<?php echo $username; ?>"
                /><br/>
                </div>
                <div>
                <label for="password">password</label>
                <input type="password" name="password" id="password" 
                value="<?php echo $password; ?>"/><br/>
                </div>
                <?php
                if ($new) {
                ?>
                <div>
                <label for="password">confirm password</label>
                <input type="password" name="confirm" id="confirm"/><br/>
                </div>
                <p class="no-styles">already have a username? <a class="no-styles" href="index.php?login">login</a> instead.</p>
                <?php
                } else { ?>
                <p class="no-styles">don't have a username? <a class="no-styles" href="index.php?login&new">create account</a></p>
                <?php
                }
                ?>
                <p class="no-styles small">or <a class="no-styles small" href="kitchen.html">play</a> without logging in <br> (warning: scores will not be saved)</p>
                <input type="submit" value="play"/>
            </form>
        <?php  
        } else {
            if ($loggedin && !isset($_GET["choose"])) {
                outputErrors($errors);
            ?>
            <a href="kitchen.html"><div>play again</div></a>
            <a href="index.php?choose"><div>switch player</div></a>
            <?php
            } else {
            ?>
            <a href="index.php?login&new"><div>new player</div></a>
            <a href="index.php?login"><div>returning player</div></a>
            <?php 
            }
        }
        ?>
	</header>
	
</body>
</html>