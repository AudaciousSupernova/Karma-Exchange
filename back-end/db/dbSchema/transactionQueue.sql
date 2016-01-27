CREATE DATABASE transactionQueue;

USE transactionQueue;

CREATE TABLE openTransactions (
  /* a user table */
  user_id varchar(200)  NOT NULL,
  type varchar(4) NOT NULL,
  target_id varchar(200) NOT NULL,
  numberShares int NOT NULL,
  id int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (ID)
);