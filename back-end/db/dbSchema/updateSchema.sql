USE main;
-- current update
ALTER TABLE transactionHist MODIFY type varchar(4);

CREATE TABLE currentStocks (
  /* stores the history of scores for all users */
  user_id int,
  FOREIGN KEY(user_id) REFERENCES users(id),
  target_id int,
  FOREIGN KEY(target_id) REFERENCES users(id),
  numberShares int,
  id int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (ID)
);