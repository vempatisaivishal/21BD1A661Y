// src/components/ProductDetails.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductDetails = ({ product }) => {
  const [details, setDetails] = useState(null);

  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/categories/${product.category}/products/${product.uniqueId}`);
      setDetails(response.data);
    } catch (error) {
      console.error('Error fetching product details', error);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [product]);

  return (
    <div>
      {details ? (
        <div>
          <h2>{details.name}</h2>
          <p>Price: ${details.price}</p>
          <p>Rating: {details.rating}</p>
          {/* Add more details as needed */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ProductDetails;
