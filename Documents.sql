CREATE DATABASE documents;

\c documents;

CREATE TYPE access_levels as ENUM ('public', 'hm', 'friend', 'close friend');

CREATE TABLE writing (
	writing_id serial PRIMARY KEY NOT NULL,
	text TEXT NOT NULL,
	title VARCHAR(50) NOT NULL
);

CREATE TABLE writing_access (
	writing_id INT NOT NULL,
	access_level access_levels NOT NULL,
	PRIMARY KEY (writing_id, access_level),
	CONSTRAINT fk_writing FOREIGN KEY (writing_id) REFERENCES writing(writing_id)
);

