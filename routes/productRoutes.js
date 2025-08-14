const db = require('./config/db')
const router = express.Router()

router.get('/products', (req, res) => {

          db.query('SELECT * FROM products WHERE is_deleted = 0', (err, results) => {

                    if (err) return res.status(500).json({ error: err.message });

                    res.json(results);

          });

});



// Get product by ID

router.get('/products/:id', (req, res) => {

          db.query('SELECT * FROM products WHERE id = ? AND is_deleted = 0', [req.params.id], (err, results) => {

                    if (err) return res.status(500).json({ error: err.message });

                    res.json(results[0] || {});

          });

});



// Search product by keyword

router.get('/products/search/:keyword', (req, res) => {

          const keyword = `%${req.params.keyword}%`;

          db.query('SELECT * FROM products WHERE name LIKE ? AND is_deleted = 0', [keyword], (err, results) => {

                    if (err) return res.status(500).json({ error: err.message });

                    res.json(results);

          });

});



// Create product

router.post('/products', (req, res) => {

          const { name, price, discount, review_count, image_url } = req.body;

          const query = 'INSERT INTO products (name, price, discount, review_count, image_url) VALUES (?, ?, ?, ?, ?)';

          db.query(query, [name, price, discount, review_count, image_url], (err, result) => {

                    if (err) return res.status(500).json({ error: err.message });

                    res.status(201).json({ id: result.insertId, message: 'Product created' });

          });

});



// Update product

router.put('/products/:id', (req, res) => {

          const { name, price, discount, review_count, image_url } = req.body;

          const query = 'UPDATE products SET name = ?, price = ?, discount = ?, review_count = ?, image_url = ? WHERE id = ?';

          db.query(query, [name, price, discount, review_count, image_url, req.params.id], err => {

                    if (err) return res.status(500).json({ error: err.message });

                    res.json({ message: 'Product updated' });

          });

});



// Soft delete product

router.delete('/products/:id', (req, res) => {

          db.query('UPDATE products SET is_deleted = 1 WHERE id = ?', [req.params.id], err => {

                    if (err) return res.status(500).json({ error: err.message });

                    res.json({ message: 'Product soft-deleted' });

          });

});



// Restore product

router.put('/products/restore/:id', (req, res) => {

          db.query('UPDATE products SET is_deleted = 0 WHERE id = ?', [req.params.id], err => {

                    if (err) return res.status(500).json({ error: err.message });

                    res.json({ message: 'Product restored' });

          });

});

module.exports = router;