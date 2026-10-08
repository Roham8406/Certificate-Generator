
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
    description TEXT DEFAULT NULL,
    image VARCHAR(255) NOT NULL,
    background VARCHAR(255) NOT NULL,
    name_x INTEGER NOT NULL DEFAULT 50,
    name_y INTEGER NOT NULL DEFAULT 150,
    qrcode_x INTEGER NOT NULL DEFAULT 300,
    qrcode_y INTEGER NOT NULL DEFAULT 450,
    hash_x INTEGER NOT NULL DEFAULT 200,
    hash_y INTEGER NOT NULL DEFAULT 250
);


-- Certificates
CREATE TABLE IF NOT EXISTS user_certificates (
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    hash VARCHAR(255) NOT NULL DEFAULT 'not null',
    UNIQUE(user_id, event_id)
);

-- 1. Insert Dummy Users
-- The userpass provided is the bcrypt hash for the plain text password: 'password123'
INSERT INTO users (username, userpass, first_name, last_name)
VALUES 
    ('ad', '$2b$10$DHeqU/U5.1FVITfSndMAUe8eT13TvGPenVVmB7vFMx8dspiOJ4tqm', 'System', 'Admin'),
    ('johndoe', '$2b$10$DHeqU/U5.1FVITfSndMAUe8eT13TvGPenVVmB7vFMx8dspiOJ4tqm', 'John', 'Doe'),
    ('janedoe', '$2b$10$DHeqU/U5.1FVITfSndMAUe8eT13TvGPenVVmB7vFMx8dspiOJ4tqm', 'Jane', 'Smith')
ON CONFLICT (username) DO NOTHING;

-- 2. Insert Dummy Events
INSERT INTO events (name, event_date, description, image, background)
VALUES 
    ('Node.js Global Summit', '2023-05-15', 'Annual backend developer conference.', '/images/node-summit.png', '/images/node-summit-bg.png'),
    ('Vue.js Amsterdam', '2024-02-28', 'The largest Vue framework conference.', '/images/vue-amsterdam.png', '/images/vue-amsterdam-bg.png'),
    ('DockerCon', '2025-10-04', 'Containerization and deployment workshop.', '/images/dockercon.png', '/images/dockercon-bg.png');

-- 3. Insert Dummy Certificates linking Users to Events
-- Using subqueries ensures we grab the correct auto-incremented IDs dynamically
INSERT INTO user_certificates (user_id, event_id)
VALUES 
    ((SELECT id FROM users WHERE username = 'ad'), (SELECT id FROM events WHERE name = 'Node.js Global Summit' LIMIT 1)),
    ((SELECT id FROM users WHERE username = 'ad'), (SELECT id FROM events WHERE name = 'Vue.js Amsterdam' LIMIT 1)),
    ((SELECT id FROM users WHERE username = 'johndoe'), (SELECT id FROM events WHERE name = 'DockerCon' LIMIT 1)),
    ((SELECT id FROM users WHERE username = 'janedoe'), (SELECT id FROM events WHERE name = 'Node.js Global Summit' LIMIT 1))
ON CONFLICT (user_id, event_id) DO NOTHING;
