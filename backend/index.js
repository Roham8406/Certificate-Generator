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
const authenticateToken = (req, res, next) => {
    const header = req.headers['authorization'];
    const token = header && header.split(' ')[1];
    if (!token) return res.status(401).json({message: 'دسترسی نامعتبر، مجددا وارد شوید.'});
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status.json({message: 'دسترسی به نشست شما با خطا مواجه شد،‌مجدد وارد شوید.'});
        req.userId = decoded.userId;
        next();
    });
};


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
            { userId: user.id }, 
            JWT_SECRET, 
            { expiresIn: '12h' } // Token expires in 12 hours
        );

        return res.json({ success: true, message: 'ورود انجام شد.', token: token });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ success: false, message: 'خطایی رخ داد. لطفا بعدا تلاش بکنید.' });
    }
});

app.get('/api/my-certificates', authenticateToken, async(req, res) => {
    try {
        const result = await pool.query(
            `SELECT e.id, e.name FROM events e 
             JOIN user_certificates uc ON e.id = uc.event_id
             JOIN users u ON u.id = uc.user_id
             WHERE u.id = $1`,
            [req.userId]
        );
        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ success: false, message: 'خطایی رخ داد. لطفا بعدا تلاش بکنید.' });    
    }
});

app.get('/api/certificate', authenticateToken, async(req, res) => {
    try {
        const result = await pool.query(
            `SELECT u.first_name, u.last_name, e.name, e.image, uc.hash FROM events e
             JOIN user_certificates uc ON e.id = uc.event_id
             JOIN users u ON u.id = uc.user_id
             WHERE u.id = $1 AND e.id = $2;`,
            [req.userId, req.eventId]
        );
        if (result.rows.length === 0) {
            return res.status(401).json({ success: false, message: 'گواهی یافت نشد.' });
        }
        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ success: false, message: 'خطایی رخ داد. لطفا بعدا تلاش بکنید.' });    
    }
});


app.listen(8000, () => console.log('Backend running on port 8000'));