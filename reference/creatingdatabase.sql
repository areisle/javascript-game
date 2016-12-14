/*mysql 
-- my commands for creating a datatbase
---where database name: userscores, table name: scores, 
		name: their name, time: their best time, score: their highest score
		current user name: bob; */
CREATE DATABASE userscores;
SHOW DATABASES;
USE userscores;
/* these commands not finished */
CREATE TABLE scores
(
 username VARCHAR(255),
 highscore real,
 duration TIME,
 scoredate DATE,
 PRIMARY KEY (username)
);
/* INSERT INTO scores (name, score, time) VALUES (myname, myscore, mytime); */



/* commands I think I'll need
// INSERT INTO
// UPDATE, SET (make sure to use where or it will update every entry in the table)
// SELECT 

--on entry user selects new or returning
--enters username --example -- bob
--for new user */
INSERT INTO scores (username) VALUES ('bob');
/* and set to current user (use local storage for this)
--for returning (mysql) --sqlite uses CASE WHEN THEN syntax */
IF EXISTS ( SELECT 1 FROM scores WHERE username=bob) 
BEGIN
	/* and set to current user (use local storage for this) */
	
END
ELSE
	/* tell them they entered the wrong username
	 maybe give a list of close usernames? */
END

/* get top 3 highscores */
SELECT (username, highscore) FROM scores ORDER BY (highscore, duration, scoredate) LIMIT 3;

/* check if new score is better
	select old score */
SELECT highscore FROM scores WHERE username='bob';
---compare this to new score

--update users score
UPDATE scores
SET (score='new score', duration='new time') WHERE username='bob';