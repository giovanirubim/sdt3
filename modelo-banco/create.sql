CREATE TABLE IF NOT EXISTS User (
	id int(11) AUTO_INCREMENT,
	name varchar(45),
	password varchar(45),
	secret varchar(32),
	email varchar(45),
	PRIMARY KEY (id)
);