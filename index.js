const express = require('express');

const app = express();

const PORT = 3000;

const db = require('./config/db')

app.use(express.json());


// Root test

app.get('/', (req, res) => {

          res.send('hi');

});



// Get all products

app.get('/products', (req, res) => {

          db.query('SELECT * FROM products WHERE is_deleted = 0', (err, results) => {

                    if (err) return res.status(500).json({ error: err.message });

                    res.json(results);

          });

});



// Get product by ID

app.get('/products/:id', (req, res) => {

          db.query('SELECT * FROM products WHERE id = ? AND is_deleted = 0', [req.params.id], (err, results) => {

                    if (err) return res.status(500).json({ error: err.message });

                    res.json(results[0] || {});

          });

});



// Search product by keyword

app.get('/products/search/:keyword', (req, res) => {

          const keyword = `%${req.params.keyword}%`;

          db.query('SELECT * FROM products WHERE name LIKE ? AND is_deleted = 0', [keyword], (err, results) => {

                    if (err) return res.status(500).json({ error: err.message });

                    res.json(results);

          });

});



// Create product

app.post('/products', (req, res) => {

          const { name, price, discount, review_count, image_url } = req.body;

          const query = 'INSERT INTO products (name, price, discount, review_count, image_url) VALUES (?, ?, ?, ?, ?)';

          db.query(query, [name, price, discount, review_count, image_url], (err, result) => {

                    if (err) return res.status(500).json({ error: err.message });

                    res.status(201).json({ id: result.insertId, message: 'Product created' });

          });

});



// Update product

app.put('/products/:id', (req, res) => {

          const { name, price, discount, review_count, image_url } = req.body;

          const query = 'UPDATE products SET name = ?, price = ?, discount = ?, review_count = ?, image_url = ? WHERE id = ?';

          db.query(query, [name, price, discount, review_count, image_url, req.params.id], err => {

                    if (err) return res.status(500).json({ error: err.message });

                    res.json({ message: 'Product updated' });

          });

});



// Soft delete product

app.delete('/products/:id', (req, res) => {

          db.query('UPDATE products SET is_deleted = 1 WHERE id = ?', [req.params.id], err => {

                    if (err) return res.status(500).json({ error: err.message });

                    res.json({ message: 'Product soft-deleted' });

          });

});



// Restore product

app.put('/products/restore/:id', (req, res) => {

          db.query('UPDATE products SET is_deleted = 0 WHERE id = ?', [req.params.id], err => {

                    if (err) return res.status(500).json({ error: err.message });

                    res.json({ message: 'Product restored' });

          });

});



// Start server

app.listen(PORT, () => {

          console.log(`🚀 Server is running at http://localhost:${PORT}`);

});