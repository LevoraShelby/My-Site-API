CREATE DATABASE documents;

\c documents;

CREATE TYPE access_levels as ENUM ('public', 'hm', 'friend', 'close friend');

CREATE TABLE short_story (
	story_id serial PRIMARY KEY NOT NULL,
	story TEXT NOT NULL,
	title VARCHAR(50) NOT NULL
);

CREATE TABLE story_availability (
	story_id INT NOT NULL,
	access_level access_levels NOT NULL,
	PRIMARY KEY (story_id, access_level),
	CONSTRAINT fk_short_story FOREIGN KEY (story_id) REFERENCES short_story(story_id)
);

