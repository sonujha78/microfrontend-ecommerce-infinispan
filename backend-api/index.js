const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const { digestFetch } = require('./digestAuth');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'mfuser',
  password: 'mfpassword123',
  host: 'localhost',
  port: 5432,
  database: 'ecommerce_products',
});

const INFINISPAN_URL = 'http://127.0.0.1:11222/rest/v2/caches/productCache';
const USERNAME = 'admin';
const PASSWORD = 'MyStrongPass123';
const CACHE_TTL_SECONDS = 30;

async function getFromCache(key) {
  try {
    const res = await digestFetch(`${INFINISPAN_URL}/${key}`, {}, USERNAME, PASSWORD);
    if (res.status === 404) return null;
    if (!res.ok) {
      console.error('Cache read non-OK status:', res.status);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error('Cache read error:', err.message);
    return null;
  }
}

async function setInCache(key, value) {
  try {
    const res = await digestFetch(
      `${INFINISPAN_URL}/${key}?ttl=${CACHE_TTL_SECONDS}`,
      { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(value) },
      USERNAME,
      PASSWORD
    );
    if (!res.ok) {
      console.error('Cache write non-OK status:', res.status, await res.text());
    }
  } catch (err) {
    console.error('Cache write error:', err.message);
  }
}

app.get('/api/products', async (req, res) => {
  const start = Date.now();
  const cacheKey = 'all-products';

  const cached = await getFromCache(cacheKey);
  if (cached) {
    return res.json({ source: 'cache', timeMs: Date.now() - start, products: cached });
  }

  const dbResult = await pool.query('SELECT * FROM products ORDER BY id');
  const products = dbResult.rows;

  await setInCache(cacheKey, products);

  res.json({ source: 'database', timeMs: Date.now() - start, products });
});

app.delete('/api/cache/products', async (req, res) => {
  try {
    const r = await digestFetch(`${INFINISPAN_URL}/all-products`, { method: 'DELETE' }, USERNAME, PASSWORD);
    res.json({ message: 'Cache cleared', status: r.status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(4000, () => {
  console.log('Backend API running on http://localhost:4000');
});
