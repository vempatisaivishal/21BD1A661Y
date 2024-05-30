// src/components/ProductsList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductDetails from './ProductDetails';

const ProductsList = () => {
  const [category, setCategory] = useState('Laptop');
  const [products, setProducts] = useState([]);
  const [top, setTop] = useState(10);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [sortBy, setSortBy] = useState('');
  const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/categories/${category}/products`, {
        params: { top, minPrice, maxPrice, page, sortBy, order }
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, top, minPrice, maxPrice, sortBy, order, page]);

  return (
    <div>
      <h1>Top Products in {category}</h1>
      <div>
        <label>Category:
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Laptop">Laptop</option>
            <option value="Phone">Phone</option>
            {/* Add more categories as needed */}
          </select>
        </label>
        <label>Top N:
          <input type="number" value={top} onChange={(e) => setTop(e.target.value)} />
        </label>
        <label>Min Price:
          <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
        </label>
        <label>Max Price:
          <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
        </label>
        <label>Sort By:
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="">None</option>
            <option value="price">Price</option>
            <option value="rating">Rating</option>
            {/* Add more sorting options as needed */}
          </select>
        </label>
        <label>Order:
          <select value={order} onChange={(e) => setOrder(e.target.value)}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
        <label>Page:
          <input type="number" value={page} onChange={(e) => setPage(e.target.value)} />
        </label>
      </div>
      <ul>
        {products.map(product => (
          <li key={product.uniqueId} onClick={() => setSelectedProduct(product)}>
            {product.name} - ${product.price}
          </li>
        ))}
      </ul>
      {selectedProduct && <ProductDetails product={selectedProduct} />}
    </div>
  );
};

export default ProductsList;
