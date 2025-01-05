
const pool = require('../config/database');

const blogController = {
    createBlog: async (req, res) => {
        try {
            const { title, content } = req.body;
            const userId = req.user.id;

            const result = await pool.query(
                'INSERT INTO blogs (title, content, user_id) VALUES ($1, $2, $3) RETURNING *',
                [title, content, userId]
            );
            
            res.status(201).json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getAllBlogs: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;

            const countResult = await pool.query('SELECT COUNT(*) FROM blogs');
            const totalBlogs = parseInt(countResult.rows[0].count);
            const totalPages = Math.ceil(totalBlogs / limit);

            const result = await pool.query(
                `SELECT b.*, u.username as author 
                FROM blogs b 
                JOIN users u ON b.user_id = u.id 
                ORDER BY b.created_at DESC 
                LIMIT $1 OFFSET $2`,
                [limit, offset]
            );

            res.json({
                blogs: result.rows,
                currentPage: page,
                totalPages,
                totalBlogs
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getBlogById: async (req, res) => {
        try {
            const result = await pool.query(
                `SELECT b.*, u.username as author 
                FROM blogs b 
                JOIN users u ON b.user_id = u.id 
                WHERE b.id = $1`,
                [req.params.id]
            );

            if (!result.rows[0]) {
                return res.status(404).json({ error: 'Blog not found' });
            }
            res.json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    updateBlog: async (req, res) => {
        try {
            const { title, content } = req.body;
            const userId = req.user.id;

            const result = await pool.query(
                `UPDATE blogs 
                SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP 
                WHERE id = $3 AND user_id = $4 
                RETURNING *`,
                [title, content, req.params.id, userId]
            );

            if (!result.rows[0]) {
                return res.status(404).json({ error: 'Blog not found or unauthorized' });
            }
            res.json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    deleteBlog: async (req, res) => {
        try {
            const userId = req.user.id;
            const result = await pool.query(
                'DELETE FROM blogs WHERE id = $1 AND user_id = $2 RETURNING id',
                [req.params.id, userId]
            );

            if (!result.rows[0]) {
                return res.status(404).json({ error: 'Blog not found or unauthorized' });
            }
            res.json({ message: 'Blog deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = blogController;