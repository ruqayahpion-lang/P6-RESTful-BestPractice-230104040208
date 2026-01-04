const express = require('express');
const morgan = require ('morgan');
const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.json({ message: 'API Ready' });
});

const productsRoutes = require('./routes/products.routes');
app.use('/api/products',productsRoutes);

app.listen(3000, () => console.log('Server running on port 3000'));

const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

app.get('/api/health',(req,res) =>
res.json({status:'ok', time:new Date().toISOString() }));
