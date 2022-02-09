LOAD DATA LOCAL INFILE 'C:/Users/imbal/Documents/temp/data.csv'
INTO TABLE ppl_salary
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\r\n'
IGNORE 1 LINES
(name, job, salary);