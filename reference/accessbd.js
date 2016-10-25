//src: http://www.w3schools.com/php/php_ajax_database.asp

function showUserData(str) {
	if (str === "") {
		document.getElementById("output-area").innerHTML = "";
	else { 
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
    	//output respone inside output-area	
    	// 4: request is complete
    	// 200: okay
      if (this.readyState == 4 && this.status == 200) {
          document.getElementById("output-area").innerHTML = this.responseText;
      }
    };
    xmlhttp.open("GET","accessdb.php?q="+str,true);
    xmlhttp.send();
	}
}
