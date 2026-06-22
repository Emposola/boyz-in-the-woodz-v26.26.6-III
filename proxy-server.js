// proxy-server.js
// Run this to create a local proxy that can access Base44
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors());
app.use(express.json());

// Your Base44 app ID - extract from your code
const APP_ID = 'cbef744a8545c389ef439ea6'; // Update this with your actual App ID

app.get('/api/products', async (req, res) => {
    try {
        // Try to fetch from your local dev server
        const response = await fetch('http://localhost:5173/api/entities/Product');
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.json({ error: err.message, note: 'Make sure your dev server is running' });
    }
});

app.listen(3001, () => {
    console.log('Proxy server running on http://localhost:3001');
    console.log('Visit http://localhost:3001/api/products to see data');
});

console.log(
To use this proxy:
1. npm install express cors node-fetch
2. node proxy-server.js
3. Visit http://localhost:3001/api/products
);
