
const pool = require('../config/database');

const commentController = {
    createComment: async (req, res) => {
        try {
            const { content, blog_id } = req.body;
            const userId = req.user.id;

            const result = await pool.query(
                'INSERT INTO comments (content, user_id, blog_id) VALUES ($1, $2, $3) RETURNING *',
                [content, userId, blog_id]
            );
            
            res.status(201).json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getCommentsByPost: async (req, res) => {
        try {
            const blogId = req.query.post_id;
            
            const result = await pool.query(
                `SELECT c.*, u.username as author 
                FROM comments c 
                JOIN users u ON c.user_id = u.id 
                WHERE c.blog_id = $1 
                ORDER BY c.created_at DESC`,
                [blogId]
            );

            res.json(result.rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = commentController;