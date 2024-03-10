USE Project;

CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    password VARCHAR(100)
);

CREATE TABLE Projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    deadline DATE,
    progress DECIMAL(5,2),
    creator_id INT,
    FOREIGN KEY (creator_id) REFERENCES Users(id),
    CONSTRAINT CHK_Projects_progress CHECK (progress IN (10, 20, 30, 40, 50, 60, 70, 80, 90, 100))
);

CREATE TABLE Tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    description TEXT,
    deadline DATE,
    progress DECIMAL(5,2),
    FOREIGN KEY (project_id) REFERENCES Projects(id),
    CONSTRAINT CHK_Tasks_progress CHECK (progress IN (10, 20, 30, 40, 50, 60, 70, 80, 90, 100))
);


CREATE TABLE TaskAssignments (
    task_id INT,
    user_id INT,
    PRIMARY KEY (task_id, user_id),
    FOREIGN KEY (task_id) REFERENCES Tasks(id),
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

CREATE TABLE Comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    task_id INT,
    comment TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (task_id) REFERENCES Tasks(id)
);

ALTER TABLE Comments
ADD COLUMN project_id INT,
ADD CONSTRAINT fk_project_id
FOREIGN KEY (project_id)
REFERENCES Projects(id);

INSERT INTO Comments (user_id, task_id, project_id, comment)
VALUES (2, 2, 500, 'I've completed the initial design for the UI. Will start working on the backend functionality soon.');

INSERT INTO Comments (user_id, task_id, project_id, comment)
VALUES (2, 2, 500, 'I've encountered a small bug while testing. Will debug and fix it before moving forward.');

INSERT INTO Comments (user_id, task_id, project_id, comment)
VALUES (2, 2, 500, 'Great progress so far! Let's schedule a meeting to discuss the next steps and any blockers.');
