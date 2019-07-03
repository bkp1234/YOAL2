const express = require('express');
const connectDB = require('./config/db.js');
const app = express(); // expressjs

// it connects database it is called from above case
connectDB();

// to initilaze Middleware
//exteded false helps data to be sent to req.body
app.use(express.json({ extended: false }));
app.get('/', (req, res) => res.send('API running on your ass'));

// here actual routes are defined
// here require is the specified file in local directory
// below /api/users  can be replaced with /users
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/hotelposts', require('./routes/api/hotelposts'));
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log('you are connected fucking server'));
