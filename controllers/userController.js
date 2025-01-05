
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const userController = {
    register: async (req, res) => {
        try {
            
            const { username, email, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            
            const result = await pool.query(
                'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
                [username, email, hashedPassword]
            );
            
            res.status(201).json(result.rows[0]);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            const user = result.rows[0];

            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
            res.json({ token });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getUserById: async (req, res) => {
        try {
            const result = await pool.query(
                'SELECT id, username, email FROM users WHERE id = $1',
                [req.params.id]
            );
            if (!result.rows[0]) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    updateUser: async (req, res) => {
        try {
            const { username, email } = req.body;
            const result = await pool.query(
                'UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING id, username, email',
                [username, email, req.params.id]
            );
            if (!result.rows[0]) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    deleteUser: async (req, res) => {
        try {
            const result = await pool.query(
                'DELETE FROM users WHERE id = $1 RETURNING id',
                [req.params.id]
            );
            if (!result.rows[0]) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json({ message: 'User deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = userController;