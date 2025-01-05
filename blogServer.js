
const express = require('express');
const blogRoutes = require('./routes/blogRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use('/api/blogs', blogRoutes);

const PORT = process.env.BLOG_PORT || 3001;
app.listen(PORT, () => {
    console.log(`Blog service running on port ${PORT}`);
});