const express = require('express');
const cors = require('cors');
const routes = require('./routes')
require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use('/api', routes); 

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
