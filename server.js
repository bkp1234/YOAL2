const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('API running on your ass'));
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log('you are connected fucking server'));
