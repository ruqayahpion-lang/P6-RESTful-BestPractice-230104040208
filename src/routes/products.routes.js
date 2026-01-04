const express = require('express');
const router = express.Router();
const products = require('../data/products.data');

//=====import middleware validasi=========
const validateProduct = require('../middlewares/validateProduct');

// ==================== GET all ====================
router.get('/', (req, res) => {
  res.json({ success: true, data: products });
});

// ==================== GET by ID ====================
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);
  if (!product)
    return res.status(404).json({ success: false, message: 'Product not found' });
  res.json({ success: true, data: product });
});

// ==================== POST ====================
//jalan middleware
router.post('/', validateProduct, (req, res) => {
  const { name, price, stock } = req.body;
  const newProduct = {
    id:Date.now(),
    name,
    price,
    stock:stock ?? 0
  };
  products.push(newProduct);
  res.status(201).json({
    success: true,
    message: 'Product created',
    data: newProduct,
  });
});

// ==================== PUT ====================
//middleware jalan disini
router.put('/:id',validateProduct, (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);

  if (index === -1){
    return res.status(404).json({ success: false, message: 'Product not found' });
}

const {name,price,stock} = req.body;
products[index] = { 
    id, 
    name, 
    price,
    stock: stock ?? products[index].stock ?? 0
 };

  res.json({
    success: true,
    message: 'Product updated',
    data: products[index],
  });
});

// ==================== PATCH ====================
router.patch('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);

  if (!product)
    return res.status(404).json({ success: false, message: 'Product not found' });

  const { name, price, stock } = req.body;
  if (name !== undefined) product.name = name;
  if (price !== undefined) product.price = price;
  if (stock !== undefined) product.stock = stock;

  res.json({
    success: true,
    message: 'Product partially updated',
    data: product,
  });
});

// ==================== DELETE ====================
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);

  if (index === -1)
    return res.status(404).json({ success: false, message: 'Product not found' });

  products.splice(index, 1);
  res.json({ success: true, message: 'Product deleted' });
});
// ==================== TEST ERROR HANDLING ====================
router.get('/crash/test', (req, res, next) => {
  const err = new Error('Tes error sengaja'); // buat error manual
  next(err); // lempar error ke middleware global
});

module.exports = router;
