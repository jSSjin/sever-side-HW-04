const express = require('express');

const app = express();

const PORT = 3000;

app.use(express.json());

const productRoutes = require('./routes/productRoutes');

app.use('/api', productRoutes);



// Start server

app.listen(PORT, () => {

          console.log(`🚀 Server is running at http://localhost:${PORT}`);

});