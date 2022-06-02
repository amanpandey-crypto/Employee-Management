-- Creation of users table
CREATE TABLE IF NOT EXISTS users (
  id INT NOT NULL,
  username varchar(450) NOT NULL,
  email varchar(450) NOT NULL,
  password varchar(450) NOT NULL,
  PRIMARY KEY (id)
);

-- Creation of employee table
CREATE TABLE IF NOT EXISTS employees (
	id	INTEGER NOT NULL,
	owner_id	INTEGER NOT NULL,
	first_name	VARCHAR(450) NOT NULL,
	last_name	VARCHAR(450) NOT NULL,
	email	VARCHAR(450) NOT NULL,
	department	VARCHAR(450) NOT NULL,
	date_created	TIMESTAMP with time zone,
	date_last_updated	TIMESTAMP with time zone,
	PRIMARY KEY(id),
	FOREIGN KEY(owner_id) REFERENCES users(id)
);