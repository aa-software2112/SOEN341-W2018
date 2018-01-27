To create your database, import tables & access its content:

-Ensure MySQL is installed (MySQL Workbench & MySQL Shell)
-Open MySQL 5.7 Command Line, Create Database by typing: CREATE DATABASE `soen341_project`;
-Open MySQLWorkbench, Go to 'Navigator' -> 'Management' -> 'Data/import' 
-In Import options, check 'Import from self contained file'.
-Press the '...' and select a single SQL file from the 'SQL Database Tables' folder.
-In 'Default Target Schema' pick your new created database called 'soen341_project'
-Repeat the import process until you have imported all the tables to your database. 
-Finally, To see the content inside your database and tables, open you MySQL Command line & write these 4 lines of code.

SHOW DATABASES;

USE SOEN341_PROJECT;
		
SELECT DATABASE();

SHOW TABLES;

DESCRIBE [table];
