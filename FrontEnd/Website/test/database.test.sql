# Create Testuser
CREATE USER 'dev'@'localhost' IDENTIFIED BY 'dev';
GRANT SELECT,INSERT,UPDATE,DELETE,CREATE,DROP ON *.* TO 'dev'@'localhost';
# Create DB
CREATE DATABASE IF NOT EXISTS `demo` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `demo`;
# Create Table
CREATE TABLE `user` (
  `first_name` varchar(30) NOT NULL,
  `last_name` varchar(30) NOT NULL,
  `username` varchar(30) NOT NULL,
  `email` varchar(60) NOT NULL,
  `password` varchar(60) NOT NULL,
  `country` varchar(40) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `gender` enum('M','F','O') NOT NULL,
  `datetime_entered` datetime NOT NULL,
  `user_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`user_id`,`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

# Add Data
INSERT INTO user (first_name, last_name,username,email,password,country,birth_date,gender,datetime_entered,user_id) VALUES ('henry', 'jamesson', 'jamy003', 'test@test.ca', 'Test12', 'Armenia', '1900-01-01', 'M', '2018-03-22 07:12:37', '5'
);

# Show data
USE demo;
SHOW TABLES;
DESCRIBE question;
