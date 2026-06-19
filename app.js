const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./src/models');

const userRoutes = require('./src/routes/authenticationRoute');
const productRoutes = require('./src/routes/productDetailsRoute');

dotenv.config();

const app = express();

/** MIDDLEWARES */
app.use(cors());
app.use(express.json());

/** ROUTES */
app.use('/api/auth', userRoutes);
app.use('/api/product', productRoutes);

/** HEALTH CHECK */
app.get('/', (req, res) => {
  res.send('Milk Management API Running');
});



const PORT = process.env.PORT || 8000;

/** SERVER START */
sequelize.authenticate()
.then(() => {
  console.log('✅ PostgreSQL Connected Successfully');

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error('❌ DB Connection Failed:', err);
});