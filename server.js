const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 3000;
const BASE_URL = 'http://20.244.56.144/test/companies';

app.use(cors());

// Helper function to generate a unique ID
const generateUniqueId = (product, company) => {
    return `${company}-${product.id}`;
};

// Helper function to fetch products from a single company
const fetchProductsFromCompany = async (company, categoryname, top, minPrice, maxPrice) => {
    const response = await axios.get(`${BASE_URL}/${company}/categories/${categoryname}/products`, {
        params: { top, minPrice, maxPrice }
    });
    return response.data.products.map(product => ({
        ...product,
        uniqueId: generateUniqueId(product, company),
        company
    }));
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
            const products = await fetchProductsFromCompany(company, categoryname, top, minPrice, maxPrice);
            allProducts = allProducts.concat(products);
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

        // Paginate results
        const paginatedProducts = allProducts.slice((page - 1) * top, page * top);

        res.json(paginatedProducts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching products' });
    }
});

// Endpoint to get product details by unique ID
app.get('/categories/:categoryname/products/:productid', async (req, res) => {
    const { categoryname, productid } = req.params;

    try {
        // Decode the product ID to fetch the original product data
        const [company, id] = productid.split('-');
        const response = await axios.get(`${BASE_URL}/${company}/categories/${categoryname}/products`);
        const product = response.data.products.find(p => p.id === id);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching product details' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
