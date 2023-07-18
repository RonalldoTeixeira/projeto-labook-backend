-- Active: 1684531626435@@127.0.0.1@3306

-- // TABLE de usuarios

CREATE TABLE
    users (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT CHECK(role IN ('NORMAL', 'ADMIN')) NOT NULL DEFAULT 'NORMAL',
        created_at TEXT DEFAULT(DATETIME('now', 'localtime'))
    );

INSERT INTO
    users (id, name, email, password)
VALUES (
        '02',
        'Testes',
        'tes2te@gmail.com',
        '1231223'
    );

SELECT * FROM users;

CREATE TABLE
    posts (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        content TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT(DATETIME('now', 'localtime')),
        updated_at TEXT NOT NULL DEFAULT(DATETIME('now', 'localtime')),
        likes INTEGER DEFAULT(0) NOT NULL,
        dislikes INTEGER DEFAULT(0) NOT NULL,
        creator_id TEXT NOT NULL,
        FOREIGN KEY (creator_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
    );

SELECT * FROM posts;


INSERT INTO
    posts (id, creator_id, content)
VALUES ('02', '03', 'testando');

CREATE TABLE
    likes_dislikes (
        user_id TEXT NOT NULL,
        post_id TEXT NOT NULL,
        like INTEGER DEFAULT(0) NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (post_id) REFERENCES posts(id)
        ON UPDATE CASCADE ON DELETE CASCADE ON UPDATE CASCADE ON DELETE CASCADE
    );



SELECT * FROM likes_dislikes;

SELECT *
FROM users
    INNER JOIN posts ON users.id = posts.creator_id
    INNER JOIN likes_dislikes ON users.id = likes_dislikes.user_id