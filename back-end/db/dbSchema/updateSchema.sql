-- current update

-- example update
-- USE main;
-- ALTER TABLE users ADD profile_photo varchar(300);

-- ALTER TABLE transactionHist MODIFY type varchar(4);

-- CREATE TABLE currentStocks (
--   /* stores the current stocks for all users */
--   user_id int,
--   FOREIGN KEY(user_id) REFERENCES users(id),
--   target_id int,
--   FOREIGN KEY(target_id) REFERENCES users(id),
--   numberShares int,
--   id int NOT NULL AUTO_INCREMENT,
--   PRIMARY KEY (ID)
-- );
