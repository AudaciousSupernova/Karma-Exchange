CREATE DATABASE main;

USE main;

CREATE TABLE users (
  /* a user table */
  name varchar(200)  NOT NULL,
  password varchar(200),
  email varchar(200),
  credits int NOT NULL,
  facebookKey varchar(200),
  id int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (ID)
);

CREATE TABLE scoresHist (
	/* stores the history of scores for all users */
  user_id int,
  FOREIGN KEY(user_id) REFERENCES users(id),
  type varchar(50),
  ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  id int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (ID)
);

/*
to get date
SELECT DATE(`ts`) FROM timedate WHERE id =someId
And if you want the Time part use this query

SELECT TIME(`ts`) FROM timedate WHERE id =someId
*/


CREATE TABLE transactionHist (
  /* stores the history of transaction for all users */
  user_id int,
  FOREIGN KEY(user_id) REFERENCES users(id),
  target_id int,
  FOREIGN KEY(target_id) REFERENCES users(id),
  type varchar(3),
  numberShares int,
  credits int,
  id int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (ID)
);