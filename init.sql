-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(31) UNIQUE NOT NULL,
    userpass VARCHAR(255) NOT NULL,
    first_name VARCHAR(31) NOT NULL,
    last_name VARCHAR(31) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Events Table
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(63) NOT NULL,
    event_date DATE NOT NULL,
    desc TEXT DEFAULT NULL,
    image VARCHAR(255) NOT NULL
);


-- Certificates
CREATE TABLE IF NOT EXISTS user_certificates (
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,

    UNIQUE(user_id, event_id)
);

-- 1. Insert Dummy Users
-- The userpass provided is the bcrypt hash for the plain text password: 'password123'
INSERT INTO users (username, userpass, first_name, last_name)
VALUES 
    ('admin', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'System', 'Admin'),
    ('johndoe', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'John', 'Doe'),
    ('janedoe', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Jane', 'Smith')
ON CONFLICT (username) DO NOTHING;

-- 2. Insert Dummy Events
INSERT INTO events (name, event_date, "desc", image)
VALUES 
    ('Node.js Global Summit', '2023-05-15', 'Annual backend developer conference.', '/images/node-summit.png'),
    ('Vue.js Amsterdam', '2024-02-28', 'The largest Vue framework conference.', '/images/vue-amsterdam.png'),
    ('DockerCon', '2025-10-04', 'Containerization and deployment workshop.', '/images/dockercon.png');

-- 3. Insert Dummy Certificates linking Users to Events
-- Using subqueries ensures we grab the correct auto-incremented IDs dynamically
INSERT INTO user_certificates (user_id, event_id)
VALUES 
    ((SELECT id FROM users WHERE username = 'admin'), (SELECT id FROM events WHERE name = 'Node.js Global Summit' LIMIT 1)),
    ((SELECT id FROM users WHERE username = 'admin'), (SELECT id FROM events WHERE name = 'Vue.js Amsterdam' LIMIT 1)),
    ((SELECT id FROM users WHERE username = 'johndoe'), (SELECT id FROM events WHERE name = 'DockerCon' LIMIT 1)),
    ((SELECT id FROM users WHERE username = 'janedoe'), (SELECT id FROM events WHERE name = 'Node.js Global Summit' LIMIT 1))
ON CONFLICT (user_id, event_id) DO NOTHING;