CREATE TABLE Schools(
    id INT AUTO_INCREMENT,
    school_name VARCHAR(255),
    abbreviation VARCHAR(255),
    logo_dir VARCHAR(255),
    PRIMARY KEY (id)
);

--@block
CREATE TABLE Sports(
    id INT AUTO_INCREMENT,
    name VARCHAR(255),
    term VARCHAR(255),
    league_code VARCHAR(255),
    PRIMARY KEY (id)
);

--@block
CREATE TABLE Rosters(
    id INT AUTO_INCREMENT,
    sport_id INT,
    student_name VARCHAR(255),
    student_grade INT,
    PRIMARY KEY (id),
    FOREIGN KEY (sport_id) REFERENCES Sports(id)
);

--@block
CREATE TABLE Games(
    id INT AUTO_INCREMENT,
    sport_id INT,
    home_id INT,
    away_id INT,
    home_score VARCHAR(255),
    away_score VARCHAR(255),
    game_date DATE,
    PRIMARY KEY (id),
    FOREIGN KEY (sport_id) REFERENCES Sports(id),
    FOREIGN KEY (home_id) REFERENCES Schools(id),
    FOREIGN KEY (away_id) REFERENCES Schools(id)
);

--@block
CREATE TABLE Standings(
    id INT AUTO_INCREMENT,
    sport_id INT,
    school_id INT,
    wins INT,
    losses INT,
    ties INT,
    points INT,
    PRIMARY KEY (id),
    FOREIGN KEY (sport_id) REFERENCES Sports(id),
    FOREIGN KEY (school_id) REFERENCES Schools(id)
);

--@block
ALTER TABLE Games ADD highlights_url VARCHAR(255);

--@block
ALTER TABLE Games ADD game_id VARCHAR(255) UNIQUE;

--@block
SELECT * FROM Sports;

--@block
DELETE FROM Sports;

--@block
ALTER TABLE Sports ADD CONSTRAINT unique_league_code UNIQUE (league_code);

--@block
ALTER TABLE Standings ADD games_played INT;

--@block
SELECT * FROM Sports;

--@block
ALTER TABLE Sports ADD COLUMN league_code VARCHAR(255);

--@block
DELETE FROM Sports;

--@block
ALTER TABLE Standings DROP COLUMN games_played;

--@block
INSERT INTO Schools(school_name, abbreviation, logo_dir) VALUES
    ("Appleby College", "AC", ""),
    ("Upper Canada College", "UCC", ""),
    ("St. Andrew's College", "SAC", ""),
    ("St. Michael's College", "SMC", ""),
    ("Crescent School", "CS", ""),
    ("Royal St. George's College", "RSGC", ""),
    ("Trinity College School", "TCS", ""),
    ("Crestwood Preparatory College", "CPC", "")

--@block
SELECT * FROM Schools;

--@block
SELECT wins, points, school_name FROM Standings INNER JOIN Schools ON Standings.school_id = Schools.id;

--@block
ALTER TABLE Games ADD game_date VARCHAR(255);
ALTER TABLE Games ADD game_time VARCHAR(255);

--@block
ALTER TABLE Standings ADD table_num INT;

--@block
SELECT * FROM Standings;

--@block
DELETE FROM Standings;

--@block
ALTER TABLE Standings ADD COLUMN standings_code VARCHAR(255) UNIQUE;

--@block
INSERT INTO Schools(school_name, abbreviation, logo_dir) VALUES
    ("Villanova College", )

--@block
ALTER TABLE GAMES ADD COLUMN game_code VARCHAR(255) UNIQUE;

--@block
SELECT id FROM Schools WHERE abbreviation = "AC"

--@block
SELECT * FROM Games;

--@block
ALTER TABLE GAMES DROP COLUMN game_id

--@block
ALTER TABLE GAMES ADD COLUMN location VARCHAR(255);

--@block
SELECT * From Games;

--@block
ALTER TABLE Sports ADD UNIQUE (league_code)

--@block
SELECT * FROM Sports

--@block

SELECT school_id, wins, losses, ties, points FROM Standings INNER JOIN Sports ON Standings.sport_id = Sports.id WHERE Sports.league_code = "2860Y8N5D";

--@block
SELECT * FROM Games INNER JOIN Sports ON Games.sport_id = Sports.id WHERE Sports.league_code = "2860Y8N5D";