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


const allowedOrigins = ['http://localhost:8080'];

app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

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
            `SELECT e.id, e.name, e.description, e.background 
             FROM events e 
             JOIN user_certificates uc ON e.id = uc.event_id
             JOIN users u ON u.id = uc.user_id
             WHERE u.id = $1`,
            [req.userId]
        );
        return res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Certificates lookup error:', error);
        return res.status(500).json({ success: false, message: 'خطایی رخ داد. لطفا بعدا تلاش بکنید.' });    
    }
});

app.get('/api/certificate/:eventId', authenticateToken, async(req, res) => {
    try {
        const result = await pool.query(
            `SELECT u.first_name, u.last_name, e.name, e.image, uc.hash,
             e.name_x, e.name_y, e.hash_x, e.hash_y, e.qrcode_x, e.qrcode_y
             FROM events e
             JOIN user_certificates uc ON e.id = uc.event_id
             JOIN users u ON u.id = uc.user_id
             WHERE u.id = $1 AND e.id = $2;`,
            [req.userId, req.params.eventId]
        );
        if (result.rows.length === 0) {
            return res.status(403).json({ success: false, message: 'گواهی یافت نشد.' });
        }
        return res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Certificate fetch error:', error);
        return res.status(500).json({ success: false, message: 'خطایی رخ داد. لطفا بعدا تلاش بکنید.' });    
    }
});

app.get('/api/validate/:hash', async(req, res) => {
    try {
        const result = await pool.query(
            `SELECT u.first_name, u.last_name, e.name, e.image 
             FROM user_certificates uc
             JOIN events e ON e.id = uc.event_id
             JOIN users u ON u.id = uc.user_id
             WHERE uc.hash = $1`,
            [req.params.hash]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'گواهی نامعتبر است.' });
        }
        return res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Validation error:', error);
        return res.status(500).json({ success: false, message: 'خطایی رخ داد. لطفا بعدا تلاش بکنید.' });    
    }
});


app.listen(8000, () => console.log('Backend running on port 8000'));