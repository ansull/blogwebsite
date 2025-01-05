
const express = require('express');
const commentRoutes = require('./routes/commentRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use('/api/comments', commentRoutes);

const PORT = process.env.COMMENT_PORT || 3002;
app.listen(PORT, () => {
    console.log(`Comment service running on port ${PORT}`);
});