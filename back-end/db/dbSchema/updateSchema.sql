-- current update

-- use transactionQueue;
-- ALTER TABLE openTransactions DROP COLUMN karma;

-- example update
USE main;

-- ALTER TABLE users ADD profile_photo varchar(300);
-- ALTER TABLE users DROP COLUMN social;

-- ALTER TABLE users DROP COLUMN social_investment;

-- ALTER TABLE users ADD social int DEFAULT 5;

-- ALTER TABLE users ADD social_investment int DEFAULT 5;

-- ALTER TABLE users ADD currentScore int DEFAULT 10;

-- ALTER TABLE scoresHist DROP COLUMN type;

-- ALTER TABLE scoresHist ADD social int;

-- ALTER TABLE scoresHist ADD social_investment int;

-- ALTER TABLE scoresHist  ADD currentScore int;

-- ALTER TABLE scoresHist DROP COLUMN score;

-- ALTER TABLE users ADD access_token varchar(255);

-- ALTER TABLE users ADD social_subScores varchar(200) DEFAULT "{friendScore:5,photoScore:5,feedScore:5}";
-- ALTER TABLE users ADD social_investment_subScores varchar(200) DEFAULT "{numShareHolder:0,sharesOnMarket:0,numTransactions:0}";
-- ALTER TABLE users ADD last_week_expected_social_change varchar(200) DEFAULT "0%";
-- ALTER TABLE users ADD last_week_actual_social_change varchar(200) DEFAULT "0%";
-- ALTER TABLE users ADD next_week_expected_social_change varchar(200) DEFAULT "0%";

ALTER TABLE transactionHist ADD ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

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
