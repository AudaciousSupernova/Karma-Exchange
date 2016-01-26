USE main;
-- current update
ALTER TABLE transactionHist MODIFY type varchar(4);

-- CREATE TABLE currentStocks (
-- 	/* stores the history of scores for all users */
--   user_id int,
--   FOREIGN KEY(user_id) REFERENCES users(id),
--   type varchar(50),
--   ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   id int NOT NULL AUTO_INCREMENT,
--   PRIMARY KEY (ID)
-- );