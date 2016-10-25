console.log("javascript is working");
window.onload = function () {
    checkCookie();
}
document.getElementById("get-score").addEventListener("click", function() {
    console.log("clicked get username button");
    setCookie("highscore", getScore(),30);
});
function setCookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
    console.log("entered check cookie function");
    var user = getCookie("highscore");
    if (user != "") {
        alert("High Score " + user);
    } else {
       alert("No High Score yet");
       user = getScore();
       // if (user != "" && user != null) {
       //     setCookie("username", user, 30);
       // }
    }
}
function setScore () {
    console.log("entered setScore function");

}
function getScore () {
    console.log("entered get score function");
    var name = document.getElementById("name").value,
        score = document.getElementById("score").value;
    console.log(name + " " + score);
    return name + " " + score;
}