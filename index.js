const express = require('express');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 3000;
const BASE_URL = 'http://20.244.56.144/test/companies';

// Helper function to generate a unique ID
const generateUniqueId = (product) => {
    return `${product.company}-${product.id}`;
};

// Endpoint to get top N products within a category
app.get('/categories/:categoryname/products', async (req, res) => {
    const { categoryname } = req.params;
    const { top = 10, minPrice = 0, maxPrice = Infinity, page = 1, sortBy, order = 'asc' } = req.query;

    try {
        const companies = ['AMZ', 'FLP', 'SNP', 'MYN', 'AZO'];
        let allProducts = [];

        // Fetch products from each company
        for (const company of companies) {
            const response = await axios.get(`${BASE_URL}/${company}/categories/${categoryname}/products`, {
                params: { top, minPrice, maxPrice }
            });
            allProducts = allProducts.concat(response.data.products);
        }

        // Sort products if sortBy parameter is provided
        if (sortBy) {
            allProducts.sort((a, b) => {
                if (order === 'asc') {
                    return a[sortBy] > b[sortBy] ? 1 : -1;
                } else {
                    return a[sortBy] < b[sortBy] ? 1 : -1;
                }
            });
        }

        // Generate unique IDs and paginate results
        const paginatedProducts = allProducts.slice((page - 1) * top, page * top).map(product => ({
            ...product,
            uniqueId: generateUniqueId(product)
        }));

        res.json(paginatedProducts);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching products' });
    }
});

// Endpoint to get product details by unique ID
app.get('/categories/:categoryname/products/:productid', async (req, res) => {
    const { categoryname, productid } = req.params;

    try {
        // Assuming a way to decode the product ID to fetch the original product data
        const [company, id] = productid.split('-');
        const response = await axios.get(`${BASE_URL}/${company}/categories/${categoryname}/products`);
        const product = response.data.products.find(p => p.id === id);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching product details' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
