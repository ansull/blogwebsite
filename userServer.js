
const express = require('express');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

const PORT = process.env.USER_PORT || 3000;
app.listen(PORT, () => {
    console.log(`User service running on port ${PORT}`);
});