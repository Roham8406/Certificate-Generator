const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});
const JWT_SECRET = process.env.JWT_SECRET || 'SagToSharif';


app.use(cors());
app.use(express.json());

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        
        if (result.rows.length === 0) {
            return res.status(401).json({ success: false, message: 'نام کاربری نامعتبر است.' });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.userpass);
        
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'رمز عبور نامعتبر است.' });
        }

        const token = jwt.sign(
            { userId: user.id, username: user.username }, 
            JWT_SECRET, 
            { expiresIn: '12h' } // Token expires in 12 hours
        );

        return res.json({ success: true, message: 'ورود انجام شد.', token: token });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ success: false, message: 'خطایی رخ داد. لطفا بعدا تلاش بکنید.' });
    }
});

// Dummy Certificate Route
app.get('/api/certificate', (req, res) => {
    res.json({ message: 'Success! Here is your dummy certificate data.' });
});

app.listen(8000, () => console.log('Backend running on port 8000'));