CREATE TABLE Schools(
    id INT AUTO_INCREMENT,
    school_name VARCHAR(255),
    abbreviation VARCHAR(255) UNIQUE,
    logo_dir VARCHAR(255),
    PRIMARY KEY (id)
);

--@block
CREATE TABLE Sports(
    id INT AUTO_INCREMENT,
    name VARCHAR(255),
    term VARCHAR(255),
    league_code VARCHAR(255) UNIQUE,
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
    highlights_url VARCHAR(255),
    game_date VARCHAR(255),
    game_time VARCHAR(255),
    game_code VARCHAR(255) UNIQUE,
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
    table_num INT,
    standings_code VARCHAR(255) UNIQUE,
    PRIMARY KEY (id),
    FOREIGN KEY (sport_id) REFERENCES Sports(id),
    FOREIGN KEY (school_id) REFERENCES Schools(id)
);

--@block
INSERT INTO Schools(school_name, abbreviation, logo_dir) VALUES
    ('Appleby College', 'AC', 'assets/AC Logo.png'), 
    ('Upper Canada College', 'UCC', 'assets/UCC Logo.png'),
    ('St. Andrew''s College', 'SAC', 'assets/SAC Logo.png'),
    ('St. Michael''s College', 'SMC', 'assets/SMC Logo.png'),
    ('Crescent School', 'CS', 'assets/CS Logo.png'),
    ('Royal St. George''s College', 'RSGC', 'assets/RSGC Logo.png'),
    ('Trinity College School', 'TCS', 'assets/TCS Logo.png'),
    ('Crestwood Preparatory College', 'CPC', 'assets/CPC Logo.png'),
    ('Hillfield Strathallan College', 'HSC', 'assets/HSC Logo.png'),
    ('St. John''s Kilmarnock School', 'SJK', 'assets/SJK Logo.png'),
    ('Lakefield College School', 'LCS', 'assets/LCS Logo.png'),
    ('Pickering College', 'PC', 'assets/PC Logo.png'),
    ('Ridley College', 'RC', 'assets/RC Logo.png'),
    ('De La Salle', 'DLS', 'assets/DLS Logo.png'),
    ('Villanova College', 'VC', 'assets/VC Logo.png'),
    ('Holy Trinity School', 'HTS', 'assets/HTS Logo.png'),
    ('The York School', 'YS', 'assets/YS Logo.png'),
    ('Sterling Hall School', 'SHS', 'assets/SHS Logo.png'),
    ('Trafalgar Castle School', 'TRAF', 'assets/TRAF Logo.png'),
    ('Country Day School', 'CDS', 'assets/CDS Logo.png'),
    ('Bishop Strachan School', 'BSS', 'assets/BSS Logo.png'),
    ('Havergal College', 'HC', 'assets/HC Logo.png'),
    ('Hawthorn School', 'HS', 'assets/HS Logo.png'),
    ('Branksome Hall', 'BH', 'assets/BH Logo.png'),
    ('St. Mildred''s Lightbourn School', 'SMLS', 'assets/SMLS Logo.png'),
    ('Albert College', 'ALB', 'assets/ALB Logo.png'),
    ('Bayview Glen', 'BG', 'assets/BG Logo.png'),
    ('Greenwod School', 'GS', 'assets/GS Logo.png'),
    ('Rosedale Day School', 'RDS', 'assets/RDS Logo.png'),
    ('Toronto Montessori School', 'TMS', 'assets/TMS Logo.png'),
    ('Toronto French School', 'TFS', 'assets/TFS Logo.png');

--@block
SELECT * FROM Schools;

--@block
ALTER TABLE Schools ADD UNIQUE (abbreviation);

--@block
SELECT * FROM Games

--@block
ALTER TABLE Games ADD COLUMN location VARCHAR(255);

--@block 
SELECT * FROM Standings;