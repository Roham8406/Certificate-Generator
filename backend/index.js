const express = require('express');
const cors = require('cors');
const app = express();

// Allow frontend on port 8080 to communicate with this API
app.use(cors());
// Allow Express to parse JSON data sent from the frontend
app.use(express.json());

// Dummy Login Route
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    // Hardcoded check for testing
    if (username === 'admin' && password === 'password') {
        return res.json({ success: true, message: 'Login successful!', token: 'dummy-jwt-token' });
    }
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
});

// Dummy Certificate Route
app.get('/api/certificate', (req, res) => {
    res.json({ message: 'Success! Here is your dummy certificate data.' });
});

app.listen(8000, () => console.log('Backend running on port 8000'));