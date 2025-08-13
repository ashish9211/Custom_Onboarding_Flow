require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const usersRouter = require('./routes/users');
const configRouter = require('./routes/config');

const app = express();
app.use(cors());
app.use(express.json());


// You can create a shared pool instance and pass it to routers if needed
// For simplicity, each router creates its own pool here, which also works

app.use('/api/users', usersRouter);
app.use('/api/config', configRouter);

app.get('/', (req, res) => res.send('Server is running...'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});