CREATE DATABASE IF NOT EXISTS JOhikes;
USE JOhikes;

DROP TABLE IF EXISTS Hikes;
DROP TABLE IF EXISTS Trails;
DROP TABLE IF EXISTS Reviews;
DROP TABLE IF EXISTS Difficulties;
DROP TABLE IF EXISTS Users;

CREATE TABLE IF NOT EXISTS  Users (
   user_id INT PRIMARY KEY AUTO_INCREMENT,
   user_nickname VARCHAR(512) NOT NULL,
   user_email VARCHAR(512) NOT NULL UNIQUE,
   user_password VARCHAR(64) NOT NULL,
   createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP

  
);
 


CREATE TABLE IF NOT EXISTS Difficulties (
   difficulty_level VARCHAR (128),
   difficulty_duration INT NOT NULL,
   difficulty_min_length INT NOT NULL,
   difficulty_height_difference INT NOT NULL,
   
   CONSTRAINT Difficulties_PKEY PRIMARY KEY (difficulty_level),
   CONSTRAINT DIFFICULTY_KEY CHECK (
      difficulty_level = 'easy' AND  difficulty_height_difference =500  AND  difficulty_duration =3 OR
      difficulty_level= 'medium' AND  difficulty_height_difference =800  AND  difficulty_duration=5 OR 
      difficulty_level = 'hard' AND  difficulty_height_difference =1500 AND  difficulty_duration =10 )
);


CREATE TABLE IF NOT EXISTS Trails (
   trail_id INT PRIMARY KEY AUTO_INCREMENT,
   trail_name VARCHAR (128) UNIQUE  NOT NULL ,
   trail_location VARCHAR (128) NOT NULL,
   difficulty_level VARCHAR (128) NOT NULL,
   trail_image VARCHAR (2048) NOT NULL,
   author_id INT NOT NULL,
   trail_longitude FLOAT  NOT NULL DEFAULT 0,
   trail_latitude FLOAT  NOT NULL DEFAULT 0,

   CONSTRAINT TrailKEY1 FOREIGN KEY (author_id) REFERENCES Users(user_id),
   CONSTRAINT Trails_key FOREIGN KEY (difficulty_level) REFERENCES Difficulties(difficulty_level)
 
);


CREATE TABLE IF NOT EXISTS Reviews(
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    review_text VARCHAR(16000) NOT NULL,
    review_rating INT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 

    author_id INT NOT NULL,
    trail_id INT NOT NULL,

    FOREIGN KEY (author_id) REFERENCES Users(user_id),
    FOREIGN KEY (trail_id) REFERENCES Trails(trail_id)
);

CREATE TABLE IF NOT EXISTS Hikes (
   user_id INT NOT NULL,
   trail_id INT NOT NULL,

   CONSTRAINT HIKES_KEY PRIMARY KEY (user_id,trail_id),
   CONSTRAINT HIKESFKEY1 FOREIGN KEY (user_id) REFERENCES Users(user_id),
   CONSTRAINT HIKESFKEY2 FOREIGN KEY (trail_id) REFERENCES Trails(trail_id)
 
);



   
  

 SHOW TABLES;